import styles from "./InputMessage.module.css";
import send_img from "../assets/chatbot_send_icon.png";
import { useContext, useState } from "react";
import { useLocation } from "wouter";
import { ErrorContext } from "../context/ErrorContext";

export default function InputMessage({
  onPostMessage,
  onPostChat,
  onModifyChat,
  messages,
}) {
  const [isSending, setIsSending] = useState(false);
  const [text, setText] = useState("");
  const [location, navigate] = useLocation();
  const [, setError] = useContext(ErrorContext);

  const idChat = location.includes("/chats/") ? parseInt(location.split("/").at(-1)) : null;

  const handleSendMessage = async () => {
    if (!text || !text.trim()) return;
    
    if (!onPostChat || !onPostMessage || !onModifyChat) {
      console.error("Faltan props en InputMessage");
      setError("Error: Funciones no disponibles");
      return;
    }
    
    try {
      setError("");
      setIsSending(true);

      const shortTitle = `${text.slice(0, 47)}...`;

      if (location.includes("/chats/") && idChat) {
        if (messages.length === 0) {
          await onModifyChat(idChat, shortTitle);
        }
        await onPostMessage(idChat, text);
      } else {
        const newChat = await onPostChat(shortTitle);
        if (newChat && newChat.id) {
          await onPostMessage(newChat.id, text);
          navigate(`/chats/${newChat.id}`);
        }
      }
    } catch (error) {
      console.error("Error en handleSendMessage:", error);
      setError("Error al enviar mensaje. Intenta de nuevo.");
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
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <button className={styles.sendMsg} onClick={handleSendMessage} disabled={isSending}>
        <img src={send_img} alt="Enviar mensaje" />
      </button>
    </div>
  );
}