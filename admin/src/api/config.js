import axios from 'axios';
import { config } from '@/config/env';

const apiClient = axios.create({
  baseURL: config.apiUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginEndpoint = error.config?.url?.includes('/auth/login');

      if (!isLoginEndpoint && typeof window !== 'undefined') {
        window.location.href = '/auth/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;