import styles from "../styles/ReviewBentoBox.module.css";
import smallFallbackImg from "../assets/images/fallback_img_16_9.svg";
import quoteImg from "../assets/icons/quotation-marks.svg";

export default function ReviewBentoBox({
  name,
  position,
  company,
  profileImg,
  testimony,
  isActive,
  order,
}) {
  const imgSrc =
    profileImg && profileImg.trim() !== "" ? profileImg : smallFallbackImg;

  return (
    <div className={styles.reviewWrapper}>
      <img className={styles.quoteImg} src={quoteImg} alt={testimony} />

      <h2 className={styles.testimony}>"{testimony}"</h2>

      <div className={styles.metaWrapper}>
        <div className={styles.profileImgWrapper}>
          <img
            className={styles.profileImg}
            src={imgSrc}
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = smallFallbackImg;
            }}
          />

          <div className={styles.overlay}>
            <span className={styles.ratings}>0.0</span>
          </div>
        </div>

        <div className={styles.columnWrapper}>
          <p className={styles.name}>{name}</p>
          <p className={styles.position}>{company}</p>
        </div>
      </div>
    </div>
  );
}
