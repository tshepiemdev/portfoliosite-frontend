import styles from "../styles/PricingCard.module.css";
import FeaturedBadge from "./FeaturedBadge";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTABlack from "./BtnCTABlack";
import ChecklImg from "../assets/icons/check.svg";
import starImg from "../assets/icons/logo-black.svg";
import generateServiceRequestLink from "../utils/generateServiceRequestLink";

export default function PricingCard({
  type,
  packageType,
  title,
  nowPrice,
  oldPrice,
  per,
  isFeatured,
  description,
  features,
}) {
  const ctaLink = generateServiceRequestLink(type, packageType);

  return (
    <div className={`${styles.card} ${isFeatured ? styles.featured : ""}`}>
      <div className={styles.topWrapper}>
        <h3 className={styles.title}>
          {isFeatured && (
            <img className={styles.iconImg} src={starImg} alt="" />
          )}
          {title}
        </h3>

        {isFeatured && (
          <div className={styles.badgeWrapper}>
            <FeaturedBadge text="Popular" radius={16} />
          </div>
        )}
      </div>

      <div className={styles.price}>
        {nowPrice ? (
          <>
            <span className={styles.now}>R{nowPrice}</span>

            {per && <span className={styles.per}>/{per}</span>}

            {oldPrice && <span className={styles.old}>R{oldPrice}</span>}
          </>
        ) : (
          <span className={styles.custom}>Custom Pricing</span>
        )}
      </div>

      <p className={styles.label}>Starting package price</p>

      <p className={styles.desc}>{description}</p>

      <hr className={styles.hr} />

      <ul className={styles.features}>
        {features.map((feature, index) => (
          <li className={styles.li} key={index}>
            <img className={styles.checkImg} src={ChecklImg} alt="" />
            {feature}
          </li>
        ))}
      </ul>

      <div className={styles.ctaWrapper}>
        {isFeatured ? (
          <BtnCTAWhite href={ctaLink} buttonText="Select package" fullWidth />
        ) : (
          <BtnCTABlack href={ctaLink} buttonText="Select package" fullWidth />
        )}
      </div>
    </div>
  );
}
