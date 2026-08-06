import styles from "../styles/BlogPageTopTitles.module.css";

export default function BlogPageTopTitlesView({
  category,
  name,
  buttonText,
  linkTo,
}) {
  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className={styles.titlesWrapper}>
      <div className={styles.rowWrapper}>
        <p className={styles.type}>Blog / </p>
        <p className={styles.category}>{capitalizeFirstLetter(category)}</p>
      </div>

      <h1 className={styles.name}>{name}</h1>
    </div>
  );
}
