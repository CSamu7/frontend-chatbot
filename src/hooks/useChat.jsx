import { useEffect, useState } from "react";
import { chatsService } from "../services/chatServices";

export default function useChat(user) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      if (!user?.id) return;
      try {
        const chats = await chatsService.getChats(user.id);
        setChats(chats.results || chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    user ? getChats() : setChats([]);
  }, [user]);

  const deleteChat = async (id_chat) => {
    await chatsService.deleteChat(id_chat);
    setChats(() => chats.filter((chat) => chat.id !== id_chat));
  };

  const modifyChat = async (id_chat, newTitle) => {
    await chatsService.patchChat(id_chat, newTitle);
    const newChats = chats.map((chat) =>
      chat.id === id_chat ? { ...chat, title: newTitle } : chat
    );
    setChats(newChats);
  };

  const postChat = async (title) => {
    const id_user = user?.id || localStorage.getItem("id");
    if (!id_user) throw new Error("Usuario no autenticado");
    
    const chat = await chatsService.postChat(id_user, title);
    const newChats = await chatsService.getChats(id_user);
    setChats(newChats.results || newChats);
    return chat;
  };

  return { chats, deleteChat, postChat, modifyChat };
}