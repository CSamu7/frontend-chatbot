import styles from "./Header.module.css";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} className={styles.logoImg}></img>
        <p className={styles.logoText}>SamuBot</p>
      </div>
      <nav className={styles.menu}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <a href="" className={styles.menuLink}>
              Registrarse
            </a>
          </li>
          <li className={styles.menuItem}>
            <a href="" className={styles.menuLink}>
              Iniciar sesión
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
