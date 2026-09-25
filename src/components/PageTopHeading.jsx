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
  titleLevel = 1,
  miniTitleLevel = 2,
}) {
  const TitleTag = `h${titleLevel}`;
  const MiniTitleTag = `h${miniTitleLevel}`;

  return (
    <div className={styles.wrapper} style={{ alignItems: centerContent }}>
      {showNav && <PageNavigationBar />}

      {icon && (
        <div className={styles.iconWrapper}>
          <img className={styles.icon} src={icon} alt="" />
        </div>
      )}

      {title && (
        <TitleTag
          className={styles.title}
          style={{
            width: titleWidth,
            textAlign,
            ...(titleSize !== undefined && { fontSize: `${titleSize}rem` }),
          }}
        >
          {title}
        </TitleTag>
      )}

      {miniTitle && (
        <MiniTitleTag
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
        </MiniTitleTag>
      )}

      {subtext && (
        <p className={styles.subtext} style={{ textAlign }}>
          {subtext}
        </p>
      )}
    </div>
  );
}
