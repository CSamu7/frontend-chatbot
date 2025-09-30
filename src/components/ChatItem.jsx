import { Link } from "wouter";
import styles from "./ChatItem.module.css";

export default function ChatItem({ title, date, id }) {
  const formatedDate = new Date(date);

  return (
    <Link className={styles.chatItem} href={`/chats/${id}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.date}>{formatedDate.toLocaleDateString()}</p>
    </Link>
  );
}
