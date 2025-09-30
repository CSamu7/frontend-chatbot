const getChatsService = async (id_user) => {
  if (id_user === null) return;

  const request = await fetch(
    `${import.meta.env.VITE_USER_URL}${id_user}/chats`,
    {
      credentials: "include",
    }
  );

  const response = await request.json();

  return response;
};

export { getChatsService };
