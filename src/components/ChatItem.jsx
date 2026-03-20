import { Link, useLocation } from "wouter";
import styles from "./ChatItem.module.css";
import ConfirmDialog from "./ConfirmDialog";

export default function ChatItem({ title, date, id, onDeleteChat }) {
  const formatedDate = new Date(date);
  const [location, navigate] = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteChat = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el chat "${title}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      await onDeleteChat(id);
      if (location.includes(id)) navigate("");
    }
  };

  return (
    <>
      <Link className={styles.chatItem} href={`/chats/${id}`}>
        <div className={styles.chatData}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.date}>{formatedDate.toLocaleDateString()}</p>
        </div>
        <button onClick={openConfirm} className={styles.btnDelete}>
          X
        </button>
      </Link>
      
      <ConfirmDialog
        isOpen={showConfirm}
        title="Eliminar conversación"
        message={`¿Estás seguro de que quieres eliminar el chat "${title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteChat}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}