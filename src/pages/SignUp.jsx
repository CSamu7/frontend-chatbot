import { useRef, useState, useContext } from "react";
import { useLocation } from "wouter";
import Header from "../components/Header";
import useUser from "../hooks/useUser";
import styles from "./SignUp.module.css";
import { ErrorContext } from "../context/ErrorContext";

export default function SignUp() {
  const { registerUser } = useUser();
  const [formError, setFormError] = useState([]);
  const form = useRef();
  const [, navigate] = useLocation();
  const [, setError] = useContext(ErrorContext);

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
      navigate("/");
    } catch (error) {
      console.error("Error en registro:", error);
      
      let errorMessage = "";
      
      if (error && typeof error === 'object') {
        if (error.email) {
          errorMessage = error.email;
          setFormError([error.email]);
        } else if (error.message) {
          errorMessage = error.message;
          setFormError([error.message]);
        } else if (error.non_field_errors) {
          errorMessage = error.non_field_errors[0];
          setFormError(error.non_field_errors);
        } else {
          errorMessage = "Error al registrar usuario. Intenta de nuevo.";
          setFormError(["Error al registrar usuario. Intenta de nuevo."]);
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
        setFormError([error]);
      } else {
        errorMessage = "Error al registrar usuario. Intenta de nuevo.";
        setFormError(["Error al registrar usuario. Intenta de nuevo."]);
      }
      
      setError(errorMessage);
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