import { useEffect, useState } from "react";
import { getChatsService } from "../services/chatServices";

export default function useChat() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const chats = await getChatsService(id, token);
    setChats(chats.results);
  };

  const deleteChat = () => {};

  return { chats };
}
