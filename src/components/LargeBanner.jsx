import { useEffect, useState } from "react";
import styles from "../styles/LargeBanner.module.css";
import API_URL from "../config/api";
import BtnCTAWhite from "./BtnCTAWhite";
import Logo from "./Logo";
import SectionHeading from "./SectionHeading";
import DefaultBentoImage from "../assets/images/fallback_img_16_9_light.svg";

export default function LargeBanner() {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  const CACHE_KEY = "bentoImages";
  const CACHE_TIME = 1000 * 60 * 60 * 24;

  useEffect(() => {
    const fetchImages = async () => {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);

          if (Date.now() - parsed.time < CACHE_TIME) {
            setImages(parsed.data);
            return;
          }
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

        const data = result.data || result;

        setImages(data);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            time: Date.now(),
          }),
        );
      } catch (err) {
        console.log("Banner images fetch error:", err);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.backgroundImages}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <img
              key={`${image.name}-${index}`}
              src={image.imageUrl || DefaultBentoImage}
              alt=""
              className={`${styles.backgroundImage} ${
                index === activeImage ? styles.active : ""
              }`}
              onError={(e) => {
                e.currentTarget.src = DefaultBentoImage;
              }}
            />
          ))
        ) : (
          <img
            src={DefaultBentoImage}
            alt=""
            className={`${styles.backgroundImage} ${styles.active}`}
          />
        )}
      </div>

      <div className={styles.overlay} />

      <div className={styles.content}>
        <Logo isClickable={false} />

        <SectionHeading
          title={
            <>
              Creative, skilled <br />& project ready <br />
              developer.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <BtnCTAWhite buttonText="Hire me now" href="/hire-me" />
      </div>
    </div>
  );
}
