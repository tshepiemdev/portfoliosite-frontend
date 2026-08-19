import styles from "../styles/LogoIcon.module.css";
import LogoImg from "../assets/icons/logo.svg";
import LogoImgWhite from "../assets/icons/logo-white.svg";

export default function LogoIcon({ iconColor = "default", size = 1 }) {
  const icons = {
    default: LogoImg,
    white: LogoImgWhite,
  };

  const getIcon = () => {
    if (iconColor === "white") return icons.white;
    return icons.default;
  };

  const icon = getIcon();
  
  return (
    <img
      style={{ width: `${size}rem`, height: `${size}rem` }}
      className={styles.logo}
      src={icon}
      alt="Logo"
    />
  );
}
