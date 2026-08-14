import styles from "../styles/ListFooter.module.css";

export default function ListFooter({ text, icon }) {
  return <p className={styles.label}>{text}</p>;
}
