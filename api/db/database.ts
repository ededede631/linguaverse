import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'linguaverse.json');

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar: string;
  target_language: string;
  level: string;
  daily_goal: number;
  streak: number;
  total_words: number;
  total_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  language: string;
  level: string;
  title: string;
  description: string;
  image: string;
  created_at: string;
}

export interface Chapter {
  id: number;
  course_id: number;
  title: string;
  duration: number;
  content: string;
  sort_order: number;
}

export interface Vocabulary {
  id: number;
  language: string;
  level: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  example_translation: string;
}

export interface GrammarQuestion {
  id: number;
  language: string;
  level: string;
  question: string;
  options: string;
  correct_answer: number;
  explanation: string;
}

export interface ListeningMaterial {
  id: number;
  language: string;
  level: string;
  title: string;
  audio_url: string;
  transcript: string;
  translation: string;
  duration: number;
}

export interface SpeakingSentence {
  id: number;
  language: string;
  level: string;
  sentence: string;
  translation: string;
  audio_url: string;
}

export interface UserVocabulary {
  id: number;
  user_id: number;
  vocabulary_id: number;
  status: string;
  review_count: number;
  next_review: string;
  last_review: string;
}

export interface LearningRecord {
  id: number;
  user_id: number;
  activity_type: string;
  duration: number;
  items_completed: number;
  correct_count: number;
  language: string;
  date: string;
  created_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number;
  enrolled_at: string;
  last_studied: string;
}

export interface CommunityPost {
  id: number;
  user_id: number;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
}

export interface PostLike {
  id: number;
  user_id: number;
  post_id: number;
  created_at: string;
}

interface Database {
  users: User[];
  courses: Course[];
  chapters: Chapter[];
  vocabulary: Vocabulary[];
  grammar_questions: GrammarQuestion[];
  listening_materials: ListeningMaterial[];
  speaking_sentences: SpeakingSentence[];
  user_vocabulary: UserVocabulary[];
  learning_records: LearningRecord[];
  achievements: Achievement[];
  user_achievements: UserAchievement[];
  enrollments: Enrollment[];
  community_posts: CommunityPost[];
  post_likes: PostLike[];
  _nextIds: { [key: string]: number };
}

let db: Database = {
  users: [],
  courses: [],
  chapters: [],
  vocabulary: [],
  grammar_questions: [],
  listening_materials: [],
  speaking_sentences: [],
  user_vocabulary: [],
  learning_records: [],
  achievements: [],
  user_achievements: [],
  enrollments: [],
  community_posts: [],
  post_likes: [],
  _nextIds: {},
};

let _isInitialized = false;

function getNextId(table: keyof Omit<Database, '_nextIds'>): number {
  if (!db._nextIds[table]) {
    const items = (db as any)[table] as any[];
    db._nextIds[table] = items.length > 0 ? Math.max(...items.map((i: any) => i.id)) + 1 : 1;
  }
  const id = db._nextIds[table];
  db._nextIds[table]++;
  return id;
}

function saveToFile() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save database:', e);
  }
}

function loadFromFile(): boolean {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      db = JSON.parse(data);
      if (!db._nextIds) db._nextIds = {};
      return true;
    }
  } catch (e) {
    console.error('Failed to load database:', e);
  }
  return false;
}

export function initDatabase() {
  if (_isInitialized) return;
  loadFromFile();
  _isInitialized = true;
  console.log('Database initialized');
}

export function insert<T extends { id?: number }>(
  table: keyof Omit<Database, '_nextIds'>,
  data: Omit<T, 'id'>
): T {
  const id = getNextId(table);
  const record = { id, ...data } as T;
  (db as any)[table].push(record);
  saveToFile();
  return record;
}

export function findAll<T>(table: keyof Omit<Database, '_nextIds'>): T[] {
  return [...(db as any)[table]];
}

export function findById<T extends { id: number }>(
  table: keyof Omit<Database, '_nextIds'>,
  id: number
): T | undefined {
  return (db as any)[table].find((item: T) => item.id === id);
}

export function findByField<T>(
  table: keyof Omit<Database, '_nextIds'>,
  field: string,
  value: any
): T[] {
  return (db as any)[table].filter((item: any) => item[field] === value);
}

export function findOneByField<T>(
  table: keyof Omit<Database, '_nextIds'>,
  field: string,
  value: any
): T | undefined {
  return (db as any)[table].find((item: any) => item[field] === value);
}

export function filter<T>(
  table: keyof Omit<Database, '_nextIds'>,
  predicate: (item: T) => boolean
): T[] {
  return (db as any)[table].filter(predicate);
}

export function update<T extends { id: number }>(
  table: keyof Omit<Database, '_nextIds'>,
  id: number,
  data: Partial<T>
): T | undefined {
  const arr = (db as any)[table] as T[];
  const index = arr.findIndex((item: any) => item.id === id);
  if (index === -1) return undefined;
  arr[index] = { ...arr[index], ...data };
  saveToFile();
  return arr[index];
}

export function remove(
  table: keyof Omit<Database, '_nextIds'>,
  id: number
): boolean {
  const arr = (db as any)[table] as any[];
  const index = arr.findIndex((item: any) => item.id === id);
  if (index === -1) return false;
  arr.splice(index, 1);
  saveToFile();
  return true;
}

export function count(table: keyof Omit<Database, '_nextIds'>): number {
  return (db as any)[table].length;
}

export function getDb() {
  return db;
}

export default {
  initDatabase,
  insert,
  findAll,
  findById,
  findByField,
  findOneByField,
  filter,
  update,
  remove,
  count,
  getDb,
};
