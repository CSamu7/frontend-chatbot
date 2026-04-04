import { createCsrfHeaders } from "../helpers/csrfHelper";

const API_URL = import.meta.env.VITE_API_URL;

const userServices = {
  getCsrf: async () => {
    const response = await fetch(`${API_URL}/get_csrf/`, {
      credentials: "include",
    });
    return response.json();
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },
  
  // 👈 AGREGAR ESTA FUNCIÓN
  registerUser: async (userData) => {
    return userServices.register(userData);
  },
  
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },
  
  logout: async () => {
    const headers = createCsrfHeaders();
    await fetch(`${API_URL}/logout/`, {
      method: "POST",
      credentials: "include",
      headers,
    });
  },
  
  getUser: async () => {
    const response = await fetch(`${API_URL}/whoami/`, {
      credentials: "include",
    });
    if (!response.ok) return null;
    return response.json();
  }
};

export { userServices };