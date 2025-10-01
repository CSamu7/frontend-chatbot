import { Link, useLocation } from "wouter";
import styles from "./ChatItem.module.css";
import useChat from "../hooks/useChat";

export default function ChatItem({ title, date, id }) {
  const formatedDate = new Date(date);
  const [location, navigate] = useLocation();
  const { deleteChat } = useChat();

  const handleDeleteChat = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    await deleteChat(id);

    if (location.includes(id)) navigate("");
  };

  return (
    <Link className={styles.chatItem} href={`/chats/${id}`}>
      <div className={styles.chatData}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.date}>{formatedDate.toLocaleDateString()}</p>
      </div>
      <button onClick={handleDeleteChat} className={styles.btnDelete}>
        X
      </button>
    </Link>
  );
}
