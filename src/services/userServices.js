export default function userServices() {
  const loginService = async (email, password) => {
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

    if (!request.ok) throw request;

    const response = await request.json();

    return response;
  };

  const getUserService = async (token, id) => {
    const request = await fetch(`${import.meta.env.VITE_USER_URL}/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!request.ok) throw request;

    const response = await request.json();

    return response;
  };

  return { loginService, getUserService };
}
