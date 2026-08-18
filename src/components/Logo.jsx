import styles from "../styles/Logo.module.css";
import LogoImg from "../assets/images/favicon.svg";
import { useNavigate, useLocation } from "react-router-dom";

export default function Logo({
  text = "tshepiem.dev",
  color = "#ffffff",
  size = 1.1,
  iconSrc = LogoImg,
  iconSize = 1,
  isClickable = true,
  onClick,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (isClickable) {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.reload();
      } else {
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={styles.logoWrapper}
      onClick={handleClick}
      style={{ cursor: isClickable ? "pointer" : "default" }}
    >
      <img
        className={styles.logoImg}
        src={iconSrc || LogoImg}
        alt="tshepiem.dev"
        style={{ width: `${iconSize}rem`, height: `${iconSize}rem` }}
      />

      {text && (
        <h1
          className={styles.wordmarkText}
          style={{
            fontSize: `${size}rem`,
            color: color,
          }}
        >
          {text}
        </h1>
      )}
    </div>
  );
}
