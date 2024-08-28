import axios, { AxiosInstance } from 'axios';

const VITE_THINGSBOARD_URL="http://3.111.205.170:8085/api"


// Create an Axios instance with base URL and headers
const thingsboardAPI: AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_THINGSBOARD_URL, // Use VITE_ prefixed variable
  baseURL: VITE_THINGSBOARD_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the authorization token
thingsboardAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['X-Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default thingsboardAPI;