import { useRef } from "react";
import styles from "./ErrorPopup.module.css";
import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

export default function ErrorPopup({ errorMsg }) {
  const ref = useRef();
  const [_, setError] = useContext(ErrorContext);

  const handleCloseModal = () => {
    setError("");
  };

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${errorMsg === "" && styles.invisible}`}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Error</h2>
        <button className={styles.closeBtn} onClick={handleCloseModal}>
          x
        </button>
      </div>
      <p className={styles.message}>{errorMsg}</p>
    </dialog>
  );
}
