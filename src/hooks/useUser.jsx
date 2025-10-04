import { useEffect, useState } from "react";
import { userServices } from "../services/userServices";

export default function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const idUser = localStorage.getItem("id");

    const getUser = async () => {
      const user = await userServices.getUser();

      setUser(user);
    };

    if (!user && idUser) getUser();
  });

  const login = async (email, password) => {
    const response = await userServices.login(email, password);
    localStorage.setItem("id", response["id"]);
    setUser(response);
  };

  const logout = async () => {
    localStorage.clear("");
    setUser(null);
    await userServices.logout();
  };

  return { user, login, logout };
}
