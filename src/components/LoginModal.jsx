import useUser from "../hooks/useUser";
import styles from "./LoginModal.module.css";

export default function LoginModal({ isActive }) {
  const { user, login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    await login(email, password);
  };

  return (
    <dialog className={styles.modal} method="dialog" open={isActive}>
      <h2>Inicia sesión</h2>
      <form id="form" onSubmit={handleSubmit}>
        <div>
          <label>Correo electronico</label>
          <input type="email" name="email" />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" name="password" />
        </div>
        <a>¿No estas registrado?</a>
        <input type="submit" />
      </form>
    </dialog>
  );
}
