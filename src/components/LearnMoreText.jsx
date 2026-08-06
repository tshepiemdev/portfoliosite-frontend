import styles from "../styles/LearnMoreText.module.css";
import ArrowDownImg from "../assets/icons/arrow-down.svg";

export default function LearnMoreText({ learnMoreText }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.learnMoreText}>
        <a className={styles.learnMoreText} href="#skills">
          {learnMoreText}
        </a>
      </p>
      <img
        className={styles.arrowDownImg}
        src={ArrowDownImg}
        alt="learn more"
      />
    </div>
  );
}
