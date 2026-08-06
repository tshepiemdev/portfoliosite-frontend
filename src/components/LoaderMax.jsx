import styles from "../styles/LoaderMax.module.css";

export default function LoaderMaxView() {
  return (
    <div className={styles.loaderMaxView}>
      <div className={styles.loadingCircle}></div>

      <h4 className={styles.loaderText}>
        Hang tight, getting
        <br />
        things ready for you
      </h4>
    </div>
  );
}
