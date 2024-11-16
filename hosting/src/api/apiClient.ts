import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
