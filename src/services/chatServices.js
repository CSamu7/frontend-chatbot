import { createCsrfHeaders } from "../helpers/csrfHelper";

const API_URL = import.meta.env.VITE_API_URL;

const chatsService = {
  getChats: async (id_user) => {
    const request = await fetch(
      `${API_URL}/users/${id_user}/chats/`,
      {
        credentials: "include",
      }
    );

    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.detail || 'Error al obtener los chats');
    }

    const response = await request.json();
    return response;
  },
  
  deleteChat: async (id_chat) => {
    const headers = createCsrfHeaders();

    const request = await fetch(`${API_URL}/chats/${id_chat}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.detail || 'Error al eliminar el chat');
    }
  },
  
  postChat: async (id_user, title) => {
    const headers = createCsrfHeaders();

    const request = await fetch(`${API_URL}/chats/`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ title }),
      headers,
    });

    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.detail || 'Error al crear el chat');
    }

    const response = await request.json();
    return response;
  },
  
  patchChat: async (id_chat, newTitle) => {
    const headers = createCsrfHeaders();

    const request = await fetch(`${API_URL}/chats/${id_chat}`, {
      method: "PATCH",
      credentials: "include",
      headers,
      body: JSON.stringify({ title: newTitle }),
    });

    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.detail || 'Error al modificar el chat');
    }

    return await request.json();
  },
};

export { chatsService };