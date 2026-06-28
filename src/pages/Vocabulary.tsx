import { useState, useEffect } from 'react';
import { BookOpen, Volume2, RotateCcw, ChevronRight, ChevronLeft, Star, Loader2, Sparkles, Target, Award, Clock, Zap, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { Link } from 'react-router-dom';

interface Word {
  id: number;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  mastered?: number;
}

const languageNames: Record<string, string> = {
  en: '英语',
  ja: '日语',
  ko: '韩语',
};

const languageFlags: Record<string, string> = {
  en: '🇬🇧',
  ja: '🇯🇵',
  ko: '🇰🇷',
};

export default function Vocabulary() {
  const { currentLanguage, currentLevel, setLanguage, setLevel } = useAppStore();
  const { isAuthenticated, user } = useAuthStore();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchWords();
  }, [currentLanguage, currentLevel, isAuthenticated]);

  const fetchWords = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data: any = await api.learning.getVocabulary({ 
        language: currentLanguage, 
        level: currentLevel, 
      });
      setWords(data);
      setCurrentIndex(0);
      setIsFlipped(false);
      setMasteredCount(0);
    } catch (error) {
      console.error('Failed to fetch words:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setQuizAnswer(null);
      setShowResult(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setQuizAnswer(null);
      setShowResult(false);
    }
  };

  const handleMarkMastered = async (mastered: boolean) => {
    if (!currentWord) return;
    try {
      await api.learning.recordProgress('vocabulary', 1);
      if (mastered) {
        setMasteredCount(masteredCount + 1);
      }
      handleNext();
    } catch (error) {
      console.error('Failed to review word:', error);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    setShowResult(true);
  };

  const generateOptions = () => {
    if (!currentWord) return [];
    const options = [currentWord.translation];
    const otherWords = words.filter((w) => w.id !== currentWord.id);
    for (let i = 0; i < 3 && otherWords.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      options.push(otherWords[randomIndex].translation);
      otherWords.splice(randomIndex, 1);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setMasteredCount(0);
    setIsFlipped(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">登录后开始学习</h2>
          <p className="text-slate-500 mb-6">登录即可使用单词记忆功能，追踪你的学习进度</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/courses" className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">单词记忆</h1>
              <p className="text-sm text-slate-500">
                {languageFlags[currentLanguage]} {languageNames[currentLanguage]} · {currentLevel === 'beginner' ? '初级' : currentLevel === 'intermediate' ? '中级' : '高级'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Sparkles className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              学习设置
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">选择语言</label>
                <div className="flex gap-2">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${currentLanguage === code 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {languageFlags[code]} {name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">选择级别</label>
                <div className="flex gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${currentLevel === level 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                第 {currentIndex + 1} / {words.length} 个单词
              </span>
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Star className="w-4 h-4" />
                已掌握 {masteredCount} 个
              </span>
            </div>
            <button
              onClick={resetProgress}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              重新开始
            </button>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Learning Mode Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setMode('learn')}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2
              ${mode === 'learn' 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <BookOpen className="w-5 h-5" />
            学习模式
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2
              ${mode === 'quiz' 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <Target className="w-5 h-5" />
            测试模式
          </button>
        </div>

        {/* Word Card */}
        {currentWord && (
          <div className="mb-6">
            {mode === 'learn' ? (
              /* Learning Mode Card */
              <div 
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="relative">
                  {/* Card Background */}
                  <div className="h-80 bg-gradient-to-br from-primary-500 via-cyan-500 to-blue-600 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10 text-center">
                      {/* Word */}
                      <h2 className="text-5xl font-bold mb-4">{currentWord.word}</h2>
                      {/* Pronunciation */}
                      <p className="text-xl text-white/80 mb-6">[{currentWord.pronunciation}]</p>
                      {/* Translation (shown when flipped) */}
                      {isFlipped && (
                        <div className="animate-fadeIn">
                          <p className="text-3xl font-semibold mb-4">{currentWord.translation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Example Section */}
                  <div className="p-6 bg-white">
                    {!isFlipped ? (
                      <p className="text-center text-slate-500">点击卡片查看翻译</p>
                    ) : (
                      <div className="animate-fadeIn">
                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-500" />
                          例句
                        </h4>
                        <p className="text-slate-600 italic mb-2">{currentWord.example}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Quiz Mode Card */
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
                    <Zap className="w-4 h-4" />
                    选择正确的翻译
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-2">{currentWord.word}</h2>
                  <p className="text-slate-500">[{currentWord.pronunciation}]</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {generateOptions().map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={showResult}
                      className={`p-4 rounded-xl border-2 text-lg font-medium transition-all
                        ${showResult 
                          ? option === currentWord.translation 
                            ? 'bg-green-100 border-green-500 text-green-700' 
                            : option === quizAnswer 
                              ? 'bg-red-100 border-red-500 text-red-700' 
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-primary-500 hover:bg-primary-50'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                    {quizAnswer === currentWord.translation ? (
                      <p className="text-green-600 font-medium flex items-center gap-2">
                        <span className="text-2xl">🎉</span> 回答正确！
                      </p>
                    ) : (
                      <p className="text-red-600 font-medium flex items-center gap-2">
                        <span className="text-2xl">😅</span> 正确答案是：{currentWord.translation}
                      </p>
                    )}
                    <p className="text-slate-600 mt-2 italic">"{currentWord.example}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
              ${currentIndex === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一个
          </button>

          {mode === 'learn' && isFlipped && (
            <>
              <button
                onClick={() => handleMarkMastered(false)}
                className="px-6 py-3 rounded-xl font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                需要复习
              </button>
              <button
                onClick={() => handleMarkMastered(true)}
                className="px-6 py-3 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                已掌握
              </button>
            </>
          )}

          {mode === 'quiz' && showResult && (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-medium bg-primary-500 text-white hover:bg-primary-600 transition-all flex items-center gap-2"
            >
              下一个
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={mode === 'learn'}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
              ${mode === 'learn' 
                ? 'bg-primary-500 text-white hover:bg-primary-600' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            下一个
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Learning Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            学习小贴士
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">💡</span>
              <span>建议每天学习20-30个新单词，坚持复习效果最佳</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">💡</span>
              <span>点击卡片查看翻译和例句，理解单词在句子中的用法</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">💡</span>
              <span>完成学习后点击"已掌握"，系统会记录你的学习进度</span>
            </li>
          </ul>
        </div>

        {/* Quick Navigation */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h4 className="font-medium text-slate-800 mb-3">快速跳转</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/grammar" className="p-3 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition-colors">
              <Award className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-slate-700">语法练习</span>
            </Link>
            <Link to="/speaking" className="p-3 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors">
              <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-slate-700">口语跟读</span>
            </Link>
            <Link to="/listening" className="p-3 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
              <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-slate-700">听力训练</span>
            </Link>
            <Link to="/progress" className="p-3 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-slate-700">学习进度</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
