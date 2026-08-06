import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import useModal from "../hooks/useModal";
import styles from "../styles/ImagePreviewModal.module.css";
import closeImg from "../assets/icons/close.svg";
import bigFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import StarImg from "../assets/icons/logo.svg";
import ArrowImg from "../assets/icons/chevron-down.svg";
import ReportIcon from "../assets/icons/menu-dots.svg";
import OptionsMenu from "./OptionsMenu";
import ShareSiteModal from "../components/ShareSiteModal";
import Logo from "./Logo";

export default function ImagePreviewModal({
  src,
  alt,
  pageName,
  imageDescription,
  currentImage,
  totalImages,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) {
  const imgRef = useRef(null);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const isFirst = currentImage === 0;
  const isLast = currentImage === totalImages - 1;
  const hasImages = totalImages > 1 && currentImage !== null;

  const { shouldRender, close } = useModal({
    isOpen,
    onClose,
    closeDelay: 300,
  });

  useEffect(() => {
    if (!isOpen || !src) return;

    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (currentImage === null) return;

      if (e.key === "ArrowRight" && !isLast) {
        onNext?.();
      }

      if (e.key === "ArrowLeft" && !isFirst) {
        onPrev?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentImage, isFirst, isLast, onNext, onPrev]);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenShare = () => {
    setIsShareOpen(true);
  };

  const handleCloseShare = () => {
    setIsShareOpen(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();

    setScale((prev) => {
      const newScale = Math.min(Math.max(prev - e.deltaY * 0.0015, 1), 4);

      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }

      return newScale;
    });
  };

  const handleMouseDown = (e) => {
    if (scale === 1) return;

    setDragging(true);

    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handlePrev = () => {
    if (isFirst) return;

    setScale(1);
    setPosition({ x: 0, y: 0 });

    onPrev?.();
  };

  const handleNext = () => {
    if (isLast) return;

    setScale(1);
    setPosition({ x: 0, y: 0 });

    onNext?.();
  };

  if (!shouldRender || !src) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className={styles.backdrop}
        style={{ backgroundImage: `url(${src})` }}
      />

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={styles.image}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        draggable={false}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = bigFallbackImg;
        }}
      />

      <div className={styles.header}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={close}
          title="close"
        >
          <img className={styles.closeImg} src={closeImg} alt="close" />
        </button>

        {hasImages && (
          <div className={styles.indicatorsWrapper}>
            {Array.from({ length: totalImages }).map((_, index) => (
              <span
                key={index}
                className={`${styles.indicatorDot} ${
                  index === currentImage ? styles.activeDot : ""
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          className={styles.optionsBtn}
          onClick={() => setIsMenuOpen(true)}
          title="options"
        >
          <img className={styles.optionsImg} src={ReportIcon} alt="options" />
        </button>
      </div>

      <div className={styles.bottomWrapper}>
        <div className={styles.wrapper}>
          <Logo />
        </div>

        <div className={styles.wrapper}>
          {hasImages && (
            <div className={styles.buttonsWrapper}>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navLeft}`}
                onClick={handlePrev}
                disabled={isFirst}
              >
                <img
                  className={styles.arrowImg}
                  src={ArrowImg}
                  alt="previous"
                />
              </button>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.navRight}`}
                onClick={handleNext}
                disabled={isLast}
              >
                <img className={styles.arrowImg} src={ArrowImg} alt="next" />
              </button>
            </div>
          )}
        </div>
      </div>

      <OptionsMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        onLinkClick={handleCloseMenu}
        onShareClick={handleOpenShare}
        imageSrc={src}
      />

      <ShareSiteModal
        isOpen={isShareOpen}
        onClose={handleCloseShare}
        imageUrl={src}
      />
    </div>,
    modalRoot,
  );
}
