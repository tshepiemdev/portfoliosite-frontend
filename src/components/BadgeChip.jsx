import styles from "../styles/BadgeChip.module.css";
import BadgeImg from "../assets/icons/spark.svg";

export default function BadgeChip({ badgeText }) {
  return (
    <h1 className={styles.badgeChipText}>
      <img className={styles.badgeImg} src={BadgeImg} alt={badgeText} />
      {badgeText.toUpperCase()}
    </h1>
  );
}
