import { useRef, useState } from "react";
import Header from "../components/Header";
import useUser from "../hooks/useUser";
import styles from "./SignUp.module.css";

export default function SignUp() {
  const { registerUser } = useUser();
  const [formError, setFormError] = useState([]);
  const form = useRef();

  const validateForm = (form) => {
    const email = form.get("email");
    const password = form.get("password");
    const confirmedPassword = form.get("confirm-password");

    const newErrors = [];

    if (!email.includes("@")) {
      newErrors.push("El correo no es valido");
    }

    if (password === "" || confirmedPassword === "") {
      newErrors.push("La contraseña esta vacia");
    }

    if (password !== confirmedPassword) {
      newErrors.push("La contraseña no coincide");
    }

    return newErrors;
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setFormError([]);

    const formData = new FormData(form.current);
    const errors = validateForm(formData);

    if (errors.length > 0) {
      setFormError(errors);
      return;
    }

    const user = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      await registerUser(user);
    } catch (error) {}
  };

  return (
    <div className={styles.app}>
      <Header></Header>
      <form ref={form} onSubmit={handleRegisterUser}>
        <h2>Registro</h2>
        <div>
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            autoComplete="off"
            name="email"
            id="email"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="username">Nombre de usuario</label>
          <input type="text" name="username" id="username"></input>
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input type="password" name="password" id="password"></input>
        </div>
        <div>
          <label htmlFor="confirm-password">Repetir contraseña</label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
          ></input>
        </div>
        <div>
          {formError.map((error) => (
            <p>{error}</p>
          ))}
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
