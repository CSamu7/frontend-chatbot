import styles from "./Logo.module.css";
import logo from "../assets/logo.png";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src={logo} className={styles.logoImg} alt="Logo de SamuBot"></img>
      <a href="/" className={styles.logoText}>
        BookBot
      </a>
    </div>
  );
}
