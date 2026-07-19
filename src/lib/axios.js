import axios from 'axios';
import { authClient } from './auth-client';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const { data } = await authClient.getSession(); // session already thakle token pao
  const token = data?.session?.token; // ba authClient.token() call, plugin version onujayi
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;