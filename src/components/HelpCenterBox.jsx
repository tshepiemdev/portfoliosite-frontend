import { useState } from "react";
import styles from "../styles/HelpCenterBox.module.css";
import chevronIcon from "../assets/icons/chevron-down.svg";
import MarkdownText from "./MarkdownText";

export default function HelpCenterBox({ title, description }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.HelpCenterBox} ${open ? styles.openBox : ""}`}>
      <button
        className={styles.top}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <h2 className={`${styles.title} ${open ? styles.activeTitle : ""}`}>
          {title}
        </h2>

        <img
          className={`${styles.chevronIcon} ${open ? styles.rotate : ""}`}
          src={chevronIcon}
          alt=""
        />
      </button>

      <div className={`${styles.bottom} ${open ? styles.open : ""}`}>
        <MarkdownText text={description} />
      </div>
    </div>
  );
}
