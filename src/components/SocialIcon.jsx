import styles from "../styles/SocialIcon.module.css";

export default function SocialIcon({
  imgSrc,
  href,
  alt,
  filter = "invert(1)",
}) {
  return (
    <button className={styles.socialButton}>
      <a className={styles.a} href={href} target="_blank" rel="noreferrer">
        <img
          className={styles.socialImg}
          src={imgSrc}
          alt={alt}
          style={{ filter }}
        />
      </a>
    </button>
  );
}
