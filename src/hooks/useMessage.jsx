import { useState, useCallback, useEffect, useRef } from "react";
import { messagesService } from "../services/messageServices";

export default function useMessage() {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const userId = localStorage.getItem("id");
  const pendingMessageRef = useRef(null);

  const getStorageKey = (chatId) => {
    return userId ? `chat_messages_${userId}_${chatId}` : `chat_messages_${chatId}`;
  };

  useEffect(() => {
    if (currentChatId && userId) {
      setIsLoading(true);
      const storageKey = getStorageKey(currentChatId);
      const savedMessages = localStorage.getItem(storageKey);
      
      let loadedMessages = [];
      if (savedMessages) {
        try {
          loadedMessages = JSON.parse(savedMessages);
          console.log(`useMessage - Cargando ${loadedMessages.length} mensajes para usuario ${userId}, chat ${currentChatId}`);
        } catch (e) {
          console.error("Error parsing saved messages:", e);
        }
      }
      
      setMessages(loadedMessages);
      setIsLoading(false);
      
      if (pendingMessageRef.current && pendingMessageRef.current.chatId === currentChatId) {
        const { text } = pendingMessageRef.current;
        pendingMessageRef.current = null;
        postMessage(currentChatId, text);
      }
    }
  }, [currentChatId, userId]);

  useEffect(() => {
    if (currentChatId && userId && messages.length > 0 && !isLoading) {
      const storageKey = getStorageKey(currentChatId);
      localStorage.setItem(storageKey, JSON.stringify(messages));
      console.log(`useMessage - Guardados ${messages.length} mensajes para usuario ${userId}, chat ${currentChatId}`);
    }
  }, [messages, currentChatId, userId, isLoading]);

  const getMessages = useCallback(async (idChat) => {
    console.log("useMessage.getMessages - idChat:", idChat);
    
    if (currentChatId !== idChat) {
      console.log("useMessage - Cambiando a chat:", idChat);
      setCurrentChatId(idChat);
    }
  }, [currentChatId]);

  const postMessage = useCallback(async (idChat, text) => {
    console.log("useMessage.postMessage - idChat:", idChat, "text:", text);
    
    if (!idChat || !text) return;
    
    if (currentChatId !== idChat) {
      setCurrentChatId(idChat);
    }
    
    try {
      const userMessage = {
        text,
        isUser: true,
        time: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      const response = await messagesService.postMessage(idChat, text);
      
      const botMessage = {
        text: response.msg || response.response || "Sin respuesta",
        isUser: false,
        time: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, botMessage]);
      
      return response;
    } catch (error) {
      console.error("useMessage.postMessage - ERROR:", error);
      const errorMessage = {
        text: "Error: No se pudo enviar el mensaje. Intenta de nuevo.",
        isUser: false,
        time: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    }
  }, [currentChatId, userId]);

  const setPendingMessage = useCallback((chatId, text) => {
    pendingMessageRef.current = { chatId, text };
  }, []);

  const clearMessages = useCallback(() => {
    if (currentChatId && userId) {
      const storageKey = getStorageKey(currentChatId);
      localStorage.removeItem(storageKey);
    }
    setMessages([]);
    setCurrentChatId(null);
  }, [currentChatId, userId]);

  return { 
    messages, 
    getMessages, 
    postMessage, 
    clearMessages,
    setMessages,
    setPendingMessage,
    isLoading
  };
}