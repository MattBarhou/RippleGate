import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://ripplegate.onrender.com/api/auth";

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/register`, userData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return error.response || { status: 500 };
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/login`, userData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return error.response || { status: 500 };
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get(`${API_URL}/me`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error.response?.data || error;
  }
};
