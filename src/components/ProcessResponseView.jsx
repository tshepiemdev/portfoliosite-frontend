import styles from "../styles/ProcessResponseView.module.css";
import successIcon from "../assets/icons/badge.svg";
import errorIcon from "../assets/icons/error.svg";

export default function ProcessResponseView({
  status,
  header,
  message,
  user_email,
  buttonText,
  onButtonClick,
}) {
  if (!status) return null;

  const icon = status === "success" ? successIcon : errorIcon;

  return (
    <div
      className={
        status === "success" ? styles.successContainer : styles.errorContainer
      }
    >
      <img src={icon} alt={status} className={styles.icon} />
      <h2 className={styles.header}>{header}</h2>
      <p className={styles.message}>{message}</p>

      {buttonText && onButtonClick && (
        <button className={styles.actionButton} onClick={onButtonClick}>
          {buttonText}
        </button>
      )}

      {status === "success" && (
        <>
          <hr className={styles.hr} />
          <p className={styles.sender}>
            Your message is sent as:{" "}
            <span className={styles.spanUserEmail}>{user_email}</span>
          </p>
        </>
      )}
    </div>
  );
}
