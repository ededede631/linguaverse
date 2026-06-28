import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { insert, findByField, findOneByField, findById, update } from '../db/database';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'linguaverse-secret-key-2024';

interface AuthRequest extends Request {
  userId?: number;
}

function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/register', (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingByUsername = findOneByField('users', 'username', username);
    const existingByEmail = findOneByField('users', 'email', email);
    if (existingByUsername || existingByEmail) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const now = new Date().toISOString();

    const newUser = insert<any>('users', {
      username,
      email,
      password_hash: passwordHash,
      avatar,
      target_language: 'en',
      level: 'beginner',
      daily_goal: 30,
      streak: 0,
      total_words: 0,
      total_minutes: 0,
      created_at: now,
      updated_at: now,
    });

    const userId = newUser.id;
    const token = generateToken(userId);

    const user = findById<any>('users', userId);
    const { password_hash, ...safeUser } = user;

    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    let user = findOneByField<any>('users', 'username', username);
    if (!user) {
      user = findOneByField<any>('users', 'email', username);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken(user.id);

    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = findById<any>('users', req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { targetLanguage, level, dailyGoal, username } = req.body;

    if (username) {
      const existing = findOneByField<any>('users', 'username', username);
      if (existing && existing.id !== req.userId) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    if (username !== undefined) updateData.username = username;
    if (targetLanguage !== undefined) updateData.target_language = targetLanguage;
    if (level !== undefined) updateData.level = level;
    if (dailyGoal !== undefined) updateData.daily_goal = dailyGoal;

    const updatedUser = update<any>('users', req.userId!, updateData);

    const { password_hash, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
