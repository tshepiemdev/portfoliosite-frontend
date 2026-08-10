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
      type="button"
      onClick={handleClick}
    >
      {buttonText}
    </button>
  );
}
