import styles from "../styles/SkillListingBentoBox.module.css";
import smallFallbackImg from "../assets/icons/spark.svg";
import iconMap from "../utils/iconMap";

export default function SkillListingBentoBox({
  listImg,
  listHeader,
  listItem,
}) {
  const imgSrc = iconMap[listImg] || smallFallbackImg;

  return (
    <div className={styles.listingWrapper}>
      <div className={styles.topWrapper}>
        <div className={styles.skillImgWrapper}>
          <img
            className={styles.listImg}
            src={imgSrc}
            alt={listHeader}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = smallFallbackImg;
            }}
          />
        </div>

        <h2 className={styles.listHeader}>{listHeader}</h2>
      </div>

      <div className={styles.itemsWrapper}>
        <p className={styles.items} key={listItem}>
          {listItem.join(", ")}
        </p>
      </div>
    </div>
  );
}
