import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, Clock, Play, CheckCircle2, Circle, ArrowLeft, 
  Loader2, Users, Star, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';

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

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
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
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="relative">
        <div className="h-72 md:h-96 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
        </div>
        
        <div className="container mx-auto -mt-32 relative z-10">
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
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
                  {levelLabels[course.level]}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                  {languageNames[course.language]}
                </span>
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-white/80 text-lg mb-6 max-w-2xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.totalChapters} 章节</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.chapters?.reduce((sum: number, c: any) => sum + (c.duration || 0), 0) || 0} 分钟</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{Math.floor(Math.random() * 5000) + 1000} 人已学习</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>4.9 (1,234 评价)</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-slate-900 mb-1">免费</p>
                  <p className="text-slate-500 text-sm">加入即可学习全部内容</p>
                </div>
                
                <button className="w-full py-3.5 text-white font-medium rounded-xl gradient-btn mb-3 flex items-center justify-center gap-2">
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

      <div className="container mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-8">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-6">课程章节</h2>
              
              <div className="space-y-3">
                {course.chapters?.map((chapter: any, index: number) => (
                  <div
                    key={chapter.id}
                    onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}
                    className="p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {chapter.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <span className="text-slate-500 font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{chapter.title}</h4>
                        <p className="text-sm text-slate-500">{chapter.duration} 分钟</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${activeChapter === chapter.id ? 'rotate-90' : ''}`} />
                    </div>
                    
                    {activeChapter === chapter.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100 ml-14">
                        <p className="text-slate-600 text-sm mb-4">
                          本章将带你学习{chapter.title}的核心内容，通过丰富的例子和练习帮助你掌握知识点。
                        </p>
                        <button className="px-4 py-2 text-sm font-medium text-white rounded-lg gradient-btn flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          开始学习
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">课程介绍</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed">
                  {course.description}本课程由资深语言教育专家精心设计，采用科学的教学方法，
                  帮助你循序渐进地掌握{languageNames[course.language]}语言。
                </p>
                <h3 className="font-semibold text-slate-900 mt-6 mb-3">你将学到什么</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    系统掌握{levelLabels[course.level]}{languageNames[course.language]}语法体系
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    积累 500+ 核心词汇，熟练运用日常表达
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    提升听说读写综合能力
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    了解语言背后的文化知识
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">适合人群</h3>
              <ul className="space-y-3">
                {[
                  '零基础或基础薄弱的学习者',
                  '想系统提升语言能力的人',
                  '准备语言考试的学生',
                  '对目标语言文化感兴趣的爱好者',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <Circle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
