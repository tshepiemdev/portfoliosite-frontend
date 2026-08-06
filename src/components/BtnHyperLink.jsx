import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/BtnHyperLink.module.css";
import NextImg from "../assets/icons/arrow-up-right.svg";

export default function BtnHyperLink({
  text,
  linkText,
  onClick,
  href,
  download = false,
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    if (!href) {
      if (onClick) onClick();
      return;
    }

    if (download) {
      const link = document.createElement("a");
      link.href = href;
      link.download = "";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onClick) onClick();
      return;
    }

    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");

      if (onClick) onClick();
      return;
    }

    navigate(href);

    if (onClick) onClick();
  };

  return (
    <p className={styles.altLbl}>
      {text}{" "}
      <button type="button" className={styles.altLink} onClick={handleClick}>
        {linkText}
      </button>
    </p>
  );
}
