import axios from 'axios';
import { config } from '@/app/config';

const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
  withCredentials: true, // สำคัญมากถ้าใช้ cookie auth
});

// flag กันไม่ให้วนลูป refresh ซ้ำซ้อน
let isRefreshing = false;
let failedQueue: (() => void)[] = [];

// helper: ถ้า refresh สำเร็จ ให้ retry requests ที่ fail
const processQueue = () => {
  failedQueue.forEach(cb => cb());
  failedQueue = [];
};

// ✳️ Response Interceptor
api.interceptors.response.use(
  response => response, // pass-through ถ้าไม่มี error
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axios.post(`${config.apiUrl}/api/auth/refresh-token`, {}, { withCredentials: true });
          processQueue();
        } catch (refreshError) {
          console.error('🔐 Refresh token failed');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push(() => {
          resolve(api(originalRequest)); // 🔁 retry request เดิม
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
