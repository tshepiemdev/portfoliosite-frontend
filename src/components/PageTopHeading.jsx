import styles from "../styles/PageTopHeading.module.css";

export default function PageTopHeading({
  icon,
  title,
  miniTitle,
  titleWidth = "fit-content",
  subtext,
  textAlign = "start",
  centerContent = "start",
}) {
  return (
    <div className={styles.wrapper} style={{ alignItems: centerContent }}>
      {icon && (
        <div className={styles.iconWrapper}>
          <img className={styles.icon} src={icon} alt={title} />
        </div>
      )}

      {title && (
        <h1
          className={styles.title}
          style={{ width: titleWidth, textAlign: textAlign }}
        >
          {title}
        </h1>
      )}

      {miniTitle && (
        <h2
          className={styles.miniTitle}
          style={{ width: titleWidth, textAlign: textAlign }}
        >
          {miniTitle}
        </h2>
      )}

      {subtext && (
        <p className={styles.subtext} style={{ textAlign: textAlign }}>
          {subtext}
        </p>
      )}
    </div>
  );
}
