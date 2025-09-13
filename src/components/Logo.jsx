import styles from "./Logo.module.css";
import logo from "../assets/logo.png";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src={logo} className={styles.logoImg}></img>
      <p className={styles.logoText}>SamuBot</p>
    </div>
  );
}
