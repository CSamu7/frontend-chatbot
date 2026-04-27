import { useRef, useState, useContext } from "react";
import { useLocation } from "wouter";
import Header from "../components/Header";
import { useUserContext } from "../context/UserContext";
import styles from "./SignUp.module.css";
import { ErrorContext } from "../context/ErrorContext";

export default function SignUp() {
  const { registerUser } = useUserContext();
  const [formError, setFormError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    const formData = new FormData(form.current);
    const errors = validateForm(formData);

    if (errors.length > 0) {
      setFormError(errors);
      setIsLoading(false);
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
        } else {
          errorMessage = "Error al registrar usuario. Intenta de nuevo.";
          setFormError(["Error al registrar usuario. Intenta de nuevo."]);
        }
      } else {
        errorMessage = "Error al registrar usuario. Intenta de nuevo.";
        setFormError(["Error al registrar usuario. Intenta de nuevo."]);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.formContainer}>
        <form ref={form} onSubmit={handleRegisterUser}>
          <h2>Registro</h2>
          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" autoComplete="off" name="email" id="email" required disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" name="username" id="username" required disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" id="password" required disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input type="password" name="confirm-password" id="confirm-password" required disabled={isLoading} />
          </div>
          {formError.length > 0 && (
            <div className={styles.error}>
              {formError.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <input type="submit" value={isLoading ? "Registrando..." : "Registrarse"} disabled={isLoading} />
          <p className={styles.loginLink}>
            ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
}