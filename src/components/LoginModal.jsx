import { useState, useContext } from "react";
import { useUserContext } from "../context/UserContext";
import styles from "./LoginModal.module.css";
import { ErrorContext } from "../context/ErrorContext";

export default function LoginModal({ closeModal }) {
  const { login } = useUserContext();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setError: setGlobalError } = useContext(ErrorContext) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
      await login(email, password);
      closeModal();
    } catch (error) {
      const errorMsg = "Correo o contraseña incorrectos. Revisa tus datos y vuelve a intentar.";
      setError(errorMsg);
      if (setGlobalError) setGlobalError(errorMsg);
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              disabled={isLoading}
            />
          </div>
          <a href="/signup">¿No estás registrado?</a>
          {error && (
            <div className={styles.errorBanner}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}
          <input 
            type="submit" 
            value={isLoading ? "Verificando..." : "Iniciar sesión"} 
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}