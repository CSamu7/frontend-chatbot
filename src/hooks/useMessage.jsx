import { useState } from "react";
import { messagesService } from "../services/messageServices";

export default function useMessage() {
  const [messages, setMessages] = useState([]);

  const getMessages = async (idChat) => {
    const messagesData = await messagesService.getMessages(idChat);
    
    const formattedMessages = messagesData.map((msg, index) => ({
      text: msg.text,
      isUser: index % 2 === 0,
      time: new Date().toLocaleTimeString(),
    }));
    
    setMessages(formattedMessages);
  };

  const postMessage = async (idChat, text) => {
    await messagesService.postMessage(idChat, text);
    await getMessages(idChat);
  };

  return { messages, getMessages, postMessage };
}