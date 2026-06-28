import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth';
import { findAll, findById, findByField, findOneByField, insert, update, remove, count } from '../db/database';

const router = Router();

interface AuthRequest extends Request {
  userId?: number;
}

router.get('/posts', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    let posts = findAll<any>('community_posts');
    posts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const users = findAll<any>('users');
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const paginatedPosts = posts.slice(offset, offset + limit).map((post: any) => {
      const user = userMap.get(post.user_id);
      return {
        ...post,
        username: user?.username,
        avatar: user?.avatar,
        streak: user?.streak || 0,
      };
    });

    const total = posts.length;

    res.json({
      posts: paginatedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/posts', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Content must be less than 500 characters' });
    }

    const now = new Date().toISOString();
    const newPost = insert<any>('community_posts', {
      user_id: req.userId!,
      content: content.trim(),
      likes: 0,
      comments: 0,
      created_at: now,
    });

    const user = findById<any>('users', req.userId!);
    const post = {
      ...newPost,
      username: user?.username,
      avatar: user?.avatar,
      streak: user?.streak || 0,
    };

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/posts/:id/like', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    const post = findById<any>('community_posts', postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const allLikes = findByField<any>('post_likes', 'user_id', req.userId);
    const existing = allLikes.find((l: any) => l.post_id === postId);

    if (existing) {
      remove('post_likes', existing.id);
      update<any>('community_posts', postId, { likes: (post.likes || 0) - 1 });
      res.json({ liked: false });
    } else {
      insert<any>('post_likes', {
        user_id: req.userId!,
        post_id: postId,
        created_at: new Date().toISOString(),
      });
      update<any>('community_posts', postId, { likes: (post.likes || 0) + 1 });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
