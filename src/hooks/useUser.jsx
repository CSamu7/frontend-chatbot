import { useState } from "react";
import userServices from "../services/userServices";

export default function useUser() {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const { loginService } = userServices();

  const login = async (email, password) => {
    setError(null);

    try {
      const response = await loginService(email, password);

      document.cookie = `token=${response.token}`;
    } catch (request) {
      const response = await request.json();
      setError(response.detail);
    }
  };

  return { user, error, login };
}
