import { createCsrfHeaders } from "../helpers/csrfHelper";

const chatsService = {
  getChats: async (id_user) => {
    const request = await fetch(
      `${import.meta.env.VITE_USER_URL}${id_user}/chats/`,
      {
        credentials: "include",
      }
    );

    const response = await request.json();

    return response;
  },
  deleteChat: async (id_chat) => {
    const headers = createCsrfHeaders();

    await fetch(`${import.meta.env.VITE_CHAT_URL}${id_chat}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });
  },
  postChat: async (id_user, title) => {
    const headers = createCsrfHeaders();

    headers.append("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    const request = await fetch(`${import.meta.env.VITE_CHAT_URL}`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        title,
        user: id_user,
      }),
    });

    if (!request.ok) throw await request.json();

    const response = await request.json();

    return response;
  },
};

export { chatsService };
