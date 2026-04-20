import { useLocation } from "wouter";
import styles from "./NavMenu.module.css";

export default function NavMenu({ onLogin, onLogout, user }) {
  const [_, navigate] = useLocation();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    
    if (confirmLogout) {
      await onLogout();
      navigate("/");
    }
  };

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
              className={styles.menuLink}
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}