import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import ChapterLearn from "@/pages/ChapterLearn";
import Vocabulary from "@/pages/Vocabulary";
import Grammar from "@/pages/Grammar";
import Speaking from "@/pages/Speaking";
import Listening from "@/pages/Listening";
import Progress from "@/pages/Progress";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/auth";

function AppContent() {
  const location = useLocation();
  const { checkAuth, isAuthenticated, setUser } = useAuthStore();
  
  // GitHub Pages 部署在 /linguaverse/ 子路径下
  const basePath = '/linguaverse';
  const currentPath = location.pathname;
  
  // 如果访问根路径，重定向到 /linguaverse
  if (currentPath === '/' || currentPath === '') {
    window.history.replaceState(null, '', `${basePath}/`);
  }
  
  const noNavRoutes = [`${basePath}/login`, `${basePath}/register`, '/login', '/register'];
  const showNav = !noNavRoutes.some(route => currentPath === route || currentPath.startsWith(route + '/'));

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const { api } = await import('@/lib/api');
          const profile: any = await api.auth.getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50">
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/chapter/:chapterId" element={<ChapterLearn />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
