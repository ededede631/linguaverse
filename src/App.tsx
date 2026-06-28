import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
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
  
  const noNavRoutes = ['/login', '/register'];
  const showNav = !noNavRoutes.includes(location.pathname);

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
        <Route path="/learn/vocabulary" element={<Vocabulary />} />
        <Route path="/learn/grammar" element={<Grammar />} />
        <Route path="/learn/speaking" element={<Speaking />} />
        <Route path="/learn/listening" element={<Listening />} />
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
