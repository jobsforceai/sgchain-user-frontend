import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('sgchain_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
