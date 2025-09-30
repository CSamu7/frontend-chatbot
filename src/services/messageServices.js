const getMessagesService = async (idChat) => {
  console.log(`${import.meta.env.VITE_CHAT_URL}/${idChat}/messages/`);

  const request = await fetch(
    `${import.meta.env.VITE_CHAT_URL}${idChat}/messages/`,
    {
      credentials: "include",
    }
  );

  const response = await request.json();

  return response;
};

export { getMessagesService };
