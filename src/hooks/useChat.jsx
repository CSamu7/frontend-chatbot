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
    
    const chatsBefore = await chatsService.getChats(id_user);
    const chatsListBefore = chatsBefore.results || chatsBefore;
    
    await chatsService.postChat(id_user, title);
    
    const chatsAfter = await chatsService.getChats(id_user);
    const chatsListAfter = chatsAfter.results || chatsAfter;
    
    const newChat = chatsListAfter.find(
      chat => !chatsListBefore.some(oldChat => oldChat.id === chat.id)
    );
    
    setChats(chatsListAfter);
    
    return newChat || chatsListAfter[0];
  }, [user?.id]);

  return { 
    chats, 
    deleteChat, 
    postChat, 
    modifyChat, 
    refreshChats: fetchChats 
  };
}