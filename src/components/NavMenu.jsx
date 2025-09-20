import styles from "./NavMenu.module.css";

export default function NavMenu({ onLogin, user }) {
  return (
    <nav className={styles.menu}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          {user ? (
            <p>{user.username}</p>
          ) : (
            <button className={styles.menuLink} onClick={onLogin}>
              Iniciar sesión
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
