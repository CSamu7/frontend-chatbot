import { useState } from "react";
import { messagesService } from "../services/messageServices";

export default function useMessage() {
  const [messages, setMessages] = useState([]);

  const getMessages = async (idChat) => {
    const messages = await messagesService.getMessages(idChat);

    setMessages(messages.results);
  };

  const postMessage = async (idChat, text) => {
    const idUser = localStorage.getItem("id");

    await messagesService.postMessage(idChat, idUser, text);
    const newMessages = await getMessages(idChat);

    setMessages(newMessages.results);
  };

  return { messages, getMessages, postMessage };
}
