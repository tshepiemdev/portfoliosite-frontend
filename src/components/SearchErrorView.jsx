import styles from "../styles/SearchErrorView.module.css";
import ErrorImg from "../assets/icons/restrict.svg";
import BtnHyperLink from "./BtnHyperLink";

export default function SearchErrorView({ icon, header, subText, bg, border }) {
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

      <BtnHyperLink
        text={"Need more help?"}
        linkText={"Get in touch"}
        href={"/contact?reason=support"}
      />
    </div>
  );
}
