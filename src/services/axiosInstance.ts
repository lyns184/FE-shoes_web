import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Tạo axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:6869/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Gửi cookies
});

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
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
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
        // Gọi API refresh token - GET request, gửi refreshToken qua cookies
        const response = await axios.get('https://backend_test_api.nport.link/api/auth/refresh-token', {
          withCredentials: true, // Gửi cookies chứa refreshToken
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success && response.data.accessToken) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          // Cập nhật token cho request hiện tại
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          // Xử lý queue
          processQueue(null, newAccessToken);

          // Retry request gốc
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token thất bại, logout người dùng
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userProfile');
        
        // Xóa cookie refreshToken
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

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
