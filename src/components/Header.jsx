import styles from "./Header.module.css";
import Logo from "./Logo";

export default function Header({ children }) {
  return (
    <header className={styles.header}>
      <Logo></Logo>
      {children}
    </header>
  );
}
