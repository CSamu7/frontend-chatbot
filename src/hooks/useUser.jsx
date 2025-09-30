import { useEffect, useState } from "react";
import userServices from "../services/userServices";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const { loginService, getUserService } = userServices();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getUserService();
        localStorage.setItem("id", user.id);
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

      localStorage.setItem("id", response["id_user"]);
    } catch (request) {
      const response = await request.json();
      setError(response.detail);
    }
  };

  return { user, error, login };
}
