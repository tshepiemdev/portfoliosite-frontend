import styles from "../styles/BlogBox.module.css";
import { Link } from "react-router-dom";
import smallFallbackImg from "../assets/images/fallback_img_16_9.svg";
import StarImg from "../assets/icons/star-white.svg";
import { slugify } from "../utils/slugify";

export default function BlogBox({
  title,
  category,
  publishedDate,
  formattedDate,
  isFeatured = false,
  imageUrl,
  blogLink,
  slug,
  variant = "compact",
}) {
  const displayDate =
    formattedDate ||
    (publishedDate
      ? new Date(publishedDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "");

  const finalSlug = slug || slugify(title);

  return (
    <Link
      to={blogLink || `/blog/${finalSlug}`}
      className={`${styles.blogBoxLink} ${
        variant === "featured" ? styles.featured : styles.compact
      }`}
    >
      <div className={styles.imageWrapper}>
        <img
          className={`${styles.blogImage} ${
            variant === "featured" ? styles.featuredImage : styles.compactImage
          }`}
          src={imageUrl || smallFallbackImg}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = smallFallbackImg;
          }}
          loading="lazy"
        />

        {isFeatured && (
          <p className={styles.featuredLbl}>
            <img
              className={styles.featuredIcon}
              src={StarImg}
              alt="featured article"
            />
          </p>
        )}
      </div>

      <div className={styles.metaWrapper}>
        <h2
          className={`${styles.title} ${
            variant === "featured" ? styles.featuredTitle : styles.compactTitle
          }`}
        >
          {title}
        </h2>

        <div className={styles.wrapper}>
          <p className={styles.category}>{category + " •"}</p>
          <p className={styles.date}>{displayDate}</p>
        </div>
      </div>
    </Link>
  );
}
