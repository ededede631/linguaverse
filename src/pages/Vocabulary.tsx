import { useState, useEffect } from 'react';
import { BookOpen, Volume2, RotateCcw, ChevronRight, ChevronLeft, Star, Loader2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { Link } from 'react-router-dom';

interface Word {
  id: number;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  example_translation: string;
  mastered?: number;
}

export default function Vocabulary() {
  const { currentLanguage, currentLevel } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

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
        limit: 20 
      });
      setWords(data);
      setCurrentIndex(0);
      setIsFlipped(false);
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
      await api.learning.reviewWord(currentWord.id, mastered);
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
    const options = [currentWord.meaning];
    const otherWords = words.filter((w) => w.id !== currentWord.id);
    for (let i = 0; i < 3 && otherWords.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      options.push(otherWords[randomIndex].meaning);
      otherWords.splice(randomIndex, 1);
    }
    return options.sort(() => Math.random() - 0.5);
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
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto py-10 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">单词记忆</h1>
            <p className="text-slate-500">智能卡片记忆法，高效掌握词汇</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('learn')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${mode === 'learn' ? 'bg-primary-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              学习模式
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${mode === 'quiz' ? 'bg-primary-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              测试模式
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            第 {currentIndex + 1} / {words.length} 个单词
          </span>
          <span className="text-green-600 font-medium flex items-center gap-1">
            <Star className="w-4 h-4" />
            已掌握 {masteredCount} 个
          </span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>

        {currentWord && (
          <div className="perspective-1000">
            {mode === 'learn' ? (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative w-full h-80 cursor-pointer"
                style={{ perspective: '1000px' }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  <div 
                    className="absolute inset-0 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-sm text-slate-400 mb-4">点击卡片查看释义</div>
                    <h2 className="font-display text-5xl font-bold text-slate-900 mb-4">
                      {currentWord.word}
                    </h2>
                    <p className="text-slate-500 text-lg">{currentWord.pronunciation}</p>
                    <button className="mt-6 p-3 rounded-full bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors">
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center text-white"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="text-sm text-white/60 mb-4">释义</div>
                    <h2 className="font-display text-4xl font-bold mb-6">{currentWord.meaning}</h2>
                    <div className="w-full bg-white/10 rounded-2xl p-4 mb-6">
                      <p className="text-white/90 mb-2">{currentWord.example}</p>
                      <p className="text-white/60 text-sm">{currentWord.example_translation}</p>
                    </div>
                    <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                  <div className="text-sm text-slate-400 mb-4">这个单词是什么意思？</div>
                  <h2 className="font-display text-4xl font-bold text-slate-900">
                    {currentWord.word}
                  </h2>
                  <p className="text-slate-500 mt-2">{currentWord.pronunciation}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {generateOptions().map((option, index) => {
                    const isCorrect = option === currentWord.meaning;
                    const isSelected = quizAnswer === option;
                    
                    let bgClass = 'bg-slate-50 hover:bg-slate-100 border-slate-200';
                    if (showResult) {
                      if (isCorrect) {
                        bgClass = 'bg-green-50 border-green-500 text-green-700';
                      } else if (isSelected && !isCorrect) {
                        bgClass = 'bg-red-50 border-red-500 text-red-700';
                      }
                    } else if (isSelected) {
                      bgClass = 'bg-primary-50 border-primary-500 text-primary-700';
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !showResult && handleQuizAnswer(option)}
                        disabled={showResult}
                        className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${bgClass}`}
                      >
                        <span className="text-slate-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </button>
                    );
                  })}
                </div>
                
                {showResult && (
                  <div className="mt-6 text-center">
                    {quizAnswer === currentWord.meaning ? (
                      <div className="text-green-600 font-medium text-lg flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        回答正确！
                      </div>
                    ) : (
                      <div className="text-red-600 font-medium">
                        回答错误，正确答案是：{currentWord.meaning}
                      </div>
                    )}
                    <button
                      onClick={handleNext}
                      className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                    >
                      下一题
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'learn' && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleMarkMastered(false)}
                className="px-6 py-3 rounded-full bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                还不熟
              </button>
              <button
                onClick={() => handleMarkMastered(true)}
                className="px-6 py-3 rounded-full bg-green-50 text-green-600 font-medium hover:bg-green-100 transition-colors flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                已掌握
              </button>
            </div>
            
            <button
              onClick={handleNext}
              disabled={currentIndex === words.length - 1}
              className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
