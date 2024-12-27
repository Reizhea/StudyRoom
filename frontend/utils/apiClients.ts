import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const registerUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  return await API.post('/auth/register', data);
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  return await API.post('/auth/verify-otp', data);
};

export const resendOTP = async (data: { email: string }) => {
  return await API.post('/auth/resend-otp', data);
};

export const loginUser = async (data: { email: string; password: string }) => {
  return await API.post('/auth/login', data);
};

export const requestPasswordReset = async (data: { email: string }) => {
  return await API.post('/auth/forgot-password', data); 
};

export const resetPassword = async (data: {
  email: string;
  otp?: string;
  newPassword: string;
  isLoggedIn?: boolean;
}) => {
  return await API.post('/auth/reset-password', data);
};

export default API;
