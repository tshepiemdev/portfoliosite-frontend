import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/AnimatedBentoGrid.module.css";
import API_URL from "../config/api";
import Logo from "./Logo";
import DefaultBentoImage from "../assets/images/fallback_img_16_9_light.svg";
import nextImg from "../assets/icons/chevron-right.svg";

const fallbackImages = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  imageUrl: DefaultBentoImage,
}));

const CACHE_KEY = "bentoImages";
const CACHE_TIME = 1000 * 60 * 60 * 24;

export default function AnimatedBentoGrid({
  width,
  height,
  showLinkTo = true,
}) {
  const [bentoImages, setBentoImages] = useState(fallbackImages);

  const location = useLocation();

  const fetchBentoImages = useCallback(async () => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);

        if (Date.now() - parsed.time < CACHE_TIME) {
          setBentoImages(parsed.data);
          return;
        }

        localStorage.removeItem(CACHE_KEY);
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/bento-images`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Request failed");
      }

      const images = result.data || result;

      if (Array.isArray(images) && images.length > 0) {
        setBentoImages(images);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: images,
            time: Date.now(),
          }),
        );
      }
    } catch (err) {
      console.error("Failed to load bento images:", err);
    }
  }, []);

  useEffect(() => {
    fetchBentoImages();
  }, [fetchBentoImages]);

  const loopImages = [...bentoImages, ...bentoImages];

  return (
    <div
      className={styles.gridWrapper}
      style={{
        ...(width !== undefined && { "--grid-width": width }),
        ...(height !== undefined && { "--grid-height": height }),
      }}
    >
      <div className={styles.trackWrapper}>
        <div className={styles.sliderTrack}>
          {loopImages.map((img, index) => (
            <div
              key={`${img.id || index}-${index}`}
              className={styles.bentoImageWrapper}
            >
              <img
                className={styles.bentoImage}
                src={img.imageUrl || img.image || img.url || DefaultBentoImage}
                alt=""
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = DefaultBentoImage;
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.overlay}>
          {showLinkTo && (
            <div className={styles.blurWrapper}>
              <Logo isClickable={false} />

              {location.pathname !== "/blog" && (
                <Link className={styles.span} to="/blog">
                  /blog
                  <img className={styles.nextIcon} src={nextImg} alt="/blog" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
