import { createCsrfHeaders } from "../helpers/csrfHelper";

const API_URL = import.meta.env.VITE_API_URL;

const chatsService = {
  getChats: async (id_user) => {
    const request = await fetch(`${API_URL}/users/${id_user}/chats/`, {
      credentials: "include",
    });
    if (!request.ok) throw new Error('Error al obtener chats');
    return await request.json();
  },
  
  deleteChat: async (id_chat) => {
    const headers = createCsrfHeaders();
    const request = await fetch(`${API_URL}/chats/${id_chat}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });
    if (!request.ok) throw new Error('Error al eliminar chat');
  },
  
  postChat: async (id_user, title) => {
    const headers = createCsrfHeaders();
    const request = await fetch(`${API_URL}/users/${id_user}/chats/`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ title }),
      headers,
    });
    if (!request.ok) {
      const error = await request.json().catch(() => ({}));
      throw error;
    }
    return await request.json();
  },
  
  patchChat: async (id_chat, newTitle) => {
    const headers = createCsrfHeaders();
    const request = await fetch(`${API_URL}/chats/${id_chat}`, {
      method: "PATCH",
      credentials: "include",
      headers,
      body: JSON.stringify({ title: newTitle }),
    });
    if (!request.ok) throw new Error('Error al modificar chat');
    return await request.json();
  },
};

export { chatsService };