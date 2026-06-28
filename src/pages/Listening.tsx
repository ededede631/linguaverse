import { useState, useEffect } from 'react';
import { Headphones, Play, Pause, ChevronRight, ChevronLeft, Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { Link } from 'react-router-dom';

interface ListeningMaterial {
  id: number;
  title: string;
  transcript: string;
  translation: string;
  duration: number;
}

export default function Listening() {
  const { currentLanguage, currentLevel } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  const [materials, setMaterials] = useState<ListeningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchMaterials();
  }, [currentLanguage, currentLevel, isAuthenticated]);

  const fetchMaterials = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data: any = await api.learning.getListening({ 
        language: currentLanguage, 
        level: currentLevel 
      });
      setMaterials(data);
      setCurrentIndex(0);
      setCompletedCount(0);
      setQuizMode(false);
    } catch (error) {
      console.error('Failed to fetch listening materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentMaterial = materials[currentIndex];

  const generateQuiz = () => {
    if (!currentMaterial) return;
    const words = currentMaterial.transcript.split(' ');
    const blankIndex = Math.floor(Math.random() * Math.min(5, words.length));
    const answer = words[blankIndex];
    
    const otherMaterials = materials.filter((m) => m.id !== currentMaterial.id);
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3 && otherMaterials.length > 0) {
      const randomMaterial = otherMaterials[Math.floor(Math.random() * otherMaterials.length)];
      const randomWords = randomMaterial.transcript.split(' ');
      const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
      if (randomWord !== answer && !wrongOptions.includes(randomWord)) {
        wrongOptions.push(randomWord);
      }
    }
    
    const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
    setQuizAnswer(null);
    setQuizMode(true);
  };

  const handlePlay = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(currentMaterial.transcript);
        utterance.lang = currentLanguage === 'ja' ? 'ja-JP' : currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
        utterance.rate = 0.8;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < materials.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranscript(false);
      setShowTranslation(false);
      setIsPlaying(false);
      setQuizMode(false);
      setQuizAnswer(null);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranscript(false);
      setShowTranslation(false);
      setIsPlaying(false);
      setQuizMode(false);
      setQuizAnswer(null);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleMarkComplete = () => {
    setCompletedCount(completedCount + 1);
    handleNext();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
            <Headphones className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">登录后开始练习</h2>
          <p className="text-slate-500 mb-6">登录即可使用听力训练功能，提升听力水平</p>
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
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">听力训练</h1>
          <p className="text-slate-500">海量听力素材，提升听力水平</p>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-slate-500">
            第 {currentIndex + 1} / {materials.length} 篇
          </span>
          <span className="text-purple-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            已完成 {completedCount} 篇
          </span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / materials.length) * 100}%` }}
          />
        </div>

        {currentMaterial && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <div className="text-center mb-8">
              <p className="text-sm text-slate-400 mb-2">听力材料</p>
              <h2 className="font-display text-xl font-bold text-slate-900">
                {currentMaterial.title}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{currentMaterial.duration} 秒</span>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={handlePlay}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
            </div>

            {!quizMode ? (
              <>
                <div className="space-y-4 mb-8">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {showTranscript ? '隐藏原文' : '查看原文'}
                    </p>
                    {showTranscript && (
                      <p className="mt-3 text-slate-600 whitespace-pre-line">
                        {currentMaterial.transcript}
                      </p>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {showTranslation ? '隐藏翻译' : '查看翻译'}
                    </p>
                    {showTranslation && (
                      <p className="mt-3 text-slate-600 whitespace-pre-line">
                        {currentMaterial.translation}
                      </p>
                    )}
                  </button>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={generateQuiz}
                    className="flex-1 py-3 bg-purple-50 text-purple-600 font-medium rounded-xl hover:bg-purple-100 transition-colors"
                  >
                    开始测验
                  </button>
                  <button
                    onClick={handleMarkComplete}
                    className="flex-1 py-3 text-white font-medium rounded-xl gradient-btn"
                  >
                    标记完成
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-8">
                <p className="font-medium text-slate-900 mb-4">听力理解：选择正确答案</p>
                <p className="text-slate-600 mb-4 italic">
                  "根据你听到的内容，选择正确的单词填空..."
                </p>
                <div className="space-y-2">
                  {quizOptions.map((option, index) => {
                    const isCorrect = option === currentMaterial.transcript.split(' ')[0];
                    const isSelected = quizAnswer === option;
                    
                    let bgClass = 'bg-slate-50 border-slate-200 hover:bg-slate-100';
                    if (quizAnswer) {
                      if (isCorrect) {
                        bgClass = 'bg-green-50 border-green-500';
                      } else if (isSelected) {
                        bgClass = 'bg-red-50 border-red-500';
                      }
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !quizAnswer && setQuizAnswer(option)}
                        disabled={!!quizAnswer}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${bgClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-slate-700">{option}</span>
                          {quizAnswer && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                          {quizAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {quizAnswer && (
                  <button
                    onClick={handleMarkComplete}
                    className="w-full mt-4 py-3 text-white font-medium rounded-xl gradient-btn"
                  >
                    继续下一篇
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === materials.length - 1}
                className="px-8 py-3 text-white font-medium rounded-full gradient-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                下一篇
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="w-10" />
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-purple-500" />
            听力学习小贴士
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
              先盲听一遍，了解大意
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
              再听一遍，注意细节
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
              对照原文，找出没听懂的地方
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0">4</span>
              反复听，直到完全听懂
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
