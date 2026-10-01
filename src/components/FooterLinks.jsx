import styles from "../styles/FooterLinks.module.css";
import ArrowUpImg from "../assets/icons/arrow-up-right.svg";
import { useToast } from "../components/ToastContext";
import { Link } from "react-router-dom";

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

  const handleInternalClick = async (e, label, href) => {
    e.preventDefault();

    try {
      if (onItemClick) {
        const handled = await onItemClick(label, href);

        if (handled) {
          return;
        }
      }

      window.location.href = href;
    } catch (err) {
      console.error(err);

      showToast(
        "error",
        "Oops! Something went wrong",
        "Please try again later",
      );
    }
  };

  return (
    <div className={styles.listingWrapper}>
      <h2 className={styles.listHeader}>{listHeader}</h2>

      <ul className={styles.ul}>
        {links.map((link, index) => {
          const { label, href = "#" } = link;

          const isWebsite = /^https?:\/\//i.test(href);
          const isActionLink =
            href.startsWith("mailto:") || href.startsWith("tel:");
          const isShareLink = href === "#share-site";
          const isInternalLink = href.startsWith("/") && !href.startsWith("//");

          if (isInternalLink) {
            return (
              <li key={`${label}-${index}`} className={styles.li}>
                <Link
                  className={styles.link}
                  to={href}
                  onClick={(e) => handleInternalClick(e, label, href)}
                >
                  <span>{label}</span>

                  <img
                    className={styles.checkImg}
                    src={ArrowUpImg}
                    alt=""
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          }

          return (
            <li key={`${label}-${index}`} className={styles.li}>
              <a
                className={styles.link}
                href={href}
                target={isWebsite ? "_blank" : undefined}
                rel={isWebsite ? "noopener noreferrer" : undefined}
                onClick={async (e) => {
                  try {
                    if (isShareLink) {
                      e.preventDefault();
                      await handleShareClick(href);
                      return;
                    }

                    if (onItemClick) {
                      const handled = await onItemClick(label, href);

                      if (handled) {
                        e.preventDefault();
                      }
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
                }}
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
