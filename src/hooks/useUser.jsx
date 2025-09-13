import { useState } from "react";

export default function useUser() {
  const [user, setUser] = useState({});

  const login = async (email, password) => {
    try {
      const request = await fetch(import.meta.env.VITE_TOKEN_URL, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!request.ok) throw new Error("Fallo");

      const response = await request.json();

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return { user, login };
}
