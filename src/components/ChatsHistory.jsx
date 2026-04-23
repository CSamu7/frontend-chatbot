import { useLocation } from "wouter";
import ChatItem from "./ChatItem";
import styles from "./ChatsHistory.module.css";
import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

export default function ChatsHistory({ user, chats, onDeleteChat, onPostChat, onModifyChat }) {
  const [location, navigate] = useLocation();
  const [errorMsg, setError] = useContext(ErrorContext);

  const activeChatId = location.includes("/chats/") ? parseInt(location.split("/").at(-1)) : null;

  const handleCreateChat = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Debes iniciar sesión para crear un chat.");
      return;
    }
    
    try {
      setError("");
      const chat = await onPostChat("Nuevo chat");
      if (chat && chat.id) {
        navigate(`/chats/${chat.id}`);
      }
    } catch (error) {
      console.error("Error al crear chat:", error);
      setError(error.message || "Error al crear chat. Intenta de nuevo.");
    }
  };

  const past_chats = chats.map((chat) => (
    <ChatItem
      key={chat.id}
      id={chat.id}
      title={chat.title}
      date={chat["created_at"]}
      onDeleteChat={onDeleteChat}
      onModifyChat={onModifyChat}
      isActive={chat.id === activeChatId}
    />
  ));

  return (
    <aside className={styles.pastConversations}>
      <div className={styles.header}>
        <h2 className={styles.title}>Conversaciones pasadas</h2>
        <button 
          onClick={handleCreateChat} 
          className={styles.createChatbtn} 
          aria-label="Crear nuevo chat"
        >
          <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className={styles.buttonText}>Nuevo chat</span>
        </button>
      </div>
      <div className={styles.chatItems}>
        {!user ? (
          <p className={styles.loginPrompt}>Inicia sesión para ver tus chats</p>
        ) : past_chats.length === 0 ? (
          <p>No tienes chats recientes</p>
        ) : (
          past_chats
        )}
      </div>
    </aside>
  );
}