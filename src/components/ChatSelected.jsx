import { useEffect } from "react";
import styles from "./ChatSelected.module.css";
import ChatContent from "./ChatContent";
import InputMessage from "./InputMessage";
import NoChatSelected from "./NoChatSelected";
import { Route, Switch } from "wouter";
import useMessage from "../hooks/useMessage";

export default function ChatSelected({ onPostChat, onModifyChat }) {
  const { messages, getMessages, postMessage } = useMessage();

  useEffect(() => {
    console.log("ChatSelected montado - onPostChat:", !!onPostChat, "onModifyChat:", !!onModifyChat);
  }, [onPostChat, onModifyChat]);

  return (
    <div className={styles.chatContainer}>
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
        />
      </div>
    </div>
  );
}