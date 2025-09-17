import styles from "./ChatsHistory.module.css";

export default function HistoryConversations() {
  const items = [
    { date: "24-09-2025", title: "Hola, Samu" },
    { date: "24-09-2025", title: "Estoy probando esto" },
  ];

  const past_chats = items.map((item, index) => {
    return (
      <div key={index}>
        <h3>{item.title}</h3>
        <p>{item.date}</p>
      </div>
    );
  });

  return (
    <aside className={styles.pastConversations}>
      <h2 className={styles.title}>Conversaciones pasadas</h2>
      {past_chats}
    </aside>
  );
}