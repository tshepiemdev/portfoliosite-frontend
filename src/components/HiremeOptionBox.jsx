import styles from "../styles/HiremeOptionBox.module.css";
import { Link } from "react-router-dom";
import starImg from "../assets/icons/logo-black.svg";
import FeaturedBadge from "./FeaturedBadge";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import BtnCTABlackSmall from "./BtnCTABlackSmall";
import nextImg from "../assets/icons/arrow-small-right.svg";
import bigFallbackImg from "../assets/images/fallback_img_16_9.svg";

export default function HiremeOptionBox({
  icon,
  name,
  description,
  bg,
  color,
  optionCTAText,
  optionCTALink,
  isFeatured = false,
  isPopular = false,
  options = [],
}) {
  return (
    <div
      className={`${styles.hiremeBox} ${isPopular ? styles.popular : ""}`}
      style={{ backgroundColor: bg }}
    >
      {/* {isFeatured && <FeaturedBadge text="Popular" bgColor={"#ff9604"}/>} */}

      {icon && (
        <div className={styles.optionIconWrapper}>
          <img
            className={styles.optionIcon}
            src={icon || starImg}
            alt={name}
            loading="lazy"
          />
        </div>
      )}

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
          {isFeatured && (
            <BtnCTAWhiteSmall href={optionCTALink} buttonText={optionCTAText} />
          )}
          {!isFeatured && (
            <BtnCTABlackSmall href={optionCTALink} buttonText={optionCTAText} />
          )}
        </div>
      )}
    </div>
  );
}
