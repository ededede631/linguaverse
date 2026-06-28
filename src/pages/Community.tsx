import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Heart, MessageCircle, Share2, Send, Loader2, 
  TrendingUp, Flame, BookOpen
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface CommunityPost {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  streak?: number;
}

export default function Community() {
  const { isAuthenticated, user } = useAuthStore();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const data: any = await api.community.getPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !isAuthenticated) return;
    setPosting(true);
    try {
      const post: any = await api.community.createPost(newPost);
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!isAuthenticated) return;
    try {
      const result: any = await api.community.likePost(postId);
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: result.liked ? p.likes + 1 : p.likes - 1 }
          : p
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  const trendingTopics = [
    { tag: '#每日打卡', count: '1.2万' },
    { tag: '#英语学习', count: '8.5千' },
    { tag: '#日语入门', count: '6.3千' },
    { tag: '#韩语学习', count: '5.1千' },
    { tag: '#学习方法', count: '3.8千' },
  ];

  const activeUsers = [
    { name: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming', streak: 45 },
    { name: '樱花', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sakura2', streak: 32 },
    { name: '韩语爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=korean', streak: 28 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto py-10">
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">社区广场</h1>
          <p className="text-slate-600">和小伙伴一起学习，互相鼓励，共同进步</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {isAuthenticated && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex gap-4">
                  <img 
                    src={user?.avatar || ''} 
                    alt="avatar" 
                    className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="分享你的学习心得..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                          <Flame className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        onClick={handlePost}
                        disabled={!newPost.trim() || posting}
                        className="px-6 py-2 text-white font-medium rounded-full gradient-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {posting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        发布
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Link to="#" className="flex-shrink-0">
                        <img 
                          src={post.avatar} 
                          alt={post.username} 
                          className="w-12 h-12 rounded-full bg-slate-200"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link to="#" className="font-semibold text-slate-900 hover:text-primary-600">
                            {post.username}
                          </Link>
                          {post.streak && post.streak >= 7 && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                              <Flame className="w-3 h-3" />
                              {post.streak}天
                            </span>
                          )}
                          <span className="text-sm text-slate-400">{formatTime(post.created_at)}</span>
                        </div>
                        <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>
                        
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 text-sm transition-colors ${
                              likedPosts.has(post.id) 
                                ? 'text-red-500' 
                                : 'text-slate-500 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                            <Share2 className="w-5 h-5" />
                            <span>分享</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                热门话题
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <Link 
                    key={index}
                    to="#" 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < 3 ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-700">{topic.tag}</span>
                    </div>
                    <span className="text-sm text-slate-500">{topic.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                学习达人榜
              </h3>
              <div className="space-y-3">
                {activeUsers.map((user, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full bg-slate-200"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-orange-500 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        连续学习 {user.streak} 天
                      </p>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors">
                      关注
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl p-6 text-white">
                <h3 className="font-display text-lg font-bold mb-2">加入我们</h3>
                <p className="text-white/80 text-sm mb-4">
                  注册账号，和百万小伙伴一起学习成长
                </p>
                <Link 
                  to="/register"
                  className="w-full py-2.5 bg-white text-primary-600 font-medium rounded-full hover:bg-white/90 transition-colors block text-center"
                >
                  立即注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
