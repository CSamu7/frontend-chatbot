import useUser from "../hooks/useUser";
import styles from "./LoginModal.module.css";

export default function LoginModal({ closeModal, isActive }) {
  const { error, login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    await login(email, password);
    //<<< Mostrar mensaje de inicio de sesión aceptado >>>
    if (error === "") {
      closeModal();
    }
    //<<< Si hubo un error, entonces mostrarlo en pantalla >>>
  };

  if (!isActive) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
