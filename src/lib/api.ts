const API_BASE = '/api';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { username: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getProfile: () => request('/auth/profile'),
    updateProfile: (data: any) =>
      request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  courses: {
    getAll: (params?: { language?: string; level?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/courses${query ? `?${query}` : ''}`);
    },
    getById: (id: number) => request(`/courses/${id}`),
    enroll: (id: number) =>
      request(`/courses/${id}/enroll`, { method: 'POST' }),
    getMyCourses: () => request('/courses/user/my-courses'),
  },
  learning: {
    getVocabulary: (params?: { language?: string; level?: string; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/learning/vocabulary${query ? `?${query}` : ''}`);
    },
    reviewWord: (id: number, mastered: boolean) =>
      request(`/learning/vocabulary/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ mastered }),
      }),
    getGrammar: (params?: { language?: string; level?: string; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/learning/grammar${query ? `?${query}` : ''}`);
    },
    getListening: (params?: { language?: string; level?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/learning/listening${query ? `?${query}` : ''}`);
    },
    getSpeaking: (params?: { language?: string; level?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/learning/speaking${query ? `?${query}` : ''}`);
    },
  },
  progress: {
    get: () => request('/progress'),
    record: (data: { minutes?: number; words?: number }) =>
      request('/progress/record', { method: 'POST', body: JSON.stringify(data) }),
    getAchievements: () => request('/progress/achievements'),
    getLeaderboard: (params?: { type?: string; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/progress/leaderboard${query ? `?${query}` : ''}`);
    },
    getRecommendations: () => request('/progress/recommendations'),
  },
  community: {
    getPosts: (params?: { page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/community/posts${query ? `?${query}` : ''}`);
    },
    createPost: (data: { content: string }) =>
      request('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
    likePost: (id: number) =>
      request(`/community/posts/${id}/like`, { method: 'POST' }),
  },
};
