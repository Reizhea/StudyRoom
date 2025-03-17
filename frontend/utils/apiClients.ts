import axios from 'axios';

let accessToken: string | null = null;

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};
export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
  accessToken = token;
};

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = getAccessToken(); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Access token expired or invalid. Redirecting to login...");
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

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

export const finalizeRegistration = async (data: { email: string }) => {
  return await API.post("/auth/finalize-registration", data);
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

export const checkAuth = async () => {
  return await API.get("/auth/check-auth");
};

// User Profile APIs
export const getUserProfile = async () => {
  return await API.get('/auth/profile');
};

export const updateUserProfile = async (data: {
  username?: string;
  password?: string;
  profilePicture?: string;
}) => {
  return await API.put("/auth/profile", data);
};


export default API;
