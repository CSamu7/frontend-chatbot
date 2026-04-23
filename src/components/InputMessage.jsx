import styles from "./InputMessage.module.css";
import send_img from "../assets/chatbot_send_icon.png";
import { useContext, useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ErrorContext } from "../context/ErrorContext";
import { useUserContext } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function InputMessage({
  onPostMessage,
  onPostChat,
  onModifyChat,
  messages,
  onSetPendingMessage,
}) {
  const [isSending, setIsSending] = useState(false);
  const [text, setText] = useState("");
  const [location, navigate] = useLocation();
  const [, setError] = useContext(ErrorContext);
  const textareaRef = useRef(null);
  const { user } = useUserContext();

  const idChat = location.includes("/chats/") ? parseInt(location.split("/").at(-1)) : null;

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  const handleSendMessage = async () => {
    if (!text || !text.trim()) return;
    
    setIsSending(true);
    setError("");

    const shortTitle = text.length > 47 ? `${text.slice(0, 47)}...` : text;

    try {
      if (!user) {
        const response = await fetch(`${API_URL}/chatbot/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        });
        
        const data = await response.json();
        
        await onPostMessage("guest", text, data.response);
        setText("");
        return;
      }
      
      // SI HAY USUARIO (COMPORTAMIENTO NORMAL)
      if (!onPostChat || !onPostMessage || !onModifyChat) {
        console.error("Faltan props en InputMessage");
        setError("Error: Funciones no disponibles");
        return;
      }

      if (location.includes("/chats/") && idChat) {
        if (messages.length === 0) {
          await onModifyChat(idChat, shortTitle);
        }
        await onPostMessage(idChat, text);
        setText("");
      } else {
        const newChat = await onPostChat("Nuevo chat");
        
        if (newChat && newChat.id) {
          if (onSetPendingMessage) {
            onSetPendingMessage(newChat.id, text);
          }
          await onModifyChat(newChat.id, shortTitle);
          setText("");
          navigate(`/chats/${newChat.id}`);
        } else {
          throw new Error("No se pudo crear el chat");
        }
      }
    } catch (error) {
      console.error("Error en handleSendMessage:", error);
      setError(error.message || "Error al enviar mensaje. Intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.formAsk}>
      <textarea
        ref={textareaRef}
        className={styles.formInput}
        placeholder="Escribe tu mensaje aquí..."
        rows="1"
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button 
        className={styles.sendMsg} 
        onClick={handleSendMessage} 
        disabled={isSending || !text.trim()}
      >
        <img src={send_img} alt="Enviar mensaje" />
      </button>
    </div>
  );
}