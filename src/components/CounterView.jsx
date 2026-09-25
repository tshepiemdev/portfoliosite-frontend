import styles from "../styles/CounterView.module.css";
import eyeImg from "../assets/icons/eye.svg";
import formatCount from "../utils/formatCount";

export default function  CounterView({ count = 0, text = "" }) {
  const safeText = text?.trim() || "Counter item";

  return (
    <div className={styles.countWrapper} title={`${count} • ${safeText}`}>
      <img
        className={styles.iconImg}
        src={eyeImg}
        alt={`${count} • ${safeText}`}
      />
      <p className={styles.count}>{formatCount(count)}</p>
      <p className={styles.text}>{safeText && `• ${safeText}`}</p>
    </div>
  );
}
