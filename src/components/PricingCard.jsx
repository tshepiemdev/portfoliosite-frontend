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
            <span className={styles.now}>
              <data value={nowPrice}>R{nowPrice}</data>
            </span>

            {per && <span className={styles.per}>/{per}</span>}

            {oldPrice && (
              <span className={styles.old}>
                <data value={oldPrice}>R{oldPrice}</data>
              </span>
            )}
          </>
        ) : (
          <span className={styles.custom}>Custom Pricing</span>
        )}
      </div>

      <p className={styles.label} data-nosnippet>
        Starting package price
      </p>

      <p className={styles.desc}>{description}</p>

      <div className={styles.ctaWrapper}>
        {isFeatured ? (
          <BtnCTAWhite href={ctaLink} buttonText="Select package" fullWidth />
        ) : (
          <BtnCTABlack href={ctaLink} buttonText="Select package" fullWidth />
        )}
      </div>

      <hr className={styles.hr} />

      <span className={styles.featuresLabel}>
        {type === "tutoring"
          ? packageType === "Starter"
            ? "Session includes"
            : packageType === "Business"
              ? "Monthly support includes"
              : "Support includes"
          : packageType === "Starter"
            ? "Key features"
            : `Everything in ${
                packageType === "Business" ? "Starter" : "Business"
              }, plus:`}
      </span>

      <ul className={styles.features}>
        {features.map((feature, index) => (
          <li className={styles.li} key={index}>
            <img className={styles.checkImg} src={ChecklImg} alt="" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
