import styles from "../styles/LikeButton.module.css";
import likeOff from "../assets/icons/like-off.svg";
import likeOn from "../assets/icons/like-on.svg";
import formatCount from "../utils/formatCount";

export default function LikeButton({
  likes = 0,
  isLiked = false,
  isLiking = false,
  onLike,
}) {
  return (
    <button
      type="button"
      className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
      onClick={onLike}
      disabled={isLiking}
      aria-label={isLiked ? "Unlike article" : "Like article"}
      aria-pressed={isLiked}
    >
      <img
        className={styles.likeIcon}
        src={isLiked ? likeOn : likeOff}
        alt=""
        aria-hidden="true"
      />

      {likes > 0 && <span>{formatCount(likes)}</span>}
    </button>
  );
}