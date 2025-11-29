import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './apiConfig';
import useNotificationStore from '@/stores/notification.store';
import useAuthStore from '@/stores/auth.store';

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

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle Unauthorized (401) globally
    if (error.response?.status === 401) {
      // Check if we are not already on the login page to prevent logout loops
      if (window.location.pathname !== '/login') {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    }

    // Handle Rate Limiting (429) globally
    if (error.response?.status === 429) {
      useNotificationStore.getState().setMessage("You're tapping too fast! Please wait a minute.", 'error');
      return Promise.reject(new Error("Too many requests"));
    }

    // Map other backend error codes to user-friendly messages
    const backendErrorCode = error.response?.data?.error?.message;
    let friendlyMessage = "An unexpected error occurred. Please try again.";

    switch (backendErrorCode) {
      case 'INSUFFICIENT_FUNDS':
        friendlyMessage = "Your wallet balance is too low for this transaction.";
        break;
      case 'INVALID_PIN':
        friendlyMessage = "Incorrect PIN. Please try again.";
        break;
      case 'NO_FILE_UPLOADED':
        friendlyMessage = "Please select a file to upload.";
        break;
      case 'FILE_UPLOAD_FAILED':
        friendlyMessage = "Upload failed. Please try a smaller file or check your connection.";
        break;
    }
    
    if (error.response?.status === 500) {
      friendlyMessage = "Something went wrong on our end. Please try again later.";
    }

    error.message = friendlyMessage;
    return Promise.reject(error);
  }
);

export default api;
