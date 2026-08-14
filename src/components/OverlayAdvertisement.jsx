import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OverlayAdvertisement.module.css";
import FallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import menuImg from "../assets/icons/menu-dots.svg";
import cancelImg from "../assets/icons/x-close.svg";

export default function OverlayAdvertisement({
  imgUrl,
  title,
  description,
  buttonText,
  toUrl,
  website,
  onClick,
}) {
  const navigate = useNavigate();
  const [isOptionsViewOpen, setIsOptionsViewOpen] = useState(false);
  const optionsRef = useRef(null);

  const handleClick = () => {
    if (toUrl) {
      if (toUrl.startsWith("http")) {
        window.open(toUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(toUrl);
      }
    }

    if (onClick) onClick();
  };

  const handleOpenOptionsButton = () => {
    setIsOptionsViewOpen(true);
  };

  const handleCloseOptionsButton = () => {
    setIsOptionsViewOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isOptionsViewOpen &&
        optionsRef.current &&
        !optionsRef.current.contains(e.target)
      ) {
        setIsOptionsViewOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOptionsViewOpen]);

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.loaderView}>
        <img className={styles.adImg} src={imgUrl || FallbackImg} alt="ad" />

        {isOptionsViewOpen ? (
          <div ref={optionsRef} className={styles.optionsView}>
            <div className={styles.topWrapper}>
              <h3>ad</h3>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={handleCloseOptionsButton}
              >
                <img className={styles.closeImg} src={cancelImg} alt="close" />
              </button>
            </div>

            <div className={styles.optionItem}>Why am I seeing this ad?</div>
            <div className={styles.optionItem}>Report this ad</div>
            <div className={styles.optionItem}>Hide this ad</div>
          </div>
        ) : (
          <div className={styles.overlayTextsWrapper}>
            <p className={styles.sponsoredText}>
              Sponsored
              <button
                className={styles.menuBtn}
                type="button"
                onClick={handleOpenOptionsButton}
              >
                <img className={styles.menuImg} src={menuImg} alt="options" />
              </button>
            </p>

            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>

            <button className={styles.btnCta} onClick={handleClick}>
              {buttonText}
            </button>

            <p>You will be redirected to {website}</p>
          </div>
        )}
      </div>

      <button type="button" className={styles.btnDismiss}>
        Dismiss
      </button>
    </div>,
    document.getElementById("modal-root"),
  );
}
