export default function userServices() {
  const loginService = async (email, password) => {
    const request = await fetch(import.meta.env.VITE_LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (!request.ok) throw request;

    const response = await request.json();

    return response;
  };

  const getUserService = async () => {
    const request = await fetch(`${import.meta.env.VITE_USER_DATA_URL}`, {
      credentials: "include",
    });

    if (!request.ok) throw request;

    const response = await request.json();

    return response;
  };

  return { loginService, getUserService };
}
