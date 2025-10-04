import { useState } from "react";
import useUser from "../hooks/useUser";
import styles from "./LoginModal.module.css";

export default function LoginModal({ closeModal }) {
  const { login } = useUser();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password);
      closeModal();
    } catch (error) {
      setError(error.error);
    }
  };

  return (
    <div className={styles.modal} onClick={closeModal}>
      <div
        className={styles.modalContent}
        onClick={async (e) => {
          e.stopPropagation();
        }}
      >
        <h2>Inicia sesión</h2>
        <form id="form" onSubmit={handleSubmit}>
          <div>
            <label>Correo electronico</label>
            <input type="email" name="email" required />
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" name="password" required />
          </div>
          <a>¿No estas registrado?</a>
          {error && <p>{error}</p>}
          <input type="submit" value="Iniciar sesión" />
        </form>
      </div>
    </div>
  );
}
