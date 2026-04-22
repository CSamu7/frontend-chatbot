import ChatsHistory from "../components/ChatsHistory";
import ChatSelected from "../components/ChatSelected";
import { useContext, useEffect, useState } from "react";
import styles from "./ChatBotPage.module.css";
import LoginModal from "../components/LoginModal";
import NavMenu from "../components/NavMenu";
import { useUserContext } from "../context/UserContext";
import useAuth from "../hooks/useAuth";
import useChat from "../hooks/useChat";
import Header from "../components/Header";
import ErrorPopup from "../components/ErrorPopup";
import { ErrorContext } from "../context/ErrorContext";

export default function ChatBotPage() {
  const [isLoginModalActive, setIsLoginModalActive] = useState(false);
  const { user, logout } = useUserContext();
  const { setCsrf } = useAuth();
  const [error, setError] = useContext(ErrorContext);
  const { chats, deleteChat, postChat, modifyChat } = useChat(user);

  useEffect(() => {
    setCsrf();
  }, [setCsrf]);

  return (
    <div className={styles.app}>
      <Header>
        <NavMenu
          onLogin={() => setIsLoginModalActive(true)}
          onLogout={logout}
          user={user}
        />
      </Header>
      <ChatsHistory 
        user={user}
        chats={chats}
        onDeleteChat={deleteChat}
        onPostChat={postChat}
        onModifyChat={modifyChat}
      />
      <ChatSelected 
        chats={chats}
        onPostChat={postChat}
        onModifyChat={modifyChat}
      />
      {isLoginModalActive && (
        <LoginModal closeModal={() => setIsLoginModalActive(false)} />
      )}
      <ErrorPopup errorMsg={error} />
    </div>
  );
}