import styles from "../styles/ProjectStatusBadge.module.css";
import ShippedImg from "../assets/icons/cloud.svg";
import DiscontinuedImg from "../assets/icons/ban.svg";
import BuildingImg from "../assets/icons/square-terminal-color.svg";

export default function ProjectStatusBadge({ badgeText }) {
  const statusClass = badgeText
    ? badgeText.toLowerCase().replace(/\s+/g, "-")
    : "";

  const finalBadgeText = badgeText.charAt(0).toUpperCase() + badgeText.slice(1);

  const statusImages = {
    shipped: ShippedImg,
    building: BuildingImg,
    discontinued: DiscontinuedImg,
  };

  return (
    <div className={`${styles.badgeChip} ${styles[statusClass]}`}>
      <img
        className={styles.statusImg}
        src={statusImages[badgeText]}
        alt={badgeText}
      />
      <p className={styles.badgeChipText}>{finalBadgeText}</p>
    </div>
  );
}
