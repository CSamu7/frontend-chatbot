const getMessagesService = async (idChat) => {
  console.log(`${import.meta.env.VITE_CHAT_URL}/${idChat}/messages/`);

  const request = await fetch(
    `${import.meta.env.VITE_CHAT_URL}${idChat}/messages/`,
    {
      credentials: "include",
    }
  );

  if (!request.ok) throw { status: request.status, text: request.statusText };

  const response = await request.json();

  return response;
};

export { getMessagesService };
