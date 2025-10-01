import { useLocation } from "wouter";
import useChat from "../hooks/useChat";
import ChatItem from "./ChatItem";
import styles from "./ChatsHistory.module.css";

export default function ChatsHistory({ user }) {
  const { chats, postChat } = useChat(user);
  const [location, navigate] = useLocation();

  const handleCreateChat = async (e) => {
    e.preventDefault();

    const chat = await postChat("Nuevo chat");
    navigate(`/chats/${chat.id}`);
  };

  const past_chats = chats.map((chat) => {
    return (
      <ChatItem
        key={chat.id}
        id={chat.id}
        title={chat.title}
        date={chat["created_at"]}
      ></ChatItem>
    );
  });

  return (
    <aside className={styles.pastConversations}>
      <div className={styles.header}>
        <h2 className={styles.title}>Conversaciones pasadas</h2>
        <button onClick={handleCreateChat} className={styles.createChatbtn}>
          +
        </button>
      </div>
      <div className={styles.chatItems}>
        {past_chats.length === 0 ? <p>No hay chats recientes</p> : past_chats}
      </div>
    </aside>
  );
}
