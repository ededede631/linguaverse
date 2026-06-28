import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, ChevronRight, Filter, Loader2, Target, Award, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/app';

interface Course {
  id: number;
  language: string;
  level: string;
  title: string;
  description: string;
  image: string;
  overview?: string;
  learningObjectives?: string[];
  courseFeatures?: string[];
  suitableFor?: string[];
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

const languageColors: Record<string, string> = {
  en: 'bg-blue-100 text-blue-700',
  ja: 'bg-rose-100 text-rose-700',
  ko: 'bg-indigo-100 text-indigo-700',
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
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
    { code: 'all', name: '全部', flag: '🌍' },
    { code: 'en', name: '英语', flag: '🇬🇧' },
    { code: 'ja', name: '日语', flag: '🇯🇵' },
    { code: 'ko', name: '韩语', flag: '🇰🇷' },
  ];

  const levels = [
    { code: 'all', name: '全部级别' },
    { code: 'beginner', name: '初级' },
    { code: 'intermediate', name: '中级' },
    { code: 'advanced', name: '高级' },
  ];

  const getTotalDuration = (chapters: any[]) => {
    const totalMinutes = chapters.reduce((sum, chapter) => sum + (chapter.duration || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}` : `${minutes}分钟`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">课程中心</h1>
          <p className="text-slate-600">选择适合你的课程，开启系统学习之旅</p>
        </div>

        {/* Filter Section */}
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
                    {lang.flag} {lang.name}
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

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">{courses.length}</div>
            <div className="text-sm text-slate-500">全部课程</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {courses.filter(c => c.level === 'beginner').length}
            </div>
            <div className="text-sm text-slate-500">初级课程</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">
              {courses.filter(c => c.level === 'intermediate').length}
            </div>
            <div className="text-sm text-slate-500">中级课程</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {courses.filter(c => c.level === 'advanced').length}
            </div>
            <div className="text-sm text-slate-500">高级课程</div>
          </div>
        </div>

        {/* Course List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all"
              >
                <Link
                  to={`/courses/${course.id}`}
                  className="block"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Course Image */}
                    <div className="md:w-72 h-48 md:h-auto relative flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
                          {levelLabels[course.level]}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${languageColors[course.language]}`}>
                          {languageNames[course.language]}
                        </span>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="flex-1 p-6">
                      <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">{course.description}</p>
                      
                      {/* Course Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.totalChapters} 章节</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTotalDuration(course.chapters)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 5000) + 1000} 人学习</span>
                        </div>
                      </div>

                      {/* Learning Objectives Preview */}
                      {course.learningObjectives && course.learningObjectives.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-slate-700">学习目标</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {course.learningObjectives.slice(0, 3).map((obj, index) => (
                              <span key={index} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-200">
                                {obj.length > 20 ? obj.substring(0, 20) + '...' : obj}
                              </span>
                            ))}
                            {course.learningObjectives.length > 3 && (
                              <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md">
                                +{course.learningObjectives.length - 3} 更多
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Course Features Preview */}
                      {course.courseFeatures && course.courseFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.courseFeatures.slice(0, 2).map((feature, index) => (
                            <span key={index} className="px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="md:w-32 flex items-center justify-center p-6 border-t md:border-t-0 md:border-l border-slate-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600 mb-1">
                          免费
                        </div>
                        <div className="text-xs text-slate-500 mb-3">完整课程</div>
                        <div className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 transition-colors flex items-center gap-1 justify-center">
                          开始学习 <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Expanded Section */}
                {expandedCourse === course.id && (
                  <div className="border-t border-slate-100 p-6 bg-slate-50">
                    {/* Overview */}
                    {course.overview && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary-500" />
                          课程介绍
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {course.overview}
                        </p>
                      </div>
                    )}

                    {/* Chapters Preview */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-800 mb-3">课程章节预览</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {course.chapters.slice(0, 6).map((chapter, index) => (
                          <div key={chapter.id} className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-slate-800 text-sm mb-1">{chapter.title}</h5>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{chapter.duration}分钟</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {course.chapters.length > 6 && (
                        <p className="text-sm text-slate-500 mt-3 text-center">
                          还有 {course.chapters.length - 6} 个章节...
                        </p>
                      )}
                    </div>

                    {/* Suitable For */}
                    {course.suitableFor && course.suitableFor.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-500" />
                          适合人群
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {course.suitableFor.map((item, index) => (
                            <span key={index} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <div className="border-t border-slate-100 p-3 bg-slate-50/50">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpandedCourse(expandedCourse === course.id ? null : course.id);
                    }}
                    className="w-full text-center text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    {expandedCourse === course.id ? '收起详情' : '查看详情'}
                  </button>
                </div>
              </div>
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
