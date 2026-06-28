import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth';
import { findById, findByField, findOneByField, insert, update, findAll, filter, count } from '../db/database';

const router = Router();

interface AuthRequest extends Request {
  userId?: number;
}

router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = findById<any>('users', req.userId!);

    const today = new Date().toISOString().split('T')[0];
    const allRecords = findByField<any>('learning_records', 'user_id', req.userId);
    const todayRecords = allRecords.filter((r: any) => r.date === today);
    const todayMinutes = todayRecords.reduce((sum: number, r: any) => sum + (r.duration || 0), 0);
    const todayWords = todayRecords.reduce((sum: number, r: any) => sum + (r.items_completed || 0), 0);

    const weeklyData: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayRecords = allRecords.filter((r: any) => r.date === dateStr);
      const minutes = dayRecords.reduce((sum: number, r: any) => sum + (r.duration || 0), 0);
      const wordsLearned = dayRecords.reduce((sum: number, r: any) => sum + (r.items_completed || 0), 0);
      weeklyData.push({ date: dateStr, minutes, words_learned: wordsLearned });
    }

    const enrolledCoursesCount = findByField<any>('enrollments', 'user_id', req.userId).length;

    const achievements = findAll<any>('achievements');
    const userAchievements = findByField<any>('user_achievements', 'user_id', req.userId);
    const userAchievementMap = new Map(userAchievements.map((ua: any) => [ua.achievement_id, ua]));

    const achievementsWithStatus = achievements.map((a: any) => {
      const ua = userAchievementMap.get(a.id);
      return {
        ...a,
        unlocked_at: ua?.unlocked_at || null,
        unlocked: ua ? 1 : 0,
      };
    });
    achievementsWithStatus.sort((a: any, b: any) => a.id - b.id);

    res.json({
      streak: user?.streak || 0,
      totalWords: user?.total_words || 0,
      totalMinutes: user?.total_minutes || 0,
      todayMinutes,
      todayWords,
      weeklyData,
      enrolledCourses: enrolledCoursesCount,
      achievements: achievementsWithStatus,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/record', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { minutes, words } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const allRecords = findByField<any>('learning_records', 'user_id', req.userId);
    const todayRecords = allRecords.filter((r: any) => r.date === today);

    if (todayRecords.length > 0) {
      const existing = todayRecords[0];
      update<any>('learning_records', existing.id, {
        duration: (existing.duration || 0) + (minutes || 0),
        items_completed: (existing.items_completed || 0) + (words || 0),
      });
    } else {
      insert<any>('learning_records', {
        user_id: req.userId!,
        activity_type: 'general',
        duration: minutes || 0,
        items_completed: words || 0,
        correct_count: 0,
        language: 'en',
        date: today,
        created_at: now,
      });
    }

    if (minutes) {
      const user = findById<any>('users', req.userId!);
      if (user) {
        update<any>('users', req.userId!, { total_minutes: (user.total_minutes || 0) + minutes });
      }
    }

    checkAndUpdateStreak(req.userId!);
    checkAchievements(req.userId!);

    res.json({ success: true });
  } catch (error) {
    console.error('Record progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function checkAndUpdateStreak(userId: number) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const user = findById<any>('users', userId);
  if (!user) return;

  const allRecords = findByField<any>('learning_records', 'user_id', userId);
  const yesterdayProgress = allRecords.find((r: any) => r.date === yesterdayStr);
  const todayProgress = allRecords.find((r: any) => r.date === todayStr);

  if (todayProgress) {
    return;
  }

  if (yesterdayProgress) {
    update<any>('users', userId, { streak: (user.streak || 0) + 1 });
  } else {
    update<any>('users', userId, { streak: 1 });
  }
}

function checkAchievements(userId: number) {
  const user = findById<any>('users', userId);
  if (!user) return;

  const achievements = findAll<any>('achievements');
  const userAchievements = findByField<any>('user_achievements', 'user_id', userId);
  const userAchievementMap = new Map(userAchievements.map((ua: any) => [ua.achievement_id, ua]));

  for (const achievement of achievements) {
    let unlocked = false;

    switch (achievement.condition_type) {
      case 'minutes':
        unlocked = (user.total_minutes || 0) >= achievement.condition_value;
        break;
      case 'words':
        unlocked = (user.total_words || 0) >= achievement.condition_value;
        break;
      case 'streak':
        unlocked = (user.streak || 0) >= achievement.condition_value;
        break;
    }

    if (unlocked && !userAchievementMap.has(achievement.id)) {
      insert<any>('user_achievements', {
        user_id: userId,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString(),
      });
    }
  }
}

router.get('/achievements', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const achievements = findAll<any>('achievements');
    const userAchievements = findByField<any>('user_achievements', 'user_id', req.userId);
    const userAchievementMap = new Map(userAchievements.map((ua: any) => [ua.achievement_id, ua]));

    const achievementsWithStatus = achievements.map((a: any) => {
      const ua = userAchievementMap.get(a.id);
      return {
        ...a,
        unlocked_at: ua?.unlocked_at || null,
        unlocked: ua ? 1 : 0,
      };
    });
    achievementsWithStatus.sort((a: any, b: any) => a.id - b.id);

    res.json(achievementsWithStatus);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/leaderboard', (req: Request, res: Response) => {
  try {
    const type = req.query.type as string || 'minutes';
    const limit = parseInt(req.query.limit as string) || 10;

    let users = findAll<any>('users');
    
    let orderBy = 'total_minutes';
    if (type === 'words') orderBy = 'total_words';
    if (type === 'streak') orderBy = 'streak';

    users.sort((a: any, b: any) => (b[orderBy] || 0) - (a[orderBy] || 0));
    const leaders = users.slice(0, limit).map((u: any) => ({
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      total_minutes: u.total_minutes || 0,
      total_words: u.total_words || 0,
      streak: u.streak || 0,
    }));

    res.json(leaders);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/recommendations', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = findById<any>('users', req.userId!);
    
    const userLang = user?.target_language || 'en';
    const userLevel = user?.level || 'beginner';
    const recommendedCourses = filter<any>('courses', (c: any) => c.language === userLang && c.level === userLevel).slice(0, 3);

    const todayMinutes = user?.total_minutes || 0;
    const dailyGoal = user?.daily_goal || 30;
    const progress = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

    const suggestions = [];
    if (progress < 50) {
      suggestions.push('今天的学习目标还未完成，开始15分钟的单词学习吧！');
      suggestions.push('推荐完成一节语法练习，巩固基础语法知识。');
    } else if (progress < 100) {
      suggestions.push('离今日目标还差一点，加油完成它！');
      suggestions.push('来一段听力训练，提升听力水平。');
    } else {
      suggestions.push('太棒了！今日目标已完成，可以挑战更高难度。');
      suggestions.push('尝试一下口语跟读，练习发音。');
    }

    res.json({
      recommendedCourses,
      dailyGoal: user?.daily_goal || 30,
      progress,
      suggestions,
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
