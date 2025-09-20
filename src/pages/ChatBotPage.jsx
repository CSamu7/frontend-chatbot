import ChatsHistory from "../components/ChatsHistory";
import ActualChat from "../components/ActualChat";
import { useState } from "react";
import styles from "./ChatBotPage.module.css";
import LoginModal from "../components/LoginModal";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
import useUser from "../hooks/useUser";

export default function ChatBotPage() {
  const [isLoginModalActive, setIsLoganModalActive] = useState(false);
  const { user } = useUser();

  console.log(user);

  return (
    <>
      <header className={styles.header}>
        <Logo></Logo>
        <NavMenu
          onLogin={() => setIsLoganModalActive(true)}
          user={user}
        ></NavMenu>
      </header>
      <ChatsHistory></ChatsHistory>
      <ActualChat></ActualChat>
      {isLoginModalActive && (
        <LoginModal
          isActive={isLoginModalActive}
          closeModal={() => setIsLoganModalActive(false)}
        ></LoginModal>
      )}
    </>
  );
}
