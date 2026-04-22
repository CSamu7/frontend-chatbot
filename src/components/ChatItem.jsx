import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import styles from "./ChatItem.module.css";

export default function ChatItem({ title, date, id, onDeleteChat, onModifyChat }) {
  const formatedDate = new Date(date);
  const [location, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDeleteChat = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el chat "${title}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmDelete) {
      await onDeleteChat(id);
      if (location === `/chats/${id}`) {
        navigate("/");
      }
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
    setEditedTitle(title);
  };

  const handleSaveTitle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newTitle = editedTitle.trim();
    if (newTitle && newTitle !== title) {
      await onModifyChat(id, newTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle(e);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  return (
    <Link className={styles.chatItem} href={`/chats/${id}`}>
      <div className={styles.chatData}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className={styles.titleInput}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className={styles.title}>{title}</h3>
        )}
        <p className={styles.date}>{formatedDate.toLocaleDateString()}</p>
      </div>
      <div className={styles.actions}>
        {!isEditing && (
          <button 
            onClick={handleEditClick} 
            className={styles.btnEdit}
            title="Renombrar chat"
          >
            ✏️
          </button>
        )}
        <button 
          onClick={handleDeleteChat} 
          className={styles.btnDelete}
          title="Eliminar chat"
        >
          X
        </button>
      </div>
    </Link>
  );
}