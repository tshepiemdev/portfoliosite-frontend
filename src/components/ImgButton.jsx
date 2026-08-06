import styles from "../styles/ImgButton.module.css";

export default function ImgButton({
  buttonImgSrc,
  altText,
  onClick,
  className = "",
  setPadding = 0,
  setMarginLeft = 0,
}) {
  return (
    <button
      className={`${styles.imgButton} ${className}`}
      onClick={onClick}
      style={{ padding: setPadding, marginLeft: setMarginLeft}}
    >
      <img className={styles.imgIcon} src={buttonImgSrc} alt={altText} />
    </button>
  );
}
