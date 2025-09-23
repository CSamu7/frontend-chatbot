import styles from "./ChatItem.module.css";

export default function ChatItem({ title, date }) {
  const formatedDate = new Date(date);

  return (
    <div className={styles.chatItem}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.date}>{formatedDate.toDateString()}</p>
    </div>
  );
}
