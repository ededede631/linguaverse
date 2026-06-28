import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Clock, BookOpen, Flame, Trophy, Target,
  TrendingUp, Calendar, Star, Award, ChevronRight, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export default function Progress() {
  const { isAuthenticated, user } = useAuthStore();
  const [progress, setProgress] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardType, setLeaderboardType] = useState('minutes');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      fetchLeaderboard();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [progressData, achievementsData]: any = await Promise.all([
        api.progress.get(),
        api.progress.getAchievements(),
      ]);
      setProgress(progressData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const data: any = await api.progress.getLeaderboard({ type: leaderboardType, limit: 5 });
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaderboard();
    }
  }, [leaderboardType, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <LayoutDashboard className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">登录后查看进度</h2>
          <p className="text-slate-500 mb-6">登录即可查看你的学习进度和成就</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 text-white font-medium rounded-full gradient-btn">
            立即登录
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto py-10">
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">学习中心</h1>
          <p className="text-slate-600">查看你的学习进度，持续进步</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{formatTime(progress?.totalMinutes || 0)}</p>
            <p className="text-slate-500 text-sm">累计学习时长</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{progress?.totalWords || 0}</p>
            <p className="text-slate-500 text-sm">累计单词数</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{progress?.streak || 0} 天</p>
            <p className="text-slate-500 text-sm">连续学习</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{unlockedCount} / {achievements.length}</p>
            <p className="text-slate-500 text-sm">已获得成就</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  今日学习目标
                </h2>
                <span className="text-sm text-slate-500">{user?.daily_goal || 30} 分钟</span>
              </div>
              
              <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((progress?.todayMinutes || 0) / (user?.daily_goal || 30)) * 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-700">
                    {progress?.todayMinutes || 0} / {user?.daily_goal || 30} 分钟
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-slate-500">
                {progress?.todayMinutes >= (user?.daily_goal || 30) 
                  ? '🎉 太棒了！今日目标已完成！' 
                  : `还差 ${(user?.daily_goal || 30) - (progress?.todayMinutes || 0)} 分钟完成今日目标，加油！`
                }
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                本周学习统计
              </h2>
              
              <div className="flex items-end justify-between h-40 gap-2">
                {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => {
                  const minutes = Math.floor(Math.random() * 60 + 10);
                  const maxHeight = 100;
                  const height = (minutes / 70) * maxHeight;
                  const isToday = index === new Date().getDay() - 1;
                  
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center flex-1 justify-end">
                        <span className="text-xs text-slate-500 mb-2">{minutes}分</span>
                        <div 
                          className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${
                            isToday 
                              ? 'bg-gradient-to-t from-primary-600 to-cyan-500' 
                              : 'bg-gradient-to-t from-slate-300 to-slate-200'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className={`text-sm mt-3 ${isToday ? 'text-primary-600 font-medium' : 'text-slate-500'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  成就徽章
                </h2>
                <Link to="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                  查看全部 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {achievements.slice(0, 10).map((achievement) => {
                  const IconComponent = 
                    achievement.icon === 'Star' ? Star :
                    achievement.icon === 'Flame' ? Flame :
                    achievement.icon === 'BookOpen' ? BookOpen :
                    achievement.icon === 'Clock' ? Clock :
                    achievement.icon === 'Trophy' ? Trophy :
                    achievement.icon === 'Award' ? Award :
                    achievement.icon === 'TrendingUp' ? TrendingUp : Star;
                  
                  return (
                    <div 
                      key={achievement.id}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50' 
                          : 'bg-slate-50 opacity-50 grayscale'
                      }`}
                      title={achievement.description}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                          : 'bg-slate-200 text-slate-400'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-center text-slate-700 font-medium">{achievement.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                排行榜
              </h2>
              
              <div className="flex gap-2 mb-4">
                {[
                  { type: 'minutes', label: '时长' },
                  { type: 'words', label: '单词' },
                  { type: 'streak', label: '连续' },
                ].map((tab) => (
                  <button
                    key={tab.type}
                    onClick={() => setLeaderboardType(tab.type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      leaderboardType === tab.type
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-200 text-slate-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="w-10 h-10 rounded-full bg-slate-200"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{user.username}</p>
                      <p className="text-xs text-slate-500">
                        {leaderboardType === 'minutes' && `${user.total_minutes} 分钟`}
                        {leaderboardType === 'words' && `${user.total_words} 单词`}
                        {leaderboardType === 'streak' && `${user.streak} 天`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl p-6 text-white">
              <h3 className="font-display text-lg font-bold mb-2">快速开始学习</h3>
              <p className="text-white/80 text-sm mb-4">选择一个模块，继续你的学习之旅</p>
              <div className="space-y-2">
                <Link 
                  to="/learn/vocabulary"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">单词记忆</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Link>
                <Link 
                  to="/learn/grammar"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span className="font-medium">语法练习</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
