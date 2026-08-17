import styles from "../styles/BlogPageTopTitles.module.css";
import ShareWith from "../components/ShareWith";
import myDefaultProfileImage from "../assets/images/tshepang.jpg";
import bigFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import contactInfo from "../config/contactInfo";
import verifiedIcon from "../assets/icons/ver-badge.svg";
import chevronRight from "../assets/icons/chevron-right-var.svg";

const twitterLink = contactInfo.social.find(
  (social) => social.name === "Twitter",
)?.url;

export default function BlogPageTopTitlesView({
  category,
  name,
  shortDescription,
  shareOptions,
  views = 0,
  publishedAt,
  authorName,
  authorPic,
  totalReadTime,
}) {
  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const getTimeAgo = (date) => {
    if (!date) return "";

    const diffMs = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

    return `${years} year${years === 1 ? "" : "s"} ago`;
  };

  const displayDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const publishedAgo = getTimeAgo(publishedAt);

  return (
    <div className={styles.titlesWrapper}>
      <div className={styles.columnWrapper}>
        <div className={styles.rowWrapper}>
          <p className={styles.type}>{capitalizeFirstLetter(category)}</p>
          <p className={styles.label}>Blog</p>
        </div>

        <p className={styles.type}>
          {displayDate} • <span className={styles.text}>{totalReadTime}</span>
        </p>
      </div>

      <h1 className={styles.name}>{name}</h1>

      <p className={styles.summary}>{shortDescription}</p>

      <div className={styles.wrapper}>
        <ShareWith options={shareOptions} views={views} />
      </div>

      <div className={styles.box}>
        <div className={styles.minicontainer}>
          <div className={styles.profileWrapper}>
            <div className={styles.authorImgWrapper}>
              <img
                className={styles.authorImg}
                src={authorPic?.trim() ? authorPic : myDefaultProfileImage}
                alt={authorName}
                onError={(e) => {
                  e.target.src = bigFallbackImg;
                }}
              />
            </div>

            <div className={styles.textsWrapper}>
              <h4 className={styles.author}>
                {authorName}{" "}
                <img
                  className={styles.verBadgeIcon}
                  src={verifiedIcon}
                  alt=""
                />
              </h4>

              <p className={styles.status}>
                Published
                <img className={styles.chevron} src={chevronRight} alt="" />
                <span>{publishedAgo}</span>
              </p>
            </div>
          </div>

          <BtnCTAWhiteSmall
            buttonText="Follow"
            href={twitterLink}
            setRadius={16}
          />
        </div>
      </div>
    </div>
  );
}
