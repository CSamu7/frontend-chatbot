import { useLocation } from "wouter";
import styles from "./NavMenu.module.css";

export default function NavMenu({ onLogin, onLogout, user }) {
  const [_, navigate] = useLocation();

  return (
    <nav className={styles.menu}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          {user ? (
            <p className={styles.username}>{user.username}</p>
          ) : (
            <button className={styles.menuLink} onClick={onLogin}>
              Iniciar sesión
            </button>
          )}
        </li>
        {user && (
          <li>
            <button
              onClick={async () => {
                await onLogout();
                navigate("/");
              }}
            >
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
