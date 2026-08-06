import styles from "../styles/FeaturedBadge.module.css";
import newImg from "../assets/icons/star-white.svg";

export default function FeaturedBadge({
  text,
  textColor,
  bg,
  bgColor,
  setInvertToImage,
  radius = 1,
}) {
  return (
    <span
      className={styles.featuredLbl}
      style={{
        background: bg,
        backgroundColor: bgColor,
        "--badge-radius": `${radius}rem`,
      }}
    >
      <span className={styles.wrapper} style={{ color: textColor }}>
        <img
          className={styles.newImg}
          src={newImg}
          alt="new service"
          style={{ filter: setInvertToImage }}
        />
        {text}
      </span>
    </span>
  );
}
