import ChatsHistory from "../components/ChatsHistory";
import ChatSelected from "../components/ChatSelected";
import { useEffect, useState } from "react";
import styles from "./ChatBotPage.module.css";
import LoginModal from "../components/LoginModal";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
import useUser from "../hooks/useUser";
import useAuth from "../hooks/useAuth";

export default function ChatBotPage() {
  const [isLoginModalActive, setIsLoganModalActive] = useState(false);
  const { user, logout } = useUser();
  const [activeChat, setActiveChat] = useState(null);
  const { setCsrf } = useAuth();

  useEffect(() => {
    setCsrf();
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Logo></Logo>
        <NavMenu
          onLogin={() => setIsLoganModalActive(true)}
          onLogout={logout}
          user={user}
        ></NavMenu>
      </header>
      <ChatsHistory user={user}></ChatsHistory>
      <ChatSelected></ChatSelected>
      {isLoginModalActive && (
        <LoginModal
          closeModal={() => setIsLoganModalActive(false)}
        ></LoginModal>
      )}
    </div>
  );
}
