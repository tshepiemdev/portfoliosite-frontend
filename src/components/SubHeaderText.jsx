import styles from "../styles/SubHeaderText.module.css";

export default function SubHeaderText({ subHeadingText }) {
  return <p className={styles.subHeaderText}>{subHeadingText}</p>;
}
