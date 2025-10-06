import { useState } from "react";
import Header from "../components/Header";
import useUser from "../hooks/useUser";
import styles from "./SignUp.module.css";

export default function SignUp() {
  const { registerUser } = useUser();
  const [formError, setFormError] = useState([]);

  const handleRegisterUser = (e) => {
    e.preventDefault();

    const password = e.target.password.value;
    const confirmPassword = e.target["confirm-password"].value;

    if (password !== confirmPassword) {
      setFormError(["La contraseña debe que coincidir"]);
    }

    const user = {
      email: e.target.email.value,
      username: e.target.username.value,
      password,
    };

    console.log();
  };

  return (
    <div className={styles.app}>
      <Header></Header>
      <form onSubmit={handleRegisterUser}>
        <h2>Registro</h2>
        <div>
          <label>Correo</label>
          <input type="email" required name="email"></input>
        </div>
        <div>
          <label>Nombre de usuario</label>
          <input type="text" name="username"></input>
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" name="password"></input>
        </div>
        <div>
          <label>Repetir contraseña</label>
          <input type="password" name="confirm-password"></input>
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
