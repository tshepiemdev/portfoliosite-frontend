import { createPortal } from "react-dom";
import useModal from "../hooks/useModal";
import styles from "../styles/Modal.module.css";
import CancelImg from "../assets/icons/x-close.svg";

const modalRoot = document.getElementById("modal-root");

export default function Modal({
  isOpen,
  onClose,
  title,
  showTopControl = false,
  children,
  disableClose = false,
  blur = false,
}) {
  const { shouldRender, close } = useModal({
    isOpen,
    onClose,
    closeDelay: 300,
  });

  const handleClose = () => {
    if (disableClose) return;
    close();
  };

  if (!shouldRender || !modalRoot) return null;

  return createPortal(
    <div
      className={`${styles.overlay} ${blur ? styles.blur : ""}`}
      onClick={handleClose}
    >
      <div
        className={styles.main}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {showTopControl && (
          <div className={styles.topWrapper}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>

            <button
              className={styles.btnClose}
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <img className={styles.cancelImg} src={CancelImg} alt="" />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>,
    modalRoot,
  );
}
