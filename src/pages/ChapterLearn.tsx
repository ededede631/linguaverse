import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  Award,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Volume2,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  MessageCircle,
  BookText
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function ChapterLearn() {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'words' | 'grammar'>('content');
  const [showTranslation, setShowTranslation] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchChapter();
  }, [courseId, chapterId]);

  const fetchChapter = async () => {
    if (!courseId || !chapterId) return;
    setLoading(true);
    try {
      const data: any = await api.courses.getById(Number(courseId));
      setCourse(data);
      const ch = data.chapters.find((c: any) => c.id === Number(chapterId));
      setChapter(ch);
      if (ch) {
        document.title = `${ch.title} - ${data.title}`;
      }
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseAnswer = (index: number, answer: string) => {
    setExerciseAnswers({ ...exerciseAnswers, [index]: answer });
  };

  const checkAnswers = () => {
    setShowResults(true);
    if (chapter?.exercises) {
      const correctCount = chapter.exercises.filter(
        (ex: any, i: number) => exerciseAnswers[i] === ex.correctAnswer
      ).length;
      if (correctCount >= chapter.exercises.length * 0.6) {
        setIsCompleted(true);
        api.learning.recordProgress('vocabulary', 5);
      }
    }
  };

  const goToPrevChapter = () => {
    if (!course || !chapter) return;
    const prevChapter = course.chapters.find((c: any) => c.id === chapter.id - 1);
    if (prevChapter) {
      navigate(`/courses/${courseId}/chapter/${prevChapter.id}`);
      setActiveTab('content');
      setShowResults(false);
      setExerciseAnswers({});
      setShowTranslation(false);
    }
  };

  const goToNextChapter = () => {
    if (!course || !chapter) return;
    const nextChapter = course.chapters.find((c: any) => c.id === chapter.id + 1);
    if (nextChapter) {
      navigate(`/courses/${courseId}/chapter/${nextChapter.id}`);
      setActiveTab('content');
      setShowResults(false);
      setExerciseAnswers({});
      setShowTranslation(false);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const getScore = () => {
    if (!chapter?.exercises) return 0;
    const correct = chapter.exercises.filter(
      (ex: any, i: number) => exerciseAnswers[i] === ex.correctAnswer
    ).length;
    return correct;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">登录后开始学习</h2>
          <p className="text-slate-500 mb-6">登录即可学习完整课程内容，追踪你的学习进度</p>
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

  if (!course || !chapter) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">章节不存在</p>
          <Link to={`/courses/${courseId}`} className="text-primary-600 font-medium">
            返回课程详情
          </Link>
        </div>
      </div>
    );
  }

  const isFirstChapter = chapter.id === 1;
  const isLastChapter = chapter.id === course.totalChapters;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Nav */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/courses/${courseId}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <div className="text-sm text-slate-500">{course.title}</div>
                <h1 className="font-semibold text-slate-900">
                  第 {chapter.id} 章：{chapter.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden md:flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {chapter.duration} 分钟
              </span>
              {isCompleted && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  已完成
                </span>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>学习进度</span>
              <span>{chapter.id}/{course.totalChapters} 章</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${(chapter.id / course.totalChapters) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Chapter Intro */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {chapter.id}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{chapter.title}</h2>
                  <p className="text-sm text-slate-500">{chapter.description}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {chapter.keyPoints?.map((point: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <BookText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-slate-500">知识点</p>
              <p className="font-bold text-slate-900">{chapter.keyPoints?.length || 0} 个</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <Star className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-slate-500">重点词汇</p>
              <p className="font-bold text-slate-900">{chapter.lessonWords?.length || 0} 个</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <Award className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <p className="text-xs text-slate-500">练习题</p>
              <p className="font-bold text-slate-900">{chapter.exercises?.length || 0} 道</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
              ${activeTab === 'content' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <BookOpen className="w-4 h-4" />
            课文学习
          </button>
          <button
            onClick={() => setActiveTab('words')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
              ${activeTab === 'words' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Star className="w-4 h-4" />
            单词词汇
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
              ${activeTab === 'grammar' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Target className="w-4 h-4" />
            语法要点
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Lesson Content */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                学习内容
              </h3>
              <div className="prose max-w-none text-slate-700 leading-relaxed">
                <p className="whitespace-pre-line">{chapter.content}</p>
              </div>
            </div>

            {/* Dialogue */}
            {chapter.lessonDialogue && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    对话练习
                  </h3>
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {showTranslation ? '隐藏翻译' : '显示翻译'}
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-slate-800 text-center mb-3">
                    {chapter.lessonDialogue.title}
                  </h4>
                  <div className="space-y-3">
                    {chapter.lessonDialogue.transcript?.split('\n').map((line: string, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                          ${i % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {i % 2 === 0 ? 'A' : 'B'}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800">{line}</p>
                          {showTranslation && chapter.lessonDialogue.translation && (
                            <p className="text-sm text-slate-500 mt-1">
                              {chapter.lessonDialogue.translation.split('\n')[i]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Exercises */}
            {chapter.exercises && chapter.exercises.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  课后练习
                  {showResults && (
                    <span className="ml-2 text-base">
                      （得分：{getScore()}/{chapter.exercises.length}）
                    </span>
                  )}
                </h3>

                <div className="space-y-5">
                  {chapter.exercises.map((ex: any, index: number) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl">
                      <p className="font-medium text-slate-800 mb-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-sm mr-2">
                          {index + 1}
                        </span>
                        {ex.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {ex.options.map((opt: string, oi: number) => {
                          const isSelected = exerciseAnswers[index] === opt;
                          const isCorrect = opt === ex.correctAnswer;
                          
                          let className = 'p-3 rounded-lg border-2 text-left text-sm transition-all';
                          if (showResults) {
                            if (isCorrect) {
                              className += ' bg-green-100 border-green-500 text-green-700';
                            } else if (isSelected && !isCorrect) {
                              className += ' bg-red-100 border-red-500 text-red-700';
                            } else {
                              className += ' bg-white border-slate-200 text-slate-600';
                            }
                          } else {
                            className += isSelected 
                              ? ' bg-primary-100 border-primary-500 text-primary-700' 
                              : ' bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50';
                          }
                          
                          return (
                            <button
                              key={oi}
                              onClick={() => !showResults && handleExerciseAnswer(index, opt)}
                              disabled={showResults}
                              className={className}
                            >
                              <span className="inline-block w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs text-center leading-6 mr-2">
                                {String.fromCharCode(65 + oi)}
                              </span>
                              {opt}
                              {showResults && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-600" />
                              )}
                              {showResults && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 inline ml-2 text-red-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {showResults && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                          <span className="font-medium">解析：</span>{ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!showResults && (
                  <button
                    onClick={checkAnswers}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                  >
                    提交答案
                  </button>
                )}
                {showResults && (
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setExerciseAnswers({});
                    }}
                    className="mt-6 w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    重新做题
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Words Tab */}
        {activeTab === 'words' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              本章重点词汇
              <span className="text-sm font-normal text-slate-500 ml-2">
                共 {chapter.lessonWords?.length || 0} 个
              </span>
            </h3>

            <div className="grid gap-3">
              {chapter.lessonWords?.map((word: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{word.word}</p>
                      <p className="text-sm text-slate-500 mt-1">[{word.pronunciation}]</p>
                      <p className="text-lg text-primary-700 font-medium mt-1">{word.translation}</p>
                    </div>
                    <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <Volume2 className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                  {word.example && (
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <p className="text-slate-700 italic">"{word.example}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(!chapter.lessonWords || chapter.lessonWords.length === 0) && (
              <p className="text-center text-slate-500 py-8">本章节暂无单词内容</p>
            )}
          </div>
        )}

        {/* Grammar Tab */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              语法要点
            </h3>

            {chapter.lessonGrammar?.map((grammar: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-green-500 text-white text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  {grammar.title}
                </h4>
                <p className="text-slate-600 mb-4 leading-relaxed">{grammar.explanation}</p>
                
                {grammar.examples && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm font-medium text-green-700 mb-2">例句：</p>
                    <div className="space-y-2">
                      {grammar.examples.map((ex: string, i: number) => (
                        <p key={i} className="text-slate-700">{ex}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(!chapter.lessonGrammar || chapter.lessonGrammar.length === 0) && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                <p className="text-slate-500">本章节暂无语法内容</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={goToPrevChapter}
            disabled={isFirstChapter}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
              ${isFirstChapter 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一章
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              第 {chapter.id} 章 / 共 {course.totalChapters} 章
            </p>
          </div>

          <button
            onClick={goToNextChapter}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-cyan-500 text-white hover:opacity-90 transition-opacity"
          >
            {isLastChapter ? '完成课程' : '下一章'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
