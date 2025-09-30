import { useEffect, useState } from "react";
import { getMessagesService } from "../services/messageServices";

export default function useMessage(idChat) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      const messages = await getMessagesService(idChat);

      setMessages(messages.results);
    };

    getMessages();
  }, []);

  return { messages };
}
