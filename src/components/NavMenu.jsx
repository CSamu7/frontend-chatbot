import { useLocation } from "wouter";
import styles from "./NavMenu.module.css";
import ConfirmDialog from "./ConfirmDialog";

export default function NavMenu({ onLogin, onLogout, user }) {
  const [_, navigate] = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "¿Estás seguro de que quieres cerrar sesión?"
    );
    
    if (confirmLogout) {
      await onLogout();
      navigate("/");
    }
  };

  return (
    <>
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
                onClick={openConfirm}
              >
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>
      </nav>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}