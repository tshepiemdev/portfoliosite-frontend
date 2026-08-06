import styles from "../styles/CounterView.module.css";
import smallFallbackImg from "../assets/images/fallback_img_16_9.svg";
import eyeImg from "../assets/icons/eye.svg";

export default function CounterView({ count = 0, text = "" }) {
  const safeText = text?.trim() || "Counter item";

  const formatCount = (value) => {
    if (typeof value !== "number") return value;

    if (value >= 1_000_000_000) {
      return (
        (value / 1_000_000_000)
          .toFixed(value % 1_000_000_000 === 0 ? 0 : 1)
          .replace(".0", "") + "B"
      );
    }

    if (value >= 1_000_000) {
      return (
        (value / 1_000_000)
          .toFixed(value % 1_000_000 === 0 ? 0 : 1)
          .replace(".0", "") + "M"
      );
    }

    if (value >= 1_000) {
      return (
        (value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1).replace(".0", "") +
        "K"
      );
    }

    return value.toLocaleString();
  };

  return (
    <div className={styles.countWrapper} title={`${count} • ${safeText}`}>
      <img className={styles.iconImg} src={ eyeImg} alt={`${count} • ${safeText}`} />
      <p className={styles.count}>{formatCount(count)}</p>
      <p className={styles.text}>{safeText && `• ${safeText}`}</p>
    </div>
  );
}
