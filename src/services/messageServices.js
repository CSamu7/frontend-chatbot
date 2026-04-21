import { createCsrfHeaders } from "../helpers/csrfHelper";

const API_URL = import.meta.env.VITE_API_URL;

const messagesService = {
  getMessages: async (idChat) => {
    console.log("getMessages: El backend no soporta GET /messages/");
    return [];
  },
  
  postMessage: async (idChat, text) => {
    const headers = createCsrfHeaders();
    
    const request = await fetch(
      `${API_URL}/chats/${idChat}/messages/`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ text }),
        headers,
      }
    );
    
    if (!request.ok) {
      const error = await request.json().catch(() => ({}));
      throw new Error(error.detail || error.error || 'Error al enviar mensaje');
    }
    
    return await request.json();
  },
};

export { messagesService };