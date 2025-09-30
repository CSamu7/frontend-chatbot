import ChatsHistory from "../components/ChatsHistory";
import ChatSelected from "../components/ChatSelected";
import { useState } from "react";
import styles from "./ChatBotPage.module.css";
import LoginModal from "../components/LoginModal";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
import useUser from "../hooks/useUser";
import { Route, Switch } from "wouter";

export default function ChatBotPage() {
  const [isLoginModalActive, setIsLoganModalActive] = useState(false);
  const { user } = useUser();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Logo></Logo>
        <NavMenu
          onLogin={() => setIsLoganModalActive(true)}
          user={user}
        ></NavMenu>
      </header>
      <ChatsHistory user={user}></ChatsHistory>
      <ChatSelected></ChatSelected>
      {isLoginModalActive && (
        <LoginModal
          isActive={isLoginModalActive}
          closeModal={() => setIsLoganModalActive(false)}
        ></LoginModal>
      )}
    </div>
  );
}
