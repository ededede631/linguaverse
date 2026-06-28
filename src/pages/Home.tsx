import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Headphones, 
  Mic, 
  Lightbulb,
  Users,
  Trophy,
  Star,
  ChevronRight,
  Sparkles,
  Play
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const languages = [
    { code: 'en', name: '英语', flag: '🇺🇸', learners: '120万+', color: 'from-sky-500 to-blue-600' },
    { code: 'ja', name: '日语', flag: '🇯🇵', learners: '85万+', color: 'from-rose-500 to-pink-600' },
    { code: 'ko', name: '韩语', flag: '🇰🇷', learners: '68万+', color: 'from-purple-500 to-indigo-600' },
  ];

  const features = [
    { icon: BookOpen, title: '单词记忆', desc: '智能卡片记忆法，高效掌握词汇', color: 'bg-sky-100 text-sky-600' },
    { icon: Lightbulb, title: '语法练习', desc: '系统语法训练，夯实语言基础', color: 'bg-amber-100 text-amber-600' },
    { icon: Mic, title: '口语跟读', desc: 'AI发音评分，说地道外语', color: 'bg-rose-100 text-rose-600' },
    { icon: Headphones, title: '听力训练', desc: '海量听力素材，提升听力水平', color: 'bg-purple-100 text-purple-600' },
  ];

  const stats = [
    { value: '300万+', label: '注册用户' },
    { value: '50+', label: '精品课程' },
    { value: '1000万+', label: '学习时长' },
    { value: '98%', label: '满意度' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative pt-28 pb-20 overflow-hidden noise-bg">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-slate-200 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-600">沉浸式多语言学习平台</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              <span className="gradient-text">学习语言</span>
              <br />
              <span className="text-slate-900">打开世界的大门</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto text-balance">
              英语、日语、韩语多语种学习，科学分级课程体系，趣味互动学习模块，
              让语言学习变得高效又有趣
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link 
                  to="/courses" 
                  className="px-8 py-4 text-white font-semibold rounded-full gradient-btn text-lg flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  继续学习
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="px-8 py-4 text-white font-semibold rounded-full gradient-btn text-lg"
                  >
                    免费开始学习
                  </Link>
                  <Link 
                    to="/courses" 
                    className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-lg flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    浏览课程
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">选择你想学习的语言</h2>
            <p className="text-slate-600 max-w-xl mx-auto">三种主流语言，从入门到精通，满足不同学习需求</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {languages.map((lang, index) => (
              <Link
                key={lang.code}
                to="/courses"
                className="group relative overflow-hidden rounded-3xl p-8 card-hover bg-gradient-to-br text-white"
                style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="text-6xl mb-4">{lang.flag}</div>
                  <h3 className="font-display text-2xl font-bold mb-2">{lang.name}</h3>
                  <p className="text-white/80 mb-6">{lang.learners} 学习者</p>
                  <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    开始学习 <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">四大互动学习模块</h2>
            <p className="text-slate-600 max-w-xl mx-auto">全方位提升听、说、读、写能力，打造沉浸式学习体验</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={index === 0 ? '/learn/vocabulary' : index === 1 ? '/learn/grammar' : index === 2 ? '/learn/speaking' : '/learn/listening'}
                className="bg-white rounded-2xl p-6 card-hover border border-slate-100"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                科学分级课程体系
              </h2>
              <p className="text-slate-600 mb-8 text-lg">
                从零基础到高级精通，每个级别都有清晰的学习目标和路径。
                个性化学习推荐，让你的每一分钟都有价值。
              </p>
              
              <div className="space-y-4">
                {[
                  { level: '初级入门', desc: '从零开始，掌握基础发音和日常会话', duration: '约3个月' },
                  { level: '中级进阶', desc: '系统学习语法，提升听说读写能力', duration: '约6个月' },
                  { level: '高级精通', desc: '高级词汇与表达，商务学术应用', duration: '约6个月' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center text-white font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-900">{item.level}</h4>
                        <span className="text-sm text-slate-500">{item.duration}</span>
                      </div>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                to="/courses" 
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-white font-medium rounded-full gradient-btn"
              >
                查看全部课程
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 to-purple-400 rounded-3xl blur-2xl opacity-20" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">今日学习目标</span>
                      <span className="text-sm text-sky-400">30分钟</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                      <div className="text-2xl font-bold mb-1">🔥</div>
                      <div className="text-lg font-bold">7</div>
                      <div className="text-xs text-white/60">连续天数</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                      <div className="text-2xl font-bold mb-1">📚</div>
                      <div className="text-lg font-bold">156</div>
                      <div className="text-xs text-white/60">累计单词</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                      <div className="text-2xl font-bold mb-1">⏱️</div>
                      <div className="text-lg font-bold">8h</div>
                      <div className="text-xs text-white/60">总学习时长</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-purple-400 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">成就解锁！</p>
                        <p className="text-xs text-white/60">连续学习7天，获得"坚持一周"徽章</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-50" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">加入学习社区</h2>
            <p className="text-slate-600 max-w-xl mx-auto">和百万小伙伴一起学习，互相鼓励，共同进步</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily', name: 'Lily', content: '用了LinguaVerse三个月，从零基础到能进行简单的日语对话，太开心了！', lang: '日语学习' },
              { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', name: 'Tom', content: '单词记忆功能太好用了，配合艾宾浩斯复习曲线，效率提升好多。', lang: '英语学习' },
              { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hana', name: 'Hana', content: '社区氛围超好，每天打卡学习，已经坚持100多天了！', lang: '韩语学习' },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 card-hover border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full bg-slate-200" />
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.lang}</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">"{item.content}"</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/community" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <Users className="w-5 h-5" />
              进入社区
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                {isAuthenticated ? '继续你的语言学习之旅！' : '准备好开始你的语言学习之旅了吗？'}
              </h2>
              <p className="text-slate-300 mb-8 text-lg">
                {isAuthenticated ? '你已经迈出了学习的第一步，继续加油！' : '免费注册，开启你的多语言学习新世界'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/courses" 
                      className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
                    >
                      继续学习
                    </Link>
                    <Link 
                      to="/progress" 
                      className="px-8 py-4 text-white font-semibold rounded-full border border-white/30 hover:bg-white/10 transition-colors"
                    >
                      查看学习进度
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
                    >
                      立即免费注册
                    </Link>
                    <Link 
                      to="/courses" 
                      className="px-8 py-4 text-white font-semibold rounded-full border border-white/30 hover:bg-white/10 transition-colors"
                    >
                      了解更多
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">LinguaVerse</span>
              </div>
              <p className="text-sm">沉浸式多语言学习平台，让每个人都能轻松掌握外语。</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">语言学习</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-white transition-colors">英语学习</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">日语学习</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">韩语学习</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">全部课程</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">关于我们</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-white transition-colors">公司介绍</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">联系我们</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">加入我们</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">帮助中心</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">法律条款</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-white transition-colors">用户协议</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">隐私政策</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">版权声明</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 LinguaVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
