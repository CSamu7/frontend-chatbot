import { useEffect, useState, useRef } from "react";
import styles from "./ChatContent.module.css";

export default function ChatContent({ idChat, messages, onMessages, onPostMessage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [pendingProcessed, setPendingProcessed] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("ChatContent - idChat cambiado a:", idChat);
    
    const loadMessages = async () => {
      if (!idChat) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        await onMessages(idChat);
        
        const pendingKey = `pending_message_${idChat}`;
        const pendingMessage = sessionStorage.getItem(pendingKey);
        
        if (pendingMessage && !pendingProcessed) {
          console.log("ChatContent - Encontrado mensaje pendiente:", pendingMessage);
          sessionStorage.removeItem(pendingKey);
          setPendingProcessed(true);
          
          await onPostMessage(idChat, pendingMessage);
        }
        
        setShouldAutoScroll(true);
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(err.message || "Error al cargar los mensajes");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    return () => {
      setPendingProcessed(false);
    };
  }, [idChat, onMessages, onPostMessage]);

  const handleCopyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(index);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Error al copiar el mensaje:", error);
    }
  };

  if (isLoading) return <div className={styles.loading}>Cargando mensajes...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const messagesJSX = messages.map((msg, index) => (
    <div
      key={index}
      className={`${styles.message} ${
        msg.isUser ? styles.ownMessage : styles.botMessage
      }`}
    >
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{msg.text}</div>
        <button
          onClick={() => handleCopyMessage(msg.text, index)}
          className={styles.copyButton}
          title="Copiar mensaje"
        >
          {copiedMessageId === index ? "✓" : "📋"}
        </button>
      </div>
      <div className={styles.messageTime}>{msg.time}</div>
    </div>
  ));

  return (
    <div 
      className={styles.chat} 
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      {messagesJSX.length === 0 ? (
        <p className={styles.emptyChatMessage}>
          Envía un mensaje para interactuar con el chatbot
        </p>
      ) : (
        messagesJSX
      )}
      {/* Elemento invisible al final para hacer scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
}