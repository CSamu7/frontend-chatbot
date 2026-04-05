import { useState, useContext } from "react";
import useUser from "../hooks/useUser";
import styles from "./LoginModal.module.css";
import { ErrorContext } from "../context/ErrorContext";

export default function LoginModal({ closeModal }) {
  const { login } = useUser();
  const [error, setError] = useState("");
  const { setError: setGlobalError } = useContext(ErrorContext) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
      await login(email, password);
      closeModal();
    } catch (error) {
      const errorMsg = error.error || "Error al iniciar sesión";
      setError(errorMsg);
      if (setGlobalError) setGlobalError(errorMsg);
    }
  };

  return (
    <div className={styles.modal} onClick={closeModal}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Inicia sesión</h2>
        <form id="form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              required
            />
          </div>
          <a href="/signup">¿No estás registrado?</a>
          {error && <p className={styles.error}>{error}</p>}
          <input type="submit" value="Iniciar sesión" />
        </form>
      </div>
    </div>
  );
}