import styles from "../styles/Tooltip.module.css";

export default function Tooltip({ tooltipText, className }) {
  return (
    <span className={`${styles.tooltip} ${className || ""}`}>
      {tooltipText}
    </span>
  );
}
