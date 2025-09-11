import styles from "./ActualChat.module.css";

export default function ActualChat() {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chat}></div>
      <div className={styles.formAsk}>
        <input type="text" className={styles.formInput} />
      </div>
    </div>
  );
}
