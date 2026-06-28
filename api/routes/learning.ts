import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth';
import { findByField, findOneByField, insert, update, findAll, findById, filter } from '../db/database';

const router = Router();

interface AuthRequest extends Request {
  userId?: number;
}

router.get('/vocabulary', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const language = req.query.language as string || 'en';
    const level = req.query.level as string || 'beginner';
    const limit = parseInt(req.query.limit as string) || 20;

    let words = filter<any>('vocabulary', (v: any) => v.language === language && v.level === level);
    words.sort((a: any, b: any) => a.id - b.id);
    words = words.slice(0, limit);

    const userVocabList = findByField<any>('user_vocabulary', 'user_id', req.userId);
    const userVocabMap = new Map(userVocabList.map((uv: any) => [uv.vocabulary_id, uv]));

    const result = words.map((v: any) => {
      const uv = userVocabMap.get(v.id);
      return {
        ...v,
        mastered: uv ? (uv.status === 'mastered' ? 1 : 0) : 0,
        review_count: uv?.review_count || 0,
        last_reviewed_at: uv?.last_review || null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/vocabulary/:id/review', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const wordId = parseInt(req.params.id);
    const { mastered } = req.body;
    const now = new Date().toISOString();

    const userVocabList = findByField<any>('user_vocabulary', 'user_id', req.userId);
    const existing = userVocabList.find((uv: any) => uv.vocabulary_id === wordId);

    if (existing) {
      update<any>('user_vocabulary', existing.id, {
        status: mastered ? 'mastered' : 'learning',
        review_count: existing.review_count + 1,
        last_review: now,
      });
    } else {
      insert<any>('user_vocabulary', {
        user_id: req.userId!,
        vocabulary_id: wordId,
        status: mastered ? 'mastered' : 'learning',
        review_count: 1,
        next_review: now,
        last_review: now,
      });
    }

    if (mastered) {
      const user = findById<any>('users', req.userId!);
      if (user) {
        update<any>('users', req.userId!, { total_words: (user.total_words || 0) + 1 });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Review vocabulary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/grammar', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const language = req.query.language as string || 'en';
    const level = req.query.level as string || 'beginner';
    const limit = parseInt(req.query.limit as string) || 10;

    let questions = filter<any>('grammar_questions', (q: any) => q.language === language && q.level === level);
    
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    questions = questions.slice(0, limit);

    const result = questions.map((q: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get grammar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/listening', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const language = req.query.language as string || 'en';
    const level = req.query.level as string || 'beginner';

    let materials = filter<any>('listening_materials', (m: any) => m.language === language && m.level === level);
    materials.sort((a: any, b: any) => a.id - b.id);

    res.json(materials);
  } catch (error) {
    console.error('Get listening error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/speaking', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const language = req.query.language as string || 'en';
    const level = req.query.level as string || 'beginner';

    let sentences = filter<any>('speaking_sentences', (s: any) => s.language === language && s.level === level);
    
    for (let i = sentences.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
    }
    sentences = sentences.slice(0, 10);

    res.json(sentences);
  } catch (error) {
    console.error('Get speaking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
