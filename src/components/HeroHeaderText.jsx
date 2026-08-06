import styles from "../styles/HeroHeaderText.module.css";
import WriteImg from "../assets/icons/terminal (1).svg";
import EngineerImg from "../assets/icons/objects-column (1).svg";

export default function HeroHeaderText() {
  return (
    <h1 className={styles.heroHeadingText}>
      Simply I don't just <br />
      write code
      <span className={styles.spanImgBg}>
        <div className={styles.wrapper}>
          <img className={styles.spanImg} src={WriteImg} alt="" />
        </div>
      </span>
      . I build <br />
      efficient solutions
      <span className={styles.spanImgBg}>
        <div className={styles.wrapper}>
          <img className={styles.spanImg} src={EngineerImg} alt="" />
        </div>
      </span>
    </h1>
  );
}
