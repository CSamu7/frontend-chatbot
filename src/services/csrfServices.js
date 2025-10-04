const setCsrfService = async () => {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/get_csrf/`, {
    credentials: "include",
  });

  const response = await request.json();

  return response;
};

export { setCsrfService };
