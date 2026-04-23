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
    
    setChats(prev => prev.filter((chat) => chat.id !== id_chat));
  }, []);

  const modifyChat = useCallback(async (id_chat, newTitle) => {
    await chatsService.patchChat(id_chat, newTitle);
    
    setChats(prev => {
      const updated = prev.map((chat) =>
        chat.id === id_chat ? { ...chat, title: newTitle } : chat
      );
      return [...updated].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
    });
  }, []);

  const postChat = useCallback(async (title) => {
    const id_user = user?.id || localStorage.getItem("id");
    if (!id_user) {
      throw new Error("Debes iniciar sesión para crear un chat.");
    }
    
    await chatsService.postChat(id_user, title);
    
    const response = await chatsService.getChats(id_user);
    const chatsList = response.results || response;
    const sortedChats = [...chatsList].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    
    setChats(sortedChats);
    
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