import { useEffect, useState } from "react";
import { getMessagesService } from "../services/messageServices";

export default function useMessage(idChat) {
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    const getMessages = async () => {
      try {
        const messages = await getMessagesService(idChat);

        setMessages(messages.results);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    getMessages();
  }, [idChat]);

  return { messages, errorMessage };
}
