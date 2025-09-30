import { useEffect, useState } from "react";
import { getChatsService } from "../services/chatServices";

export default function useChat(user) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async (idUser) => {
      try {
        const chats = await getChatsService(idUser);

        setChats(chats.results);
      } catch (error) {}
    };

    if (user) getChats(user.id);
  }, [user]);

  const deleteChat = () => {};

  return { chats };
}
