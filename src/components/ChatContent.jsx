import { useEffect } from "react";
import styles from "./ChatContent.module.css";

export default function ChatContent({ idChat, messages, onMessages }) {
  useEffect(() => {
    onMessages(idChat);
  }, [idChat]);

  const messagesJSX = messages.map((msg, index) => (
    <div
      key={index}
      className={`${styles.message} ${
        msg.isUser ? styles.ownMessage : styles.botMessage
      }`}
    >
      {msg.text}
      <div className={styles.messageTime}>{msg.time}</div>
    </div>
  ));

  return (
    <div className={styles.chat}>
      {messagesJSX.length <= 0 ? (
        <p className={styles.emptyChatMessage}>
          Envia un mensaje para interactuar con el chatbot
        </p>
      ) : (
        messagesJSX
      )}
    </div>
  );
}
