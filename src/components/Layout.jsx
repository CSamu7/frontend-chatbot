import Header from "../components/Header";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Header></Header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
