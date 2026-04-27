import { createCsrfHeaders } from "../helpers/csrfHelper";

const API_URL = import.meta.env.VITE_API_URL;

const userServices = {
  getUser: async () => {
    const request = await fetch(`${API_URL}/whoami/`, {
      credentials: "include",
    });

    if (!request.ok) {
      return { isAuthenticated: false };
    }

    return await request.json();
  },

  login: async (email, password) => {
    const headers = createCsrfHeaders();
    const request = await fetch(`${API_URL}/login/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ email, password }),
    });

    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.error || 'Credenciales inválidas');
    }

    const response = await request.json();
    return response;
  },

  registerUser: async (user) => {
    const headers = createCsrfHeaders();
    const request = await fetch(`${API_URL}/users/`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        password: user.password,
      }),
    });

    if (!request.ok) {
      const error = await request.json();
      const errorMsg = error.detail || error.email || error.username || 'Error en el registro';
      throw new Error(errorMsg);
    }

    const response = await request.json();
    return response;
  },

  logout: async () => {
    try {
      const headers = createCsrfHeaders();
      await fetch(`${API_URL}/logout/`, {
        method: "GET",
        credentials: "include",
        headers,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
};

export { userServices };