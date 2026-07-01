import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://magnula-home-production.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect on login endpoint itself - let the login page handle the error
      const isLoginEndpoint = error.config?.url?.includes('/auth/login');

      if (!isLoginEndpoint && typeof window !== 'undefined') {
        // Unauthorized - redirect to login (Redux and cookie handled by browser)
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
