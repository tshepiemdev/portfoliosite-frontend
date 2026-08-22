import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import useModal from "../hooks/useModal";
import styles from "../styles/ImagePreviewModal.module.css";
import closeImg from "../assets/icons/close.svg";
import bigFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import ArrowImg from "../assets/icons/chevron-down.svg";
import ReportIcon from "../assets/icons/menu-dots.svg";
import OptionsMenu from "./OptionsMenu";
import ShareSiteModal from "../components/ShareSiteModal";

const modalRoot = document.getElementById("modal-root");

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DOUBLE_CLICK_ZOOM = 2.5;
const WHEEL_ZOOM_STEP = 0.25;

export default function ImagePreviewModal({
  src,
  alt,
  pageName,
  imageDescription,
  currentImage,
  totalImages,
  images = [],
  isOpen,
  onClose,
  onNext,
  onPrev,
  onSelectImage,
}) {
  const imgRef = useRef(null);
  const pointersRef = useRef(new Map());
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imageCount = images.length || totalImages || 1;
  const activeIndex = currentImage ?? 0;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === imageCount - 1;

  const { shouldRender, close } = useModal({
    isOpen,
    onClose,
    closeDelay: 300,
  });

  const clampZoom = useCallback((value) => {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  }, []);

  const getImageSize = useCallback(() => {
    const image = imgRef.current;

    if (!image) {
      return {
        width: 0,
        height: 0,
      };
    }

    return {
      width: image.offsetWidth,
      height: image.offsetHeight,
    };
  }, []);

  const clampPosition = useCallback(
    (x, y, scale = zoom) => {
      const { width, height } = getImageSize();

      if (!width || !height || scale <= 1) {
        return {
          x: 0,
          y: 0,
        };
      }

      const maxX = (width * (scale - 1)) / 2;
      const maxY = (height * (scale - 1)) / 2;

      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [getImageSize, zoom],
  );

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPosition({
      x: 0,
      y: 0,
    });

    pointersRef.current.clear();
    dragRef.current = null;
    pinchRef.current = null;
  }, []);

  const getOrigin = useCallback((clientX, clientY) => {
    const image = imgRef.current;

    if (!image) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect = image.getBoundingClientRect();

    return {
      x: clientX - (rect.left + rect.width / 2),
      y: clientY - (rect.top + rect.height / 2),
    };
  }, []);

  const zoomAtPoint = useCallback(
    (nextZoom, originX, originY) => {
      const oldZoom = zoom;
      const newZoom = clampZoom(nextZoom);

      if (newZoom === MIN_ZOOM) {
        resetZoom();
        return;
      }

      const ratio = newZoom / oldZoom;

      setPosition((current) => {
        const nextX =
          originX - (originX - current.x) * ratio;

        const nextY =
          originY - (originY - current.y) * ratio;

        return clampPosition(nextX, nextY, newZoom);
      });

      setZoom(newZoom);
    },
    [
      zoom,
      clampZoom,
      clampPosition,
      resetZoom,
    ],
  );

  const handleWheel = useCallback(
    (e) => {
      const image = imgRef.current;

      if (!image || e.target !== image) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const origin = getOrigin(
        e.clientX,
        e.clientY,
      );

      const direction =
        e.deltaY < 0
          ? WHEEL_ZOOM_STEP
          : -WHEEL_ZOOM_STEP;

      zoomAtPoint(
        zoom + direction,
        origin.x,
        origin.y,
      );
    },
    [zoom, getOrigin, zoomAtPoint],
  );

  const handleDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const origin = getOrigin(
        e.clientX,
        e.clientY,
      );

      if (zoom > MIN_ZOOM) {
        resetZoom();
        return;
      }

      zoomAtPoint(
        DOUBLE_CLICK_ZOOM,
        origin.x,
        origin.y,
      );
    },
    [
      zoom,
      getOrigin,
      resetZoom,
      zoomAtPoint,
    ],
  );

  const handlePointerDown = useCallback(
    (e) => {
      const image = imgRef.current;

      if (!image || e.target !== image) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      image.setPointerCapture?.(
        e.pointerId,
      );

      pointersRef.current.set(
        e.pointerId,
        {
          x: e.clientX,
          y: e.clientY,
        },
      );

      if (
        pointersRef.current.size === 2
      ) {
        const points = [
          ...pointersRef.current.values(),
        ];

        const dx =
          points[0].x - points[1].x;

        const dy =
          points[0].y - points[1].y;

        const distance = Math.sqrt(
          dx * dx + dy * dy,
        );

        pinchRef.current = {
          distance,
          zoom,
        };

        dragRef.current = null;

        return;
      }

      if (zoom > MIN_ZOOM) {
        dragRef.current = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          startPositionX: position.x,
          startPositionY: position.y,
        };
      }
    },
    [zoom, position],
  );

  const handlePointerMove = useCallback(
    (e) => {
      const image = imgRef.current;

      if (!image || e.target !== image) {
        return;
      }

      if (
        !pointersRef.current.has(
          e.pointerId,
        )
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      pointersRef.current.set(
        e.pointerId,
        {
          x: e.clientX,
          y: e.clientY,
        },
      );

      if (
        pointersRef.current.size === 2
      ) {
        const points = [
          ...pointersRef.current.values(),
        ];

        const dx =
          points[0].x - points[1].x;

        const dy =
          points[0].y - points[1].y;

        const distance = Math.sqrt(
          dx * dx + dy * dy,
        );

        if (
          !pinchRef.current ||
          !pinchRef.current.distance
        ) {
          pinchRef.current = {
            distance,
            zoom,
          };

          return;
        }

        const scale =
          distance /
          pinchRef.current.distance;

        const nextZoom = clampZoom(
          pinchRef.current.zoom * scale,
        );

        setZoom(nextZoom);

        if (nextZoom <= MIN_ZOOM) {
          setPosition({
            x: 0,
            y: 0,
          });
        } else {
          setPosition((current) =>
            clampPosition(
              current.x,
              current.y,
              nextZoom,
            ),
          );
        }

        return;
      }

      if (
        !dragRef.current ||
        dragRef.current.pointerId !==
          e.pointerId ||
        zoom <= MIN_ZOOM
      ) {
        return;
      }

      const deltaX =
        e.clientX -
        dragRef.current.startX;

      const deltaY =
        e.clientY -
        dragRef.current.startY;

      setPosition(
        clampPosition(
          dragRef.current
            .startPositionX + deltaX,
          dragRef.current
            .startPositionY + deltaY,
          zoom,
        ),
      );
    },
    [
      zoom,
      clampZoom,
      clampPosition,
    ],
  );

  const handlePointerUp = useCallback(
    (e) => {
      const image = imgRef.current;

      if (
        image?.hasPointerCapture?.(
          e.pointerId,
        )
      ) {
        image.releasePointerCapture?.(
          e.pointerId,
        );
      }

      pointersRef.current.delete(
        e.pointerId,
      );

      if (
        pointersRef.current.size < 2
      ) {
        pinchRef.current = null;
      }

      if (
        dragRef.current?.pointerId ===
        e.pointerId
      ) {
        dragRef.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (
        e.key === "ArrowRight" &&
        !isLast
      ) {
        onNext?.();
      }

      if (
        e.key === "ArrowLeft" &&
        !isFirst
      ) {
        onPrev?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isFirst,
    isLast,
    close,
    onNext,
    onPrev,
  ]);

  useEffect(() => {
    resetZoom();
  }, [
    src,
    currentImage,
    resetZoom,
  ]);

  useEffect(() => {
    if (!isOpen) return;

    const html =
      document.documentElement;
    const body = document.body;
    const layout =
      document.querySelector(
        ".layout",
      );

    const previousHtmlOverflow =
      html.style.overflow;

    const previousBodyOverflow =
      body.style.overflow;

    const previousLayoutOverflow =
      layout?.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    if (layout) {
      layout.style.overflow = "hidden";
    }

    return () => {
      html.style.overflow =
        previousHtmlOverflow;

      body.style.overflow =
        previousBodyOverflow;

      if (layout) {
        layout.style.overflow =
          previousLayoutOverflow || "";
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const image = imgRef.current;

    if (!image) return;

    image.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      },
    );

    return () => {
      image.removeEventListener(
        "wheel",
        handleWheel,
      );
    };
  }, [handleWheel]);

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

  const handlePrev = () => {
    if (isFirst) return;

    resetZoom();
    onPrev?.();
  };

  const handleNext = () => {
    if (isLast) return;

    resetZoom();
    onNext?.();
  };

  const handleSelectImage = (index) => {
    if (index === activeIndex) return;

    resetZoom();
    onSelectImage?.(index);
  };

  const handleMainImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      bigFallbackImg;
  };

  const handleThumbnailError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      bigFallbackImg;
  };

  if (
    !shouldRender ||
    !src ||
    !modalRoot
  ) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      onWheel={(e) => {
        if (e.target !== imgRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onTouchMove={(e) => {
        if (e.target !== imgRef.current) {
          e.preventDefault();
        }
      }}
    >
      <div className={styles.imageStage}>
        <img
          ref={imgRef}
          src={src}
          alt={alt || "Image preview"}
          className={`${styles.image} ${
            zoom > 1
              ? styles.zoomedImage
              : ""
          }`}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
          }}
          draggable={false}
          onError={handleMainImageError}
          onDoubleClick={
            handleDoubleClick
          }
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerUp
          }
        />
      </div>

      <div
        className={styles.header}
        onPointerDown={(e) =>
          e.stopPropagation()
        }
        onPointerMove={(e) =>
          e.stopPropagation()
        }
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchMove={(e) =>
          e.stopPropagation()
        }
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={close}
          title="Close"
          aria-label="Close image preview"
        >
          <img
            className={styles.closeImg}
            src={closeImg}
            alt=""
          />
        </button>

        <button
          type="button"
          className={styles.optionsBtn}
          onClick={() =>
            setIsMenuOpen(true)
          }
          title="Options"
          aria-label="Image options"
        >
          <img
            className={styles.optionsImg}
            src={ReportIcon}
            alt=""
          />
        </button>
      </div>

      <div className={styles.bottomWrapper}>
        {imageCount > 1 && (
          <div className={styles.wrapper}>
            <div
              className={
                styles.buttonsWrapper
              }
            >
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navLeft}`}
                onClick={handlePrev}
                disabled={isFirst}
                aria-label="Previous image"
              >
                <img
                  className={
                    styles.arrowImg
                  }
                  src={ArrowImg}
                  alt=""
                />
              </button>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.navRight}`}
                onClick={handleNext}
                disabled={isLast}
                aria-label="Next image"
              >
                <img
                  className={
                    styles.arrowImg
                  }
                  src={ArrowImg}
                  alt=""
                />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.imageList}>
        {images.map(
          (image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`${styles.imageListItem} ${
                index === activeIndex
                  ? styles.activeImageListItem
                  : ""
              }`}
              onClick={() =>
                handleSelectImage(
                  index,
                )
              }
              aria-label={`View image ${
                index + 1
              }`}
            >
              <img
                src={image}
                alt={`${
                  alt || "Image"
                } ${index + 1}`}
                draggable={false}
                onError={
                  handleThumbnailError
                }
              />
            </button>
          ),
        )}
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