import { createCsrfHeaders } from "../helpers/csrfHelper";

const API_URL = import.meta.env.VITE_API_URL;

const messagesService = {
  getMessages: async (idChat) => {
    console.log("getMessages: El backend no soporta GET /messages/");
    return [];
  },
  
  postMessage: async (idChat, text) => {
    const headers = createCsrfHeaders();
    
    console.log("postMessage - URL:", `${API_URL}/chats/${idChat}/messages/`);
    
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
      console.error("postMessage - Error:", error);
      throw new Error(error.detail || error.error || 'Error al enviar mensaje');
    }
    
    const response = await request.json();
    console.log("postMessage - Respuesta:", response);
    return response;
  },
};

export { messagesService };