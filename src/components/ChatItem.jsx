import { Link, useLocation } from "wouter";
import styles from "./ChatItem.module.css";

export default function ChatItem({ title, date, id, onDeleteChat }) {
  const formatedDate = new Date(date);
  const [location, navigate] = useLocation();

  const handleDeleteChat = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    await onDeleteChat(id);

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
