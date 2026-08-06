import styles from "../styles/ServiceBox.module.css";
import { Link } from "react-router-dom";
import FeaturedBadge from "./FeaturedBadge";
import ArrowImg from "../assets/icons/arrow-up-right.svg";

export default function ServiceBox({
  position,
  name,
  serviceLink,
  isFeatured = false,
  variant = "compact",
}) {
  return (
    <Link
      to={serviceLink || "/"}
      className={`${styles.serviceBoxLink} ${
        isFeatured === true ? styles.featured : styles.compact
      }`}
    >
      <div className={styles.wrapper}>
        {isFeatured && (
          <FeaturedBadge
            text={"New"}
            bg={"none"}
            bgColor={"white"}
            textColor={"black"}
            setInvertToImage={"invert(1)"}
          />
        )}
        <h2 className={styles.serviceName}>{name}</h2>
      </div>

      <img className={styles.nextImg} src={ArrowImg} alt={name} />
    </Link>
  );
}
