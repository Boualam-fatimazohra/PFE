import axios from 'axios';
const API_BASE_URL = import.meta.env.MODE==="development"?import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api':'/api';
//import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential for sending/receiving cookies across domains
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        // Redirect to login page if not already there
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
