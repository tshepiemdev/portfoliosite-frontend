import styles from "../styles/ServicePageTopTitles.module.css";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTABlack from "./BtnCTABlack";
import fallbackIcon from "../assets/icons/logo-black.svg";
import ShareWith from "../components/ShareWith";
import serviceIcons from "../utils/serviceIcons";

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
          <h1 className={styles.name}>{name}</h1>

          <div className={styles.rowWrapper}>
            <p className={styles.category}>{capitalizeFirstLetter(category)}</p>
            <p className={styles.type}>• Service</p>
          </div>
        </div>
      </div>

      <p className={styles.shortDescription}>{shortDescription}</p>

      <div className={styles.rowWrapperControls}>
        <div className={styles.buttonsWrapper}>
          <BtnCTAWhite buttonText={buttonText} href={linkTo} fullWidth />
          <BtnCTABlack
            buttonText={shareButtonText}
            onClick={onShareClick}
            fullWidth
          />
        </div>

        <ShareWith options={shareOptions} />
      </div>
    </div>
  );
}
