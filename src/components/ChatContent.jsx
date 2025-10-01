import useMessage from "../hooks/useMessage";
import styles from "./ChatContent.module.css";

export default function ChatContent({ id }) {
  const { messages, errorMessage } = useMessage(id);

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
        <p>Envia un mensaje para interactuar con el chatbot</p>
      ) : (
        messagesJSX
      )}
    </div>
  );
}
