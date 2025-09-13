import styles from "./ActualChat.module.css";
import send_img from "../assets/chatbot_send_icon.png";

export default function ActualChat() {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chat}></div>
      <div className={styles.formAsk}>
        <textarea type="text" className={styles.formInput} />
        <img src={send_img} alt="" className={styles.sendMsg} />
      </div>
    </div>
  );
}
