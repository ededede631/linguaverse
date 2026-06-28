import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/app';

interface Course {
  id: number;
  language: string;
  level: string;
  title: string;
  description: string;
  image: string;
  chapters: any[];
  totalChapters: number;
}

const levelLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-purple-100 text-purple-700',
};

const languageNames: Record<string, string> = {
  en: '英语',
  ja: '日语',
  ko: '韩语',
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage, currentLevel, setLanguage, setLevel } = useAppStore();

  useEffect(() => {
    fetchCourses();
  }, [currentLanguage, currentLevel]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (currentLanguage !== 'all') params.language = currentLanguage;
      if (currentLevel !== 'all') params.level = currentLevel;
      const data: any = await api.courses.getAll(params);
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: 'all', name: '全部' },
    { code: 'en', name: '英语' },
    { code: 'ja', name: '日语' },
    { code: 'ko', name: '韩语' },
  ];

  const levels = [
    { code: 'all', name: '全部级别' },
    { code: 'beginner', name: '初级' },
    { code: 'intermediate', name: '中级' },
    { code: 'advanced', name: '高级' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto py-10">
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">课程中心</h1>
          <p className="text-slate-600">选择适合你的课程，开启系统学习之旅</p>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-700">筛选课程</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-slate-500 mb-2">语言</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${(currentLanguage === lang.code || (lang.code === 'all' && !['en', 'ja', 'ko'].includes(currentLanguage)))
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-2">级别</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl.code}
                  onClick={() => setLevel(lvl.code as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${(currentLevel === lvl.code || (lvl.code === 'all' && !['beginner', 'intermediate', 'advanced'].includes(currentLevel)))
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {lvl.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-white rounded-2xl overflow-hidden card-hover border border-slate-100 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
                      {levelLabels[course.level]}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-700">
                      {languageNames[course.language]}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.totalChapters} 章节</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.chapters?.reduce((sum: number, c: any) => sum + (c.duration || 0), 0) || 0} 分钟</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>已加入 {Math.floor(Math.random() * 5000) + 1000} 人</span>
                    </div>
                    <span className="text-primary-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      开始学习 <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-4">暂无符合条件的课程</p>
            <button
              onClick={() => { setLanguage('all'); setLevel('all'); }}
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              查看全部课程
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
