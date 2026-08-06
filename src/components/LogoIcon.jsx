import styles from "../styles/LogoIcon.module.css";
import LogoImg from "../assets/icons/logo.svg";

export default function LogoIcon({ size = 1 }) {
  return (
    <img
      style={{ width: `${size}rem`, height: `${size}rem` }}
      className={styles.logo}
      src={LogoImg}
      alt="Logo"
    />
  );
}
