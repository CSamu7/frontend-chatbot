import { useState, useContext } from "react";
import useUser from "../hooks/useUser";
import styles from "./LoginModal.module.css";
import { Link, useLocation } from "wouter";
import { ErrorContext } from "../context/ErrorContext";

export default function LoginModal({ closeModal }) {
  const { login } = useUser();
  const [error, setError] = useContext(ErrorContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, navigate] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      closeModal();
    } catch (error) {
      setError(error.error || "Error al iniciar sesión");
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
            <label htmlFor="email">Correo electronico</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <a href="/signup">¿No estas registrado?</a>
          {error && <p>{error}</p>}
          <input type="submit" value="Iniciar sesión" />
        </form>
      </div>
    </div>
  );
}
