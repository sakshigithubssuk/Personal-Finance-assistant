import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://personal-finance-assistant-3r7t.onrender.com/api',
});

// This interceptor is the key to authenticated requests!
apiClient.interceptors.request.use(config => {
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // If user info and a token exist, add the "Bearer" token to the headers
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
