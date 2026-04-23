import { useState, useEffect, useCallback, useRef } from "react";
import { UserContext } from "./UserContext";
import { userServices } from "../services/userServices";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const getUser = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      
      try {
        const userData = await userServices.getUser();
        if (userData.id) {
          setUser(userData);
          localStorage.setItem("id", userData.id);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const registerUser = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await userServices.registerUser(userData);
      
      const loginResponse = await userServices.login(userData.email, userData.password);
      
      localStorage.setItem("id", loginResponse.id);
      localStorage.setItem("user", JSON.stringify(loginResponse));
      setUser(loginResponse);
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await userServices.login(email, password);
      localStorage.setItem("id", response.id);
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await userServices.logout();
    } finally {
      localStorage.removeItem("id");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      registerUser
    }}>
      {children}
    </UserContext.Provider>
  );
}