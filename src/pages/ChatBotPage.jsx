import ChatsHistory from "../components/ChatsHistory";
import ActualChat from "../components/ActualChat";
import { useState } from "react";
import styles from "./ChatBotPage.module.css";
import LoginModal from "../components/LoginModal";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";

export default function ChatBotPage() {
  const [isLoginModalActive, setIsLoginModalActive] = useState(false);

  const handleLoginModal = () => setIsLoginModalActive(true);
  const closeLoginModal = () => setIsLoginModalActive(false);

  return (
    <>
      <header className={styles.header}>
        <Logo></Logo>
        <NavMenu onLogin={handleLoginModal}></NavMenu>
      </header>
      <ChatsHistory></ChatsHistory>
      <ActualChat></ActualChat>
      <LoginModal 
        isActive={isLoginModalActive} 
        onClose={closeLoginModal}
      ></LoginModal>
    </>
  );
}