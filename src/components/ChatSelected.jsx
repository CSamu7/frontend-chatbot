// src/components/ChatSelected.jsx
import { useLocation } from "wouter";
import styles from "./ChatSelected.module.css";
import ChatContent from "./ChatContent";
import InputMessage from "./InputMessage";
import NoChatSelected from "./NoChatSelected";
import useMessage from "../hooks/useMessage";

export default function ChatSelected({ onPostChat, onModifyChat }) {
  const [location] = useLocation();
  const { messages, getMessages, postMessage } = useMessage();
  
  console.log("ChatSelected - location:", location);

  // Determinar qué mostrar basado en la ubicación
  let content;
  let idChat = null;
  
  if (location === "/" || location === "") {
    content = <NoChatSelected />;
  } else if (location.startsWith("/chats/")) {
    idChat = parseInt(location.split("/").pop());
    content = (
      <ChatContent
        key={idChat}
        idChat={idChat}
        messages={messages}
        onMessages={getMessages}
      />
    );
  } else {
    content = <NoChatSelected />;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatContent}>
        {content}
      </div>
      <div className={styles.inputContainer}>
        <InputMessage
          onPostMessage={postMessage}
          onPostChat={onPostChat}
          onModifyChat={onModifyChat}
          messages={messages}
        />
      </div>
    </div>
  );
}