import { useEffect, useState, useCallback, useRef } from "react";
import { chatsService } from "../services/chatServices";

export default function useChat(user) {
  const [chats, setChats] = useState([]);
  const prevUserId = useRef(null);

  const fetchChats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await chatsService.getChats(user.id);
      const chatsList = response.results || response;
      
      const sortedChats = [...chatsList].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
      
      setChats(sortedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [user?.id]);

  useEffect(() => {
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
    const userId = localStorage.getItem("id");
    if (userId) {
      localStorage.removeItem(`chat_messages_${userId}_${id_chat}`);
    }
    localStorage.removeItem(`chat_messages_${id_chat}`); // Por si acaso
  setChats(prev => prev.filter((chat) => chat.id !== id_chat));
  }, []);

  const modifyChat = useCallback(async (id_chat, newTitle) => {
    console.log("useChat.modifyChat - ANTES - id:", id_chat, "nuevo título:", newTitle);
    
    await chatsService.patchChat(id_chat, newTitle);
    
    console.log("useChat.modifyChat - DESPUÉS del patch");
    
    setChats(prev => {
      console.log("useChat.modifyChat - Estado anterior:", prev.map(c => ({ id: c.id, title: c.title })));
      const updated = prev.map((chat) =>
        chat.id === id_chat ? { ...chat, title: newTitle } : chat
      );
      console.log("useChat.modifyChat - Estado nuevo:", updated.map(c => ({ id: c.id, title: c.title })));
      return [...updated];
    });
  }, []);

  const postChat = useCallback(async (title) => {
    const id_user = user?.id || localStorage.getItem("id");
    if (!id_user) throw new Error("Usuario no autenticado");
    
    console.log("useChat.postChat - Creando chat con título:", title);
    
    await chatsService.postChat(id_user, title);
    
    const response = await chatsService.getChats(id_user);
    const chatsList = response.results || response;
    const sortedChats = [...chatsList].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    
    setChats(sortedChats);
    
    console.log("useChat.postChat - Chat creado, devolviendo:", sortedChats[0]);
    return sortedChats[0];
  }, [user?.id]);

  const getChatById = useCallback((id) => {
    return chats.find(chat => chat.id === id);
  }, [chats]);

  return { 
    chats, 
    deleteChat, 
    postChat, 
    modifyChat, 
    refreshChats: fetchChats,
    getChatById
  };
}