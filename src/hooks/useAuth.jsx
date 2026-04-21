// src/hooks/useAuth.js
import { useCallback, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useAuth() {
  const csrfFetched = useRef(false);

  const setCsrf = useCallback(async () => {
    if (csrfFetched.current) return;
    
    try {
      await fetch(`${API_URL}/get_csrf/`, {
        credentials: "include",
      });
      csrfFetched.current = true;
    } catch (error) {
      console.error("Error fetching CSRF:", error);
    }
  }, []);

  return { setCsrf };
}