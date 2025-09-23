const getChatsService = async (id_user, token) => {
  const request = await fetch(
    `${import.meta.env.VITE_USER_URL}/${id_user}/chats`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  const response = await request.json();

  return response;
};

export { getChatsService };
