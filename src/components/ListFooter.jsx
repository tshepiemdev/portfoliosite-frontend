import styles from "../styles/ListFooter.module.css";
import StarImg from "../assets/icons/objects-column (1).svg";

export default function ListFooter({ text, icon }) {
  return (
    <p className={styles.label}>
      <img className={styles.icon} src={icon || StarImg} alt={text} /> {text}
    </p>
  );
}
