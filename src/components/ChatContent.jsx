import styles from "./ChatContent.module.css";

export default function ChatContent() {
  // const { messages } = useMessage();

  const messages = [
    {
      text: "¡Hola! Soy SamuBot, ¿en qué puedo ayudarte hoy?",
      isUser: false,
      time: "10:30 AM",
    },
    {
      text: "Este color está bien o lo cambio, Samum?",
      isUser: true,
      time: "10:31 AM",
    },
  ];

  return (
    <div className={styles.chat}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${styles.message} ${
            msg.isUser ? styles.ownMessage : styles.botMessage
          }`}
        >
          {msg.text}
          <div className={styles.messageTime}>{msg.time}</div>
        </div>
      ))}
    </div>
  );
}
