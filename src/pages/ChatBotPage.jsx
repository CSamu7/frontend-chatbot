// src/pages/ChatBotPage.jsx
import ChatsHistory from "../components/ChatsHistory";
import ChatSelected from "../components/ChatSelected";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
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
  const { postChat, modifyChat } = useChat(user);
  const [location] = useLocation();

  console.log("ChatBotPage - location:", location, "user:", !!user);

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
      <ChatsHistory user={user} />
      <ChatSelected 
        key={location}
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