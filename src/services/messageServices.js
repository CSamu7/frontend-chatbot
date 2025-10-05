import { createCsrfHeaders } from "../helpers/helper";

const messagesService = {
  getMessages: async (idChat) => {
    const request = await fetch(
      `${import.meta.env.VITE_CHAT_URL}${idChat}/messages/`,
      {
        credentials: "include",
      }
    );

    if (!request.ok) throw { status: request.status, text: request.statusText };

    const response = await request.json();

    return response;
  },
  postMessage: async (idChat, idUser, text) => {
    const headers = createCsrfHeaders();
    headers.append("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    console.log(idUser);

    const request = await fetch(
      `${import.meta.env.VITE_CHAT_URL}${idChat}/messages/`,
      {
        method: "POST",
        body: JSON.stringify({
          user: parseInt(idUser),
          text,
          chat: idChat,
        }),
        headers,
        credentials: "include",
      }
    );

    const response = await request.json();

    return response;
  },
};

export { messagesService };
