import useChat from "../hooks/useChat";
import ChatItem from "./ChatItem";
import styles from "./ChatsHistory.module.css";

export default function ChatsHistory() {
  const { chats } = useChat();

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
      <h2 className={styles.title}>Conversaciones pasadas</h2>

      {past_chats.length === 0 ? <p>No hay chats recientes</p> : past_chats}
    </aside>
  );
}
