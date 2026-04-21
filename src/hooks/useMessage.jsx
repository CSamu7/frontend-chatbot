// src/hooks/useMessage.js
import { useState, useCallback } from "react";
import { messagesService } from "../services/messageServices";

export default function useMessage() {
  const [messages, setMessages] = useState([]);

  const getMessages = useCallback(async (idChat) => {
    console.log("useMessage.getMessages - idChat:", idChat);
  }, []);

  const postMessage = useCallback(async (idChat, text) => {
    console.log("useMessage.postMessage - idChat:", idChat, "text:", text);
    
    if (!idChat || !text) return;
    
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
  }, []);

  return { messages, getMessages, postMessage, setMessages };
}