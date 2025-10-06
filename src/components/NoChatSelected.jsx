import styles from "./NoChatSelected.module.css";

export default function NoChatSelected() {
  return (
    <div className={styles.noChatContainer}>
      <div className={styles.noChatIcon}>💬</div>
      <p className={styles.noChatMessage}>
        Selecciona una conversación para ver tus mensajes, o envía un mensaje para crear una nueva conversación
      </p>
    </div>
  );
}