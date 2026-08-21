import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import useModal from "../hooks/useModal";
import styles from "../styles/ImagePreviewModal.module.css";
import closeImg from "../assets/icons/close.svg";
import bigFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import ArrowImg from "../assets/icons/chevron-down.svg";
import ReportIcon from "../assets/icons/menu-dots.svg";
import OptionsMenu from "./OptionsMenu";
import ShareSiteModal from "../components/ShareSiteModal";
import Logo from "./Logo";

const modalRoot = document.getElementById("modal-root");

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
  const lastDistance = useRef(null);
  const lastTouch = useRef(null);
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
    setDragging(false);
    lastDistance.current = null;
    lastTouch.current = null;
  }, [src, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (currentImage === null) return;

      if (e.key === "ArrowRight" && !isLast) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        onNext?.();
      }

      if (e.key === "ArrowLeft" && !isFirst) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        onPrev?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentImage, isFirst, isLast, close, onNext, onPrev]);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenShare = () => {
    setIsMenuOpen(false);
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

  const getDistance = (touches) => {
    const [a, b] = touches;

    return Math.sqrt(
      Math.pow(b.clientX - a.clientX, 2) + Math.pow(b.clientY - a.clientY, 2),
    );
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
      return;
    }

    if (e.touches.length === 1 && scale > 1) {
      lastTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();

    if (e.touches.length === 2) {
      const distance = getDistance(e.touches);

      if (lastDistance.current) {
        const difference = distance - lastDistance.current;

        setScale((prev) => {
          const newScale = Math.min(Math.max(prev + difference * 0.01, 1), 4);

          if (newScale === 1) {
            setPosition({ x: 0, y: 0 });
          }

          return newScale;
        });
      }

      lastDistance.current = distance;
      return;
    }

    if (e.touches.length === 1 && lastTouch.current && scale > 1) {
      const touch = e.touches[0];

      setPosition((prev) => ({
        x: prev.x + touch.clientX - lastTouch.current.x,
        y: prev.y + touch.clientY - lastTouch.current.y,
      }));

      lastTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = null;
    lastTouch.current = null;
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
    setDragging(false);

    onPrev?.();
  };

  const handleNext = () => {
    if (isLast) return;

    setScale(1);
    setPosition({ x: 0, y: 0 });
    setDragging(false);

    onNext?.();
  };

  if (!shouldRender || !src || !modalRoot) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        draggable={false}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = bigFallbackImg;
        }}
      />

      <div className={styles.header}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={close}
          title="Close"
          aria-label="Close image preview"
        >
          <img className={styles.closeImg} src={closeImg} alt="" />
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
          title="Options"
          aria-label="Image options"
        >
          <img className={styles.optionsImg} src={ReportIcon} alt="" />
        </button>
      </div>

      <div className={styles.bottomWrapper}>
        <div className={styles.wrapper}>
          <Logo isClickable={false} />

          <span className={styles.labelling}>
            Image <span>Preview</span>
          </span>
        </div>

        <div className={styles.wrapper}>
          {hasImages && (
            <div className={styles.buttonsWrapper}>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navLeft}`}
                onClick={handlePrev}
                disabled={isFirst}
                aria-label="Previous image"
              >
                <img className={styles.arrowImg} src={ArrowImg} alt="" />
              </button>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.navRight}`}
                onClick={handleNext}
                disabled={isLast}
                aria-label="Next image"
              >
                <img className={styles.arrowImg} src={ArrowImg} alt="" />
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
