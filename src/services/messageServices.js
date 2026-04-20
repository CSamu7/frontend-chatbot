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

    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.detail || 'Error al obtener los mensajes');
    }

    const response = await request.json();
    return response;
  },
  
  postMessage: async (idChat, text) => {
    const headers = createCsrfHeaders();

    const request = await fetch(
      `${API_URL}/chats/${idChat}/messages/post/`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
        headers,
        credentials: "include",
      }
    );

    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.detail || 'Error al enviar el mensaje');
    }

    const response = await request.json();
    return response;
  },
};

export { messagesService };