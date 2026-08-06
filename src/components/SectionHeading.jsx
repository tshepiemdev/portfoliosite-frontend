import styles from "../styles/SectionHeading.module.css";
import BadgeChip from "../components/BadgeChip";

export default function SectionHeading({
  title,
  badgeText,
  titleWidth = "fit-content",
  textAlign = "start",
  centerContent = "start",
}) {
  return (
    <div className={styles.wrapper} style={{ alignItems: centerContent }}>
      {badgeText && <BadgeChip badgeText={badgeText} />}

      <h1
        className={styles.title}
        style={{ width: titleWidth, textAlign: textAlign }}
      >
        {title}
      </h1>
    </div>
  );
}
