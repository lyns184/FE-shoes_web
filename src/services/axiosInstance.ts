import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';
import Token from '../utlis/Token';
import { refreshAccessToken } from './auth';

// Tạo axios instance
const axiosInstance: AxiosInstance = axios.create(API_CONFIG);

// Flag để tránh lặp vô hạn khi refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor - Thêm token vào header
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = Token.getAccessToken();
    if (token) {
      const authHeader = `Bearer ${token}`;
      
      config.headers = {
        ...config.headers,
        Authorization: authHeader,
      };
    } else {
      // No access token available for request authentication
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý 401 và refresh token
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Nếu lỗi là 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang refresh token, thêm vào queue để retry sau
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token - sử dụng token service
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          // Cập nhật token cho request hiện tại
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          // Xử lý queue
          processQueue(null, newAccessToken);

          // Retry request gốc
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        // Refresh token thất bại, logout người dùng
        Token.clearAllTokens();
        localStorage.removeItem('userProfile');

        processQueue(refreshError as AxiosError, null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
