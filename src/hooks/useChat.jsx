import { useEffect, useState } from "react";
import {
  getChatsService,
  deleteChatService,
  postChatService,
} from "../services/chatServices";

export default function useChat(user) {
  const [chats, setChats] = useState([]);
  const [errorChat, setErrorChat] = useState("");

  useEffect(() => {
    const getChats = async (idUser) => {
      try {
        const chats = await getChatsService(idUser);

        setChats(chats.results);
      } catch (error) {
        setErrorChat(error.message);
      }
    };

    if (user) getChats(user.id);
  }, [user]);

  const deleteChat = async (id_chat) => {
    try {
      const chats = await deleteChatService(id_chat);

      setChats(chats);
    } catch (error) {
      setErrorChat(error.message);
    }
  };

  const postChat = async (title) => {
    try {
      const id_user = localStorage.getItem("id");

      return await postChatService(id_user, title);
    } catch (error) {
      setErrorChat(error.message);
    }
  };

  return { chats, deleteChat, postChat };
}
