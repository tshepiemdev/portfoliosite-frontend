import styles from "../styles/LegalBox.module.css";
import { Link } from "react-router-dom";
import fileIcon from "../assets/icons/folder.svg";
import nextIcon from "../assets/icons/arrow-up-right.svg";

export default function LegalBox({ name, legalFor, link }) {
  return (
    <Link to={link} className={styles.legalBoxLink}>
      <img className={styles.folderIcon} src={fileIcon} alt={name} />

      <div className={styles.metaWrapper}>
        <h2 className={styles.title}>{name}</h2>
        <p className={styles.for}>
          Documentaion for {legalFor}{" "}
          <img className={styles.nextIcon} src={nextIcon} alt="next" />
        </p>
      </div>
    </Link>
  );
}
