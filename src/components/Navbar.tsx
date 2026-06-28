import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  // GitHub Pages base path
  const basePath = '/linguaverse';

  const navLinks = [
    { path: '/', label: '首页', icon: Sparkles },
    { path: '/courses', label: '课程中心', icon: BookOpen },
    { path: '/progress', label: '学习中心', icon: LayoutDashboard },
    { path: '/community', label: '社区广场', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate(`${basePath}/`);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-blue">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">LinguaVerse</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${location.pathname === link.path 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img 
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full bg-slate-200"
                  />
                  <span className="text-sm font-medium text-slate-700">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-white rounded-full gradient-btn"
                >
                  免费注册
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white/90 backdrop-blur-lg">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3
                    ${location.pathname === link.path 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100"
                    >
                      <img 
                        src={user?.avatar || ''} 
                        alt="avatar" 
                        className="w-10 h-10 rounded-full bg-slate-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user?.username}</p>
                        <p className="text-xs text-slate-500">个人中心</p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <LogOut className="w-5 h-5" />
                      退出登录
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                      登录
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-medium text-white rounded-xl gradient-btn"
                    >
                      免费注册
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
