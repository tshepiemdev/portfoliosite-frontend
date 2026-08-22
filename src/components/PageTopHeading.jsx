import styles from "../styles/PageTopHeading.module.css";
import PageNavigationBar from "../components/PageNavigationBar";

export default function PageTopHeading({
  icon,
  title,
  titleSize,
  miniTitle,
  miniTitleSize,
  titleWidth = "fit-content",
  subtext,
  textAlign = "start",
  centerContent = "start",
  showNav = false,
}) {
  return (
    <div className={styles.wrapper} style={{ alignItems: centerContent }}>
      {showNav && <PageNavigationBar />}

      {icon && (
        <div className={styles.iconWrapper}>
          <img className={styles.icon} src={icon} alt={title} />
        </div>
      )}

      {title && (
        <h1
          className={styles.title}
          style={{
            width: titleWidth,
            textAlign,
            ...(titleSize !== undefined && { fontSize: `${titleSize}rem` }),
          }}
        >
          {title}
        </h1>
      )}

      {miniTitle && (
        <h2
          className={styles.miniTitle}
          style={{
            width: titleWidth,
            textAlign,
            ...(miniTitleSize !== undefined && {
              fontSize: `${miniTitleSize}rem`,
            }),
          }}
        >
          {miniTitle}
        </h2>
      )}

      {subtext && (
        <p className={styles.subtext} style={{ textAlign }}>
          {subtext}
        </p>
      )}
    </div>
  );
}
