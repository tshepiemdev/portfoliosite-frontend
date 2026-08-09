import styles from "../styles/LoaderMax.module.css";

export default function LoaderMaxView() {
  return (
    <div className={styles.loaderMaxView}>
      <div className={styles.loadingCircle}></div>
    </div>
  );
}
