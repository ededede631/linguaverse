import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Target, BookOpen, Award, 
  ChevronRight, Loader2, Edit3, Save,
  Globe, BarChart3, Users
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    targetLanguage: 'en',
    level: 'beginner',
    dailyGoal: 30,
  });
  const [saving, setSaving] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const [profile, recs]: any = await Promise.all([
        api.auth.getProfile(),
        api.progress.getRecommendations(),
      ]);
      setUser(profile);
      setFormData({
        username: profile.username,
        targetLanguage: profile.target_language,
        level: profile.level,
        dailyGoal: profile.daily_goal,
      });
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated: any = await api.auth.updateProfile({
        username: formData.username,
        targetLanguage: formData.targetLanguage,
        level: formData.level,
        dailyGoal: formData.dailyGoal,
      });
      setUser(updated);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const languageOptions = [
    { value: 'en', label: '英语' },
    { value: 'ja', label: '日语' },
    { value: 'ko', label: '韩语' },
  ];

  const levelOptions = [
    { value: 'beginner', label: '初级' },
    { value: 'intermediate', label: '中级' },
    { value: 'advanced', label: '高级' },
  ];

  const goalOptions = [15, 30, 45, 60, 90, 120];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto py-10 max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">个人中心</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  个人信息
                </h2>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                >
                  {editing ? (
                    <>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      保存
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      编辑
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-6 mb-8">
                <img 
                  src={user?.avatar || ''} 
                  alt="avatar" 
                  className="w-24 h-24 rounded-full bg-slate-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{user?.username}</h3>
                  <p className="text-slate-500">{user?.email}</p>
                  <p className="text-sm text-primary-600 mt-1 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    学习达人
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">用户名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-slate-900">{user?.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    目标语言
                  </label>
                  {editing ? (
                    <div className="flex gap-2">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => setFormData({ ...formData, targetLanguage: lang.value })}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            formData.targetLanguage === lang.value
                              ? 'bg-primary-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-900">
                      {languageOptions.find(l => l.value === user?.target_language)?.label || '英语'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    当前水平
                  </label>
                  {editing ? (
                    <div className="flex gap-2">
                      {levelOptions.map((lvl) => (
                        <button
                          key={lvl.value}
                          onClick={() => setFormData({ ...formData, level: lvl.value })}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            formData.level === lvl.value
                              ? 'bg-primary-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-900">
                      {levelOptions.find(l => l.value === user?.level)?.label || '初级'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    每日学习目标
                  </label>
                  {editing ? (
                    <div className="flex flex-wrap gap-2">
                      {goalOptions.map((goal) => (
                        <button
                          key={goal}
                          onClick={() => setFormData({ ...formData, dailyGoal: goal })}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            formData.dailyGoal === goal
                              ? 'bg-primary-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {goal} 分钟
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-900">{user?.daily_goal || 30} 分钟</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" />
                个性化学习推荐
              </h2>
              
              {recommendations && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">今日目标进度</span>
                      <span className="text-sm font-medium text-primary-600">
                        {recommendations.progress}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${recommendations.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="font-medium text-slate-700">💡 学习建议</p>
                    {recommendations.suggestions?.map((suggestion: string, index: number) => (
                      <div key={index} className="p-3 bg-primary-50 rounded-xl text-sm text-primary-700">
                        {suggestion}
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="font-medium text-slate-700 mb-3">推荐课程</p>
                    <div className="space-y-3">
                      {recommendations.recommendedCourses?.slice(0, 3).map((course: any) => (
                        <Link 
                          key={course.id}
                          to={`/courses/${course.id}`}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                              {course.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              {levelOptions.find(l => l.value === course.level)?.label}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">学习数据</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">累计学习时长</span>
                  <span className="font-semibold text-slate-900">
                    {Math.floor((user?.total_minutes || 0) / 60)} 小时
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">累计单词量</span>
                  <span className="font-semibold text-slate-900">{user?.total_words || 0} 个</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">连续学习</span>
                  <span className="font-semibold text-orange-500">{user?.streak || 0} 天</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">快捷入口</h3>
              <div className="space-y-2">
                <Link 
                  to="/progress"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-slate-700">学习进度</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                </Link>
                <Link 
                  to="/courses"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-slate-700">我的课程</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                </Link>
                <Link 
                  to="/community"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-slate-700">我的动态</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                </Link>
                <Link 
                  to="#"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-slate-700">我的成就</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                </Link>
                <Link 
                  to="#"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-slate-700">设置</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                </Link>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 text-red-600 font-medium bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
