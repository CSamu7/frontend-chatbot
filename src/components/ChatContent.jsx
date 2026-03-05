import { useEffect, useState } from "react";
import styles from "./ChatContent.module.css";

export default function ChatContent({ idChat, messages, onMessages }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await onMessages(idChat);
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(err.message || "Error al cargar los mensajes");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [idChat, onMessages]);

  if (isLoading) return <div>Cargando mensajes...</div>;
  
  if (error) return <div className={styles.error}>Error: {error}</div>;

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