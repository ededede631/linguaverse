import { Router, Request, Response } from 'express';
import { authMiddleware } from './auth';
import { findAll, findById, findByField, findOneByField, insert, filter } from '../db/database';

const router = Router();

interface AuthRequest extends Request {
  userId?: number;
}

router.get('/', (req: Request, res: Response) => {
  try {
    const { language, level } = req.query;
    
    let courses = findAll<any>('courses');

    if (language) {
      courses = courses.filter((c: any) => c.language === language);
    }
    if (level) {
      courses = courses.filter((c: any) => c.level === level);
    }

    courses.sort((a: any, b: any) => a.id - b.id);

    const coursesWithChapters = courses.map((course: any) => {
      const chapters = findByField<any>('chapters', 'course_id', course.id)
        .sort((a: any, b: any) => a.sort_order - b.sort_order || a.id - b.id)
        .map((ch: any) => ({ id: ch.id, title: ch.title, duration: ch.duration }));
      return { ...course, chapters, totalChapters: chapters.length };
    });

    res.json(coursesWithChapters);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = findById<any>('courses', courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const chapters = findByField<any>('chapters', 'course_id', courseId)
      .sort((a: any, b: any) => a.sort_order - b.sort_order || a.id - b.id)
      .map((ch: any) => ({ id: ch.id, title: ch.title, duration: ch.duration, content: ch.content }));
    course.chapters = chapters;
    course.totalChapters = chapters.length;

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/enroll', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = findById<any>('courses', courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const userEnrollments = findByField<any>('enrollments', 'user_id', req.userId);
    const existing = userEnrollments.find((e: any) => e.course_id === courseId);
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled' });
    }

    const now = new Date().toISOString();
    insert<any>('enrollments', {
      user_id: req.userId!,
      course_id: courseId,
      progress: 0,
      enrolled_at: now,
      last_studied: now,
    });

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/my-courses', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userEnrollments = findByField<any>('enrollments', 'user_id', req.userId);
    userEnrollments.sort((a: any, b: any) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime());

    const userCourses = userEnrollments.map((enrollment: any) => {
      const course = findById<any>('courses', enrollment.course_id);
      return {
        ...course,
        progress: enrollment.progress,
        started_at: enrollment.enrolled_at,
      };
    }).filter((c: any) => c.id !== undefined);

    res.json(userCourses);
  } catch (error) {
    console.error('Get user courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
