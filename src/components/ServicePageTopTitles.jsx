import styles from "../styles/ServicePageTopTitles.module.css";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTABlack from "./BtnCTABlack";
import fallbackIcon from "../assets/icons/logo-black.svg";
import ShareWith from "../components/ShareWith";
import serviceIcons from "../utils/serviceIcons";
import FeaturedBadge from "../components/FeaturedBadge"

export default function ServicePageTopTitlesView({
  icon,
  category,
  name,
  shortDescription,
  buttonText,
  shareButtonText,
  linkTo,
  isFeatured = false,
  shareOptions,
  onShareClick,
}) {
  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className={styles.titlesWrapper}>
      <div className={styles.topWrapper}>
        <div className={styles.serviceImgWrapper}>
          <img
            className={styles.serviceImg}
            src={serviceIcons[icon] || fallbackIcon}
            alt={name}
            loading="lazy"
          />
        </div>

        <div className={styles.columnWrapper}>
          <h1 className={styles.name}>
            {name}{" "}
            {isFeatured && (
              <FeaturedBadge
                text={"New"}
                bg={"none"}
                bgColor={"white"}
                textColor={"black"}
                setInvertToImage={"invert(1)"}
              />
            )}
          </h1>

          <div className={styles.rowWrapper}>
            <p className={styles.category}>
              <img
                className={styles.textIcon}
                src={fallbackIcon}
                alt={capitalizeFirstLetter(category)}
              />
              {capitalizeFirstLetter(category)}
            </p>
            <p className={styles.type}>Service</p>
          </div>
        </div>
      </div>

      <p className={styles.shortDescription}>{shortDescription}</p>

      <div className={styles.rowWrapperControls}>
        <div className={styles.buttonsWrapper}>
          <BtnCTAWhite buttonText={buttonText} href={linkTo} />
          <BtnCTABlack buttonText={shareButtonText} onClick={onShareClick} />
        </div>
      </div>
    </div>
  );
}
