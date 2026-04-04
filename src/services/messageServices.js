import { createCsrfHeaders } from "../helpers/csrfHelper";

const API_URL = import.meta.env.VITE_API_URL;

const messagesService = {
  getMessages: async (idChat) => {
    const request = await fetch(
      `${API_URL}/chats/${idChat}/messages/`,
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

    const request = await fetch(
      `${API_URL}/chats/${idChat}/messages/`,
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

    if (!request.ok) throw request.json();

    const response = await request.json();
    return response;
  },
};

export { messagesService };