import styles from "../styles/SearchErrorView.module.css";
import ErrorImg from "../assets/icons/not-found-alt.svg";
import BtnHyperLink from "./BtnHyperLink";

export default function SearchErrorView({
  icon,
  header,
  subText,
  bg,
  border,
  showAssist = false,
}) {
  return (
    <div
      className={styles.errorView}
      style={{ backgroundColor: bg, border: border }}
    >
      <div className={styles.errorImgWrapper}>
        <img className={styles.errorImg} src={icon || ErrorImg} alt="error" />
      </div>

      <h2 className={styles.errorHead}>{header}</h2>
      <p className={styles.errorSubtext}>{subText}</p>

      {showAssist && (
        <BtnHyperLink
          text={"Need more help?"}
          linkText={"Get in touch"}
          href={"/contact?reason=support"}
        />
      )}
    </div>
  );
}
