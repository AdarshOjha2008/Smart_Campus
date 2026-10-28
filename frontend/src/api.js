const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    let message = '';
    try {
      const err = await response.json();
      message = err.detail || JSON.stringify(err);
    } catch {
      message = await response.text();
    }
    throw new Error(message || `API request failed: ${response.status}`);
  }
  return response.json();
}

export const api = {
  health: () => request('/health'),
  getNotices: () => request('/notices/'),
  createNotice: (notice) => request('/notices/', { method: 'POST', body: JSON.stringify(notice) }),
  getEvents: () => request('/events/'),
  getMobility: () => request('/mobility/'),
  getAcademics: () => request('/academics/'),
  getMart: () => request('/mart/'),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signupStudent: (data) => request('/auth/signup/student', { method: 'POST', body: JSON.stringify(data) }),
  signupTeacher: (data) => request('/auth/signup/teacher', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
};
