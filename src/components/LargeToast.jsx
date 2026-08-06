import { useEffect, useState } from "react";
import styles from "../styles/LargeToast.module.css";
import CancelImg from "../assets/icons/x-close.svg";

import SuccessIcon from "../assets/icons/logo.svg";
import ErrorIcon from "../assets/icons/triangle-warning.svg";

export default function LargeToast({
  status,
  title,
  message,
  onClose,
  duration = 4000,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = status === "success";
  const isError = status === "error";

  const icon = isSuccess ? SuccessIcon : ErrorIcon;

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.toastWrapper} ${
          visible ? styles.enter : styles.exit
        } ${isSuccess ? styles.success : isError ? styles.error : ""}`}
      >
        <img className={styles.icon} src={icon} alt={title} />

        <div className={styles.textsWrapper}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.message}>{message}</p>
        </div>

        <button className={styles.closeBtn} onClick={() => setVisible(false)}>
          <img className={styles.iconClose} src={CancelImg} alt="close" />
        </button>
      </div>
    </div>
  );
}
