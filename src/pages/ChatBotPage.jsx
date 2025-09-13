import ChatsHistory from "../components/ChatsHistory";
import ActualChat from "../components/ActualChat";
import { useState } from "react";
import styles from "./ChatBotPage.module.css";
import LoginModal from "../components/LoginModal";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";

export default function ChatBotPage() {
  const [isLoginModalActive, setIsLoganModalActive] = useState(false);

  const handleLoginModal = () => setIsLoganModalActive(true);

  return (
    <>
      <header className={styles.header}>
        <Logo></Logo>
        <NavMenu onLogin={handleLoginModal}></NavMenu>
      </header>
      <ChatsHistory></ChatsHistory>
      <ActualChat></ActualChat>
      {isLoginModalActive && (
        <LoginModal isActive={isLoginModalActive}></LoginModal>
      )}
    </>
  );
}
