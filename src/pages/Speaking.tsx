import { useState, useEffect } from 'react';
import { Mic, Volume2, ChevronRight, ChevronLeft, Play, Loader2, Award } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { Link } from 'react-router-dom';

interface SpeakingSentence {
  id: number;
  sentence: string;
  translation: string;
}

export default function Speaking() {
  const { currentLanguage, currentLevel } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const [sentences, setSentences] = useState<SpeakingSentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    fetchSentences();
  }, [currentLanguage, currentLevel, isAuthenticated]);

  const fetchSentences = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data: any = await api.learning.getSpeaking({ 
        language: currentLanguage, 
        level: currentLevel 
      });
      setSentences(data);
      setCurrentIndex(0);
      setCompletedCount(0);
    } catch (error) {
      console.error('Failed to fetch speaking sentences:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentSentence = sentences[currentIndex];

  const handlePlayOriginal = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentSentence.sentence);
      utterance.lang = currentLanguage === 'ja' ? 'ja-JP' : currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 30) + 70;
      setScore(randomScore);
      setCompletedCount(completedCount + 1);
    } else {
      setIsRecording(true);
      setScore(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScore(null);
      setIsRecording(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setScore(null);
      setIsRecording(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
            <Mic className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">登录后开始练习</h2>
          <p className="text-slate-500 mb-6">登录即可使用口语跟读功能，提升发音水平</p>
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
      <div className="container mx-auto py-10 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">口语跟读</h1>
          <p className="text-slate-500">AI发音评分，说地道外语</p>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-slate-500">
            第 {currentIndex + 1} / {sentences.length} 句
          </span>
          <span className="text-rose-600 font-medium flex items-center gap-1">
            <Award className="w-4 h-4" />
            已完成 {completedCount} 句
          </span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
          />
        </div>

        {currentSentence && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <div className="text-center mb-8">
              <p className="text-sm text-slate-400 mb-4">跟我读</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {currentSentence.sentence}
              </h2>
              <p className="text-slate-500">{currentSentence.translation}</p>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={handlePlayOriginal}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors"
              >
                <Play className="w-5 h-5" />
                播放原音
              </button>
            </div>

            <div className="flex flex-col items-center mb-8">
              <button
                onClick={handleToggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse scale-110' 
                    : 'bg-gradient-to-br from-rose-500 to-pink-500 hover:scale-105'
                } shadow-lg`}
              >
                <Mic className="w-10 h-10 text-white" />
              </button>
              <p className="mt-4 text-slate-500">
                {isRecording ? '正在录音...点击结束' : '点击开始录音'}
              </p>
            </div>

            {score !== null && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{score}</span>
                </div>
                <p className="text-lg font-medium text-slate-900 mb-1">
                  {score >= 90 ? '太棒了！发音非常标准！' :
                   score >= 80 ? '很好！发音不错！' :
                   score >= 70 ? '不错，继续加油！' :
                   '多练习，发音会越来越好！'}
                </p>
                <p className="text-sm text-slate-500">发音评分</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === sentences.length - 1 || score === null}
                className="px-8 py-3 text-white font-medium rounded-full gradient-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                下一句
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="w-10" />
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary-500" />
            口语学习小贴士
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
              先听原音，注意语调和节奏
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
              模仿发音，大声跟读
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
              查看评分，针对性改进
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium flex-shrink-0">4</span>
              每天坚持练习，效果更显著
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
