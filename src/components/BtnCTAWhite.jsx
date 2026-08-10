import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/BtnCTAWhite.module.css";
import buttonImg from "../assets/icons/logo-black.svg";
import buttonArrowImg from "../assets/icons/arrow-narrow-next.svg";

export default function BtnCTAWhite({
  iconB,
  iconF,
  type = "button",
  buttonText,
  openDialog = false,
  onClick,
  href,
  download = false,
  focusTo,
  fullWidth = false,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      type={type}
      onClick={handleClick}
    >
      {iconB && (
        <img
          className={styles.buttonImg}
          src={iconB || buttonImg}
          alt={buttonText}
        />
      )}

      {buttonText}

      {iconF && (
        <img
          className={styles.buttonArrow}
          src={buttonArrowImg}
          alt={buttonText}
        />
      )}
    </button>
  );
}
