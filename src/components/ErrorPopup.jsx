import { useRef, useEffect, useContext } from "react";
import styles from "./ErrorPopup.module.css";
import { ErrorContext } from "../context/ErrorContext";

export default function ErrorPopup() {
  const ref = useRef();
  const [errorMsg, setError] = useContext(ErrorContext);

  useEffect(() => {
    if (ref.current) {
      if (errorMsg) {
        ref.current.showModal();
      } else {
        ref.current.close();
      }
    }
  }, [errorMsg]);

  const handleCloseModal = () => {
    setError("");
  };

  return (
    <dialog ref={ref} className={styles.dialog}>
      <div className={styles.header}>
        <h2 className={styles.title}>Error</h2>
        <button className={styles.closeBtn} onClick={handleCloseModal}>
          ✕
        </button>
      </div>
      <p className={styles.message}>{errorMsg}</p>
    </dialog>
  );
}