import { useState, useCallback, useEffect, useRef } from "react";
import { messagesService } from "../services/messageServices";

export default function useMessage() {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const userId = localStorage.getItem("id");
  const pendingMessageRef = useRef(null);
  const lastSavedChatRef = useRef(null); // Para evitar guardados duplicados

  const getStorageKey = (chatId) => {
    return userId ? `chat_messages_${userId}_${chatId}` : `chat_messages_${chatId}`;
  };

  // Cargar mensajes cuando cambia el chat
  useEffect(() => {
    console.log("useMessage - useEffect de carga - currentChatId:", currentChatId, "userId:", userId);
    
    if (currentChatId && currentChatId !== "guest" && userId) {
      setIsLoading(true);
      const storageKey = getStorageKey(currentChatId);
      const savedMessages = localStorage.getItem(storageKey);
      
      console.log("useMessage - storageKey:", storageKey, "savedMessages:", savedMessages ? "presentes" : "null");
      
      if (savedMessages) {
        try {
          const loadedMessages = JSON.parse(savedMessages);
          console.log("useMessage - Cargando", loadedMessages.length, "mensajes");
          setMessages(loadedMessages);
        } catch (e) {
          console.error("Error parsing saved messages:", e);
          setMessages([]);
        }
      } else {
        console.log("useMessage - Chat VACÍO, limpiando mensajes");
        setMessages([]);
      }
      
      // Pequeño retraso para asegurar que el estado se actualice
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
      
      if (pendingMessageRef.current && pendingMessageRef.current.chatId === currentChatId) {
        const { text } = pendingMessageRef.current;
        pendingMessageRef.current = null;
        setTimeout(() => {
          postMessage(currentChatId, text);
        }, 150);
      }
    }
  }, [currentChatId, userId]);

  // Guardar mensajes SOLO cuando no está cargando y el chat es estable
  useEffect(() => {
    if (currentChatId && currentChatId !== "guest" && userId && !isLoading) {
      // Evitar guardar si los mensajes están vacíos y no hay nada que limpiar
      if (messages.length > 0 || lastSavedChatRef.current === currentChatId) {
        const storageKey = getStorageKey(currentChatId);
        localStorage.setItem(storageKey, JSON.stringify(messages));
        lastSavedChatRef.current = currentChatId;
        console.log("useMessage - Guardados", messages.length, "mensajes para chat", currentChatId);
      }
    }
  }, [messages, currentChatId, userId, isLoading]);

  const getMessages = useCallback(async (idChat) => {
    console.log("useMessage.getMessages - idChat:", idChat);
    
    if (currentChatId !== idChat) {
      console.log("useMessage - Cambiando a chat:", idChat);
      setCurrentChatId(idChat);
    }
  }, [currentChatId]);

  const postMessage = useCallback(async (idChat, text, botResponseText) => {
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
      throw error;
    }
  }, [currentChatId, userId]);

  const setPendingMessage = useCallback((chatId, text) => {
    console.log("useMessage.setPendingMessage - chatId:", chatId, "text:", text);
    pendingMessageRef.current = { chatId, text };
  }, []);

  const clearMessages = useCallback(() => {
    if (currentChatId && currentChatId !== "guest" && userId) {
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