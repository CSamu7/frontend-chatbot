import { useEffect } from "react";
import styles from "./ChatSelected.module.css";
import ChatContent from "./ChatContent";
import InputMessage from "./InputMessage";
import NoChatSelected from "./NoChatSelected";
import { Route, Switch, useLocation } from "wouter";
import useMessage from "../hooks/useMessage";

export default function ChatSelected({ chats, onPostChat, onModifyChat }) {
  const { messages, getMessages, postMessage, setPendingMessage } = useMessage();
  const [location] = useLocation();

  const idChat = location.includes("/chats/") ? parseInt(location.split("/").at(-1)) : null;
  const currentChat = idChat ? chats.find(chat => chat.id === idChat) : null;
  const chatTitle = currentChat?.title || "Nuevo chat";

  useEffect(() => {
    console.log("ChatSelected montado - chats:", chats.length);
  }, [chats.length]);

  return (
    <div className={styles.chatContainer}>
      {idChat && (
        <div className={styles.chatHeader}>
          <h2 className={styles.chatTitle}>{chatTitle}</h2>
        </div>
      )}
      <div className={styles.chatContent}>
        <Switch>
          <Route path="/" component={NoChatSelected} />
          <Route path="/chats/:id">
            {(params) => (
              <ChatContent
                key={params.id}
                idChat={parseInt(params.id)}
                messages={messages}
                onMessages={getMessages}
                onPostMessage={postMessage}
              />
            )}
          </Route>
        </Switch>
      </div>
      <div className={styles.inputContainer}>
        <InputMessage
          onPostMessage={postMessage}
          onPostChat={onPostChat}
          onModifyChat={onModifyChat}
          messages={messages}
          onSetPendingMessage={setPendingMessage}
        />
      </div>
    </div>
  );
}