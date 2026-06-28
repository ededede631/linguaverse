import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Play, CheckCircle2, Circle, ArrowLeft, 
  Loader2, Users, Star, ChevronRight, Target, Award, 
  Zap, BookText, MessageCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

const levelLabels: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};

const languageNames: Record<string, string> = {
  en: '英语',
  ja: '日语',
  ko: '韩语',
};

const languageIcons: Record<string, string> = {
  en: '🇬🇧',
  ja: '🇯🇵',
  ko: '🇰🇷',
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const data = await api.courses.getById(Number(id));
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    
    navigate(`/courses/${id}/chapter/1`);
  };

  const handleChapterLearn = (chapterId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    navigate(`/courses/${id}/chapter/${chapterId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">课程不存在</p>
          <Link to="/courses" className="text-primary-600 font-medium">
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-80 md:h-96 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40" />
        </div>
        
        <div className="container mx-auto -mt-36 relative z-10 px-4">
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回课程列表
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                  {levelLabels[course.level]}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                  {languageIcons[course.language]} {languageNames[course.language]}
                </span>
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-white/80 text-lg mb-6 max-w-2xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.totalChapters} 章节</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Clock className="w-5 h-5" />
                  <span>{(course.chapters?.reduce((sum: number, c: any) => sum + (c.duration || 0), 0) || 0) / 60} 小时</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Users className="w-5 h-5" />
                  <span>{Math.floor(Math.random() * 5000) + 1000} 人学习</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-amber-300">4.9</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-2xl sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-slate-900 mb-1">
                    <span className="text-4xl">完全免费</span>
                  </p>
                  <p className="text-slate-500 text-sm">加入即可学习全部内容</p>
                </div>
                
                <button 
                  onClick={handleStartLearning}
                  className="w-full py-3.5 text-white font-medium rounded-xl gradient-btn mb-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Play className="w-5 h-5" />
                  开始学习
                </button>
                
                <button className="w-full py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  加入收藏
                </button>
                
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>永久访问权限</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>配套练习资源</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>学习进度追踪</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>社区答疑服务</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Course Overview */}
            {course.overview && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookText className="w-6 h-6 text-primary-500" />
                  课程概述
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {course.overview}
                </p>
              </div>
            )}

            {/* Learning Objectives */}
            {course.learningObjectives && course.learningObjectives.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-500" />
                  学习目标
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.learningObjectives.map((obj: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-slate-700 text-sm">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Chapters */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-500" />
                课程章节
                <span className="text-sm font-normal text-slate-500 ml-2">共 {course.chapters?.length || 0} 章</span>
              </h2>
              
              <div className="space-y-3">
                {course.chapters?.map((chapter: any, index: number) => (
                  <div
                    key={chapter.id}
                    className="border border-slate-100 rounded-xl overflow-hidden hover:border-primary-200 hover:shadow-md transition-all"
                  >
                    <div
                      onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}
                      className="p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{chapter.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {chapter.duration} 分钟
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs">
                              {chapter.keyPoints?.length || 0} 个知识点
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform duration-200 ${activeChapter === chapter.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    
                    {activeChapter === chapter.id && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                        {/* Chapter Description */}
                        {chapter.description && (
                          <p className="text-slate-600 text-sm mb-4">
                            {chapter.description}
                          </p>
                        )}

                        {/* Key Points */}
                        {chapter.keyPoints && chapter.keyPoints.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500" />
                              学习要点
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {chapter.keyPoints.map((point: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs border border-amber-200">
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Vocabulary */}
                        {chapter.vocabulary && chapter.vocabulary.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
                              <BookText className="w-4 h-4 text-primary-500" />
                              重点词汇
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {chapter.vocabulary.map((word: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs border border-primary-200">
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Exercises */}
                        {chapter.exercises && chapter.exercises.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
                              <Award className="w-4 h-4 text-green-500" />
                              练习类型
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {chapter.exercises.map((exercise: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                                  {exercise}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Start Learning Button */}
                        <button 
                          onClick={() => handleChapterLearn(chapter.id)}
                          className="w-full mt-4 py-2.5 text-sm font-medium text-white rounded-lg gradient-btn flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                          <Play className="w-4 h-4" />
                          开始学习本章
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Features */}
            {course.courseFeatures && course.courseFeatures.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-500" />
                  课程特色
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.courseFeatures.map((feature: string, index: number) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          <Star className="w-5 h-5" />
                        </div>
                        <p className="text-slate-700 font-medium">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Suitable For */}
            {course.suitableFor && course.suitableFor.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  适合人群
                </h3>
                <ul className="space-y-3">
                  {course.suitableFor.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <Circle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5 fill-primary-100" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <button 
                    onClick={handleStartLearning}
                    className="w-full py-3 text-white font-medium rounded-xl gradient-btn flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-5 h-5" />
                    立即开始学习
                  </button>
                </div>
              </div>
            )}

            {/* Learning Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                学习小贴士
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">💡</span>
                  建议每天学习30分钟，持续坚持效果最佳
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">💡</span>
                  每个章节后完成配套练习巩固所学
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">💡</span>
                  尝试用所学语言进行日常表达
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">💡</span>
                  加入社区与其他学习者交流经验
                </li>
              </ul>
            </div>

            {/* Related Learning Modules */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">
                相关学习模块
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/vocabulary"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200">
                    <BookText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">单词记忆</p>
                    <p className="text-xs text-slate-500">词汇量提升</p>
                  </div>
                </Link>
                <Link 
                  to="/grammar"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-200">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">语法练习</p>
                    <p className="text-xs text-slate-500">语法知识巩固</p>
                  </div>
                </Link>
                <Link 
                  to="/speaking"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">口语跟读</p>
                    <p className="text-xs text-slate-500">发音练习</p>
                  </div>
                </Link>
                <Link 
                  to="/listening"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">听力训练</p>
                    <p className="text-xs text-slate-500">听力理解</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
