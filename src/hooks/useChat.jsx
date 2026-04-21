// src/hooks/useChat.js
import { useEffect, useState, useCallback, useRef } from "react";
import { chatsService } from "../services/chatServices";

export default function useChat(user) {
  const [chats, setChats] = useState([]);
  const prevUserId = useRef(null);

  const fetchChats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await chatsService.getChats(user.id);
      setChats(response.results || response);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    // Solo ejecutar si el ID del usuario cambió
    if (user?.id && user.id !== prevUserId.current) {
      prevUserId.current = user.id;
      fetchChats();
    } else if (!user) {
      prevUserId.current = null;
      setChats([]);
    }
  }, [user, fetchChats]);

  const deleteChat = useCallback(async (id_chat) => {
    await chatsService.deleteChat(id_chat);
    setChats(prev => prev.filter((chat) => chat.id !== id_chat));
  }, []);

  const modifyChat = useCallback(async (id_chat, newTitle) => {
    await chatsService.patchChat(id_chat, newTitle);
    setChats(prev => prev.map((chat) =>
      chat.id === id_chat ? { ...chat, title: newTitle } : chat
    ));
  }, []);

  const postChat = useCallback(async (title) => {
    const id_user = user?.id || localStorage.getItem("id");
    if (!id_user) throw new Error("Usuario no autenticado");
    
    const chat = await chatsService.postChat(id_user, title);
    await fetchChats();
    return chat;
  }, [user?.id, fetchChats]);

  return { chats, deleteChat, postChat, modifyChat };
}