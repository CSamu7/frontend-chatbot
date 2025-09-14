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

    console.log(request);

    if (!request.ok) throw request;

    const response = await request.json();

    return response;
  };

  return { loginService };
}
