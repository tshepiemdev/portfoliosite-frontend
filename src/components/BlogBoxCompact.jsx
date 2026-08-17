import styles from "../styles/BlogBoxCompact.module.css";
import { Link } from "react-router-dom";
import nextArrowImg from "../assets/icons/back_arrow.svg";
import starImg from "../assets/icons/logo-black.svg";
import newImg from "../assets/icons/star.svg";
import smallFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import { slugify } from "../utils/slugify";

export default function BlogBoxCompact({
  title,
  category,
  publishedAt,
  formattedDate,
  isFeatured = false,
  imageUrl,
  blogLink,
  slug,
}) {
  const displayDate =
    formattedDate ||
    (publishedAt
      ? new Date(publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "");

  const finalSlug = slug || slugify(title);

  return (
    <Link to={blogLink || `/blog/${finalSlug}`} className={styles.blogBoxLink}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.blogImage}
          src={imageUrl || smallFallbackImg}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = smallFallbackImg;
          }}
          loading="lazy"
        />
      </div>

      <div className={styles.metaWrapper}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.wrapper}>
          <p className={styles.category}>{category + " •"}</p>
          <p className={styles.date}>{displayDate}</p>
        </div>
      </div>
    </Link>
  );
}
