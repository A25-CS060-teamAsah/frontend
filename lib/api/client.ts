
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const sanitizedBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', sanitizedBaseUrl);
}

const apiClient: AxiosInstance = axios.create({
  baseURL: sanitizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
