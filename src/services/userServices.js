const userServices = {
  login: async (email, password) => {
    const request = await fetch(import.meta.env.VITE_LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    if (!request.ok) throw await request.json();

    const response = await request.json();

    return response;
  },

  getUser: async () => {
    const request = await fetch(`${import.meta.env.VITE_USER_DATA_URL}`, {
      credentials: "include",
    });

    if (!request.ok) throw request;

    const response = await request.json();

    return response;
  },

  logout: async () => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/logout/`, {
      credentials: "include",
    });

    if (!request.ok) throw request;
  },
};

export { userServices };
