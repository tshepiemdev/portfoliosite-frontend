import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/BtnCTAWhiteSmall.module.css";

export default function BtnCTAWhiteSmall({
  buttonText,
  openDialog = false,
  onClick,
  href,
  focusTo,
  download = false,
  fullWidth = false,
  setRadius,
  hoverBg = "orangered",
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (openDialog) {
      setIsDialogOpen(true);
    }

    if (focusTo) {
      const element = document.getElementById(focusTo);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }

    if (href) {
      if (download) {
        const link = document.createElement("a");
        link.href = href;
        link.download = "";
        link.click();
        return;
      }

      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        window.location.href = href;
      } else {
        navigate(href);
      }
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`${styles.btnCTA} ${fullWidth ? styles.full : styles.auto}`}
      style={{
        borderRadius: setRadius ? `${setRadius}rem` : undefined,
        backgroundColor: isHovered ? hoverBg : "#ffffff",
        borderColor: isHovered ? "rgba(255, 255, 255, 0.2)" : "#ffffff",
      }}
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {buttonText}
    </button>
  );
}
