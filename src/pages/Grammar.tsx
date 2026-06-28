import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight, ChevronLeft, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { Link } from 'react-router-dom';

interface GrammarQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export default function Grammar() {
  const { currentLanguage, currentLevel } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [currentLanguage, currentLevel, isAuthenticated]);

  const fetchQuestions = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data: any = await api.learning.getGrammar({ 
        language: currentLanguage, 
        level: currentLevel,
        limit: 10
      });
      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
      resetQuestion();
    } catch (error) {
      console.error('Failed to fetch grammar questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswered(false);
  };

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setAnswered(true);
    setShowExplanation(true);
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestion();
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    fetchQuestions();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <Lightbulb className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">登录后开始练习</h2>
          <p className="text-slate-500 mb-6">登录即可使用语法练习功能，夯实语言基础</p>
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

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center max-w-md mx-auto mx-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{percentage}%</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">练习完成！</h2>
          <p className="text-slate-500 mb-6">你答对了 {score} / {questions.length} 道题</p>
          
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <p className="text-slate-600">
              {percentage >= 80 ? '太棒了！语法掌握得很好！' :
               percentage >= 60 ? '不错，继续加油！' :
               '多练习，语法会越来越好的！'}
            </p>
          </div>
          
          <button
            onClick={handleRestart}
            className="w-full py-3.5 text-white font-medium rounded-xl gradient-btn flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            再来一轮
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto py-10 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">语法练习</h1>
          <p className="text-slate-500">系统语法训练，夯实语言基础</p>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-slate-500">
            第 {currentIndex + 1} / {questions.length} 题
          </span>
          <span className="text-green-600 font-medium">
            得分: {score}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {currentQuestion && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <div className="flex items-start gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-display text-xl font-medium text-slate-900 pt-1">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correct_answer;
                const isSelected = selectedAnswer === index;
                
                let borderClass = 'border-slate-200 bg-slate-50 hover:border-primary-300 hover:bg-primary-50';
                let textClass = 'text-slate-700';
                
                if (answered) {
                  if (isCorrect) {
                    borderClass = 'border-green-500 bg-green-50';
                    textClass = 'text-green-700';
                  } else if (isSelected && !isCorrect) {
                    borderClass = 'border-red-500 bg-red-50';
                    textClass = 'text-red-700';
                  }
                } else if (isSelected) {
                  borderClass = 'border-primary-500 bg-primary-50';
                  textClass = 'text-primary-700';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={answered}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${borderClass} ${textClass} ${!answered && 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 font-medium">{option}</span>
                      {answered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className={`p-4 rounded-xl mb-6 ${selectedAnswer === currentQuestion.correct_answer ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className="font-medium text-slate-900 mb-1">解析</p>
                <p className="text-slate-600 text-sm">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="p-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {!answered ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="px-8 py-3 text-white font-medium rounded-full gradient-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  确认答案
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 text-white font-medium rounded-full gradient-btn flex items-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              
              <div className="w-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
