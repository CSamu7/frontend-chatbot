import styles from "./InputMessage.module.css";
import send_img from "../assets/chatbot_send_icon.png";
import { useState } from "react";
import { useLocation } from "wouter";

export default function InputMessage({ onPostMessage }) {
  const [isSending, setIsSending] = useState(false);
  const [text, setText] = useState("");
  const [location, _] = useLocation();

  const idChat = parseInt(location.split("/").at(-1));

  const handleSendMessage = async () => {
    try {
      setIsSending(true);
      await onPostMessage(idChat, text);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
      setText("");
    }
  };

  return (
    <div className={styles.formAsk}>
      <textarea
        type="text"
        className={styles.formInput}
        placeholder="Escribe tu mensaje aquí..."
        rows="1"
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.sendMsg} onClick={handleSendMessage}>
        <img src={send_img} alt="Enviar mensaje" />
      </button>
    </div>
  );
}
