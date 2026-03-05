import { useRef, useState } from "react";
import Header from "../components/Header";
import useUser from "../hooks/useUser";
import styles from "./SignUp.module.css";
import { navigate } from "wouter/use-hash-location";

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
      newErrors.push("El correo no es válido");
    }

    if (password === "" || confirmedPassword === "") {
      newErrors.push("La contraseña está vacía");
    }

    if (password !== confirmedPassword) {
      newErrors.push("Las contraseñas no coinciden");
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
      navigate("/home/");
    } catch (error) {
      setFormError(error.email);
    }
  };

  return (
    <div className={styles.app}>
      <Header></Header>
      <div className={styles.formContainer}>
        <form ref={form} onSubmit={handleRegisterUser}>
          <h2>Registro</h2>
          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              autoComplete="off"
              name="email"
              id="email"
              required
            />
          </div>
          <div>
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" name="username" id="username" required />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" id="password" required />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              required
            />
          </div>
          {formError.length > 0 && (
            <div className={styles.error}>
              {formError.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <input type="submit" value="Registrarse" />
        </form>
      </div>
    </div>
  );
}
