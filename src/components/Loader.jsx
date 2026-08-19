import styles from "../styles/Loader.module.css";

export default function LoaderView({
  text,
  textSize = 2,
  bg,
  border,
  radius,
  setHeight = 60,
  circleVariant = "compact",
}) {
  return (
    <div
      className={styles.loaderView}
      style={{
        backgroundColor: bg,
        border: border,
        height: `${setHeight}vh`,
        borderRadius: `${radius}rem`,
      }}
    >
      <div
        className={`${styles.loadingCircle} ${
          circleVariant === "dynamic" ? styles.dynamic : styles.compact
        }`}
      ></div>

      {text && (
        <span
          className={styles.spanText}
          style={{ fontSize: `${textSize}rem` }}
        >
          {text}
        </span>
      )}
    </div>
  );
}
