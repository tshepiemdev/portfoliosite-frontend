import styles from "../styles/RequestServiceOptionBox.module.css";
import { Link } from "react-router-dom";
import starImg from "../assets/icons/logo-black.svg";
import FeaturedBadge from "./FeaturedBadge";
import BtnCTAWhite from "./BtnCTAWhite";
import nextImg from "../assets/icons/arrow-small-right.svg";

export default function RequestServiceOptionBox({
  name,
  description,
  bg,
  color,
  optionCTAText,
  optionCTALink,
  isFeatured = false,
  options = [],
}) {
  return (
    <div
      className={styles.requestServiceOptionBox}
      style={{ backgroundColor: bg }}
    >
      {isFeatured && <FeaturedBadge text="Popular" />}

      <h2 className={styles.bentoName} style={{ color: color }}>
        {name}
      </h2>

      {description && <p className={styles.description}>{description}</p>}

      {options.length > 0 && (
        <div className={styles.optionsList}>
          {options.map((opt, i) => (
            <Link
              key={i}
              to={opt.url}
              className={styles.optionItem}
              target="_blank"
            >
              <img className={styles.optionImg} src={opt.icon} alt={opt.name} />
              <span>{opt.name}</span>
            </Link>
          ))}
        </div>
      )}

      {optionCTALink && (
        <div className={styles.controlWrapper}>
          <BtnCTAWhite href={optionCTALink} buttonText={optionCTAText} />
        </div>
      )}
    </div>
  );
}
