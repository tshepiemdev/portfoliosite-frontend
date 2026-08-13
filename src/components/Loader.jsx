import styles from "../styles/Loader.module.css";

export default function LoaderView({
  text,
  bg,
  border,
  radius,
  setHeight = 60,
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
      <div className={styles.loadingCircle}></div>

      {text && <span className={styles.spanText}>{text}</span>}
    </div>
  );
}
