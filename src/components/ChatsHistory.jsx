import { useLocation } from "wouter";
import ChatItem from "./ChatItem";
import styles from "./ChatsHistory.module.css";
import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

export default function ChatsHistory({
  chats,
  onPostChat,
  onDeleteChat,
  onSetActiveChat,
}) {
  const [_, navigate] = useLocation();
  const [error, setError] = useContext(ErrorContext);

  const handleCreateChat = async (e) => {
    try {
      setError("");
      e.preventDefault();

      const chat = await onPostChat("Nuevo chat");

      onSetActiveChat(chat.id);
      navigate(`/chats/${chat.id}`);
    } catch (error) {
      setError(error.detail);
    }
  };

  const past_chats = chats.map((chat) => {
    return (
      <ChatItem
        key={chat.id}
        id={chat.id}
        title={chat.title}
        date={chat["created_at"]}
        onDeleteChat={onDeleteChat}
        onSetActiveChat={onSetActiveChat}
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
        {past_chats.length === 0 ? (
          <p className={styles.messageNotChats}>No tienes chats recientes</p>
        ) : (
          past_chats
        )}
      </div>
    </aside>
  );
}
