import styles from "../styles/Qualification.module.css";

export default function QualificationBox({
  type,
  name,
  institute,
  year,
  positionNumber,
}) {
  return (
    <div className={styles.qualificationBox}>
      <div className={styles.qualificationBoxMeta}>
        <h2 className={styles.type}>{type}</h2>

        <h1 className={styles.name}>{name}</h1>
        <div className={styles.wrapper}>
          <p className={styles.institute}>{institute}</p>
        </div>
      </div>
      <p className={styles.year}>{year}</p>
    </div>
  );
}
