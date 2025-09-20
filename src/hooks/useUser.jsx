import { useEffect, useState } from "react";
import userServices from "../services/userServices";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const { loginService, getUserService } = userServices();

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const idUser = localStorage.getItem("id");
        const user = await getUserService(token, idUser);
        setUser(user);
      } catch (error) {
        setError(error.message);
      }
    };

    getUser();
  }, []);

  const login = async (email, password) => {
    setError("");

    try {
      const response = await loginService(email, password);

      localStorage.setItem("token", response.token);
      localStorage.setItem("id", response["id_user"]);
    } catch (request) {
      const response = await request.json();
      setError(response.detail);
    }
  };

  return { user, error, login };
}
