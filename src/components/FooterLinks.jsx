import styles from "../styles/FooterLinks.module.css";
import ArrowUpImg from "../assets/icons/arrow-up-right.svg";
import { useToast } from "../components/ToastContext";

export default function FooterLinksBox({
  listHeader,
  links = [],
  onItemClick,
}) {
  const { showToast } = useToast();

  const handleShareClick = async (href) => {
    if (href !== "#share-site") return false;

    try {
      await navigator.clipboard.writeText(window.location.href);

      showToast(
        "success",
        "Link copied",
        "Portfolio site link copied and ready to share",
      );
    } catch (err) {
      console.error(err);

      showToast("error", "Copy failed", "Unable to copy portfolio link");
    }

    return true;
  };

  return (
    <div className={styles.listingWrapper}>
      <h2 className={styles.listHeader}>{listHeader}</h2>

      <ul className={styles.ul}>
        {links.map((link, index) => {
          const { label, href = "#" } = link;

          const isWebsite = href.startsWith("http");
          const isActionLink =
            href.startsWith("mailto:") || href.startsWith("tel:");

          const handleClick = async (e) => {
            try {
              if (onItemClick) {
                const handled = await onItemClick(label, href);

                if (handled) {
                  e.preventDefault();
                  return;
                }
              }

              const shared = await handleShareClick(href);

              if (shared) {
                e.preventDefault();
              }
            } catch (err) {
              console.error(err);

              e.preventDefault();

              showToast(
                "error",
                "Oops! Something went wrong",
                "Please try again later",
              );
            }
          };

          return (
            <li key={`${label}-${index}`} className={styles.li}>
              <a
                className={styles.link}
                href={href}
                target={isWebsite ? "_blank" : undefined}
                rel={isWebsite ? "noopener noreferrer" : undefined}
                onClick={handleClick}
              >
                <span>{label}</span>

                <img
                  className={styles.checkImg}
                  src={ArrowUpImg}
                  alt=""
                  aria-hidden="true"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
