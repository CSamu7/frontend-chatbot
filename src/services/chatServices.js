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

    const response = await request.json();
    return response;
  },
  
  deleteChat: async (id_chat) => {
    const headers = createCsrfHeaders();

    await fetch(`${API_URL}/chats/${id_chat}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });
  },
  
  postChat: async (id_user, title) => {
    const headers = createCsrfHeaders();
    headers.append("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    const request = await fetch(`${API_URL}/chats/`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        title,
        user: id_user,
      }),
      headers,
    });

    if (!request.ok) throw await request.json();
    const response = await request.json();
    return response;
  },
  
  patchChat: async (id_chat, newTitle) => {
    const headers = createCsrfHeaders();
    headers.append("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    await fetch(`${API_URL}/chats/${id_chat}`, {
      method: "PATCH",
      credentials: "include",
      headers,
      body: JSON.stringify({ title: newTitle }),
    });
  },
};

export { chatsService };