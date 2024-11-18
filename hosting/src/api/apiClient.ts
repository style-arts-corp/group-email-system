import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    Accept: 'application/json',
  },
});

// FormDataを送信する際の設定
apiClient.interceptors.request.use((config) => {
  // FormDataの場合は、Content-Typeを自動設定させる
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// レスポンスとエラーのインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default apiClient;
