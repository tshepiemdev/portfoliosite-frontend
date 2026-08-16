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
  publishDate,
  authorName,
  authorPic,
  totalReadTime,
}) {
  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const displayDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className={styles.titlesWrapper}>
      <div className={styles.columnWrapper}>
        <div className={styles.rowWrapper}>
          <p className={styles.type}>{capitalizeFirstLetter(category)}</p>
          <p className={styles.label}>Blog</p>
        </div>

        <p className={styles.type}>
          {displayDate} • <p className={styles.text}> {totalReadTime}</p>
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
                onClick={() =>
                  setSelectedImage(authorPic || myDefaultProfileImage)
                }
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
                  alt={authorName}
                />
              </h4>
              <p className={styles.status}>
                Last publish
                <img className={styles.chevron} src={chevronRight} alt="" />
                <span>16 hrs ago</span>
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
