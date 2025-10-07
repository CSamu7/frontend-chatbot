import ChatsHistory from "../components/ChatsHistory";
import ChatSelected from "../components/ChatSelected";
import { useEffect, useState } from "react";
import styles from "./ChatBotPage.module.css";
import LoginModal from "../components/LoginModal";
import NavMenu from "../components/NavMenu";
import useUser from "../hooks/useUser";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import useChat from "../hooks/useChat";

export default function ChatBotPage() {
  const [isLoginModalActive, setIsLoganModalActive] = useState(false);
  const { user, logout } = useUser();
  const { setCsrf } = useAuth();
  const { chats, deleteChat, postChat } = useChat(user);

  useEffect(() => {
    setCsrf();
  }, []);

  return (
    <div className={styles.app}>
      <Header>
        <NavMenu
          onLogin={() => setIsLoganModalActive(true)}
          onLogout={logout}
          user={user}
        ></NavMenu>
      </Header>

      <ChatsHistory
        chats={chats}
        onDeleteChat={deleteChat}
        onPostChat={postChat}
      ></ChatsHistory>
      <ChatSelected onPostChat={postChat}></ChatSelected>
      {isLoginModalActive && (
        <LoginModal
          closeModal={() => setIsLoganModalActive(false)}
        ></LoginModal>
      )}
    </div>
  );
}
