import { useEffect, useState } from "react";
import { chatsService } from "../services/chatServices";

export default function useChat(user) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const chats = await chatsService.getChats(user.id);
      setChats(chats.results);
    };

    user ? getChats() : setChats([]);
  }, [user]);

  const deleteChat = async (id_chat) => {
    await chatsService.deleteChat(id_chat);
    setChats(() => chats.filter((chat) => chat.id !== id_chat));
  };

  const postChat = async (title) => {
    const id_user = localStorage.getItem("id");
    const chat = await chatsService.postChat(id_user, title);

    setChats([...chats, chat]);

    return chat;
  };

  return { chats, deleteChat, postChat };
}
