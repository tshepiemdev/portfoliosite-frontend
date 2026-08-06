import { createPortal } from "react-dom";
import styles from "../styles/OverlayLoader.module.css";

export default function OverlayLoaderView({ isOpen }) {
  if (!isOpen) return null;
  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.loaderView}>
        <div className={styles.loadingCircle}></div>
        <h2 className={styles.title}>
          Hang tight, I'm
          <br />
          processing your
          <br />
          request..
        </h2>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
