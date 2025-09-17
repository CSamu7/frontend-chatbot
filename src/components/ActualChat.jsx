import styles from "./ActualChat.module.css";
import send_img from "../assets/chatbot_send_icon.png";
import { useState } from "react";

export default function ActualChat() {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy SamuBot, ¿en qué puedo ayudarte hoy?", isUser: false, time: "10:30 AM" },
    { text: "Este color está bien o lo cambio, Samum?", isUser: true, time: "10:31 AM" },
  ]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chat}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.isUser ? styles.ownMessage : styles.botMessage}`}>
            {msg.text}
            <div className={styles.messageTime}>{msg.time}</div>
          </div>
        ))}
      </div>
      <div className={styles.formAsk}>
        <textarea 
          type="text" 
          className={styles.formInput} 
          placeholder="Escribe tu mensaje aquí..."
          rows="1"
        />
        <button className={styles.sendMsg}>
          <img src={send_img} alt="Enviar mensaje" />
        </button>
      </div>
    </div>
  );
}