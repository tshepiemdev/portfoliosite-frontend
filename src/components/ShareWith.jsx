import CounterView from "./CounterView";
import LikeButton from "./LikeButton";
import styles from "../styles/ShareWith.module.css";

export default function ShareWith({
  marginTop = 0,
  marginLeft = 0,
  options = [],
  views,
  likes,
  isLiked,
  isLiking,
  onLike,
}) {
  return (
    <div
      className={styles.shareWithWrapper}
      style={{ marginTop: `${marginTop}rem` }}
    >
      {(typeof likes === "number" || onLike) && (
        <LikeButton
          likes={likes}
          isLiked={isLiked}
          isLiking={isLiking}
          onLike={onLike}
        />
      )}

      {typeof views === "number" && (
        <CounterView count={views} text={"views"} />
      )}

      <ul
        className={styles.shareWithUl}
        style={{ marginLeft: `${marginLeft}rem` }}
      >
        {options
          .filter((item) => item.icon)
          .map((item) => (
            <li key={item.label} className={styles.shareWithLi}>
              {item.action ? (
                <button
                  type="button"
                  className={styles.shareButton}
                  onClick={item.action}
                  title={item.label}
                >
                  <img
                    className={styles.shareIcon}
                    src={item.icon}
                    alt={item.label}
                  />
                </button>
              ) : (
                <a
                  className={styles.shareWithA}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.label}
                >
                  <img
                    className={styles.shareSocialIcon}
                    src={item.icon}
                    alt={item.label}
                  />
                </a>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
