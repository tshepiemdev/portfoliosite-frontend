import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import styles from "../styles/ShareSiteModal.module.css";
import moreImg from "../assets/icons/menu-dots.svg";
import LinkImg from "../assets/icons/link.svg";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import whatsappImg from "../assets/icons/whatsapp.svg";
import instaImg from "../assets/icons/instagram.svg";
import xImg from "../assets/icons/twitter-alt.svg";
import messengerImg from "../assets/icons/facebook-messenger.svg";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";

export default function ShareSiteModal({ isOpen, onClose, imageUrl }) {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const siteUrl = window.location.href;
  const shareUrl = imageUrl || siteUrl;

  const handleNativeShare = async () => {
    try {
      if (!navigator.share) {
        showToast(
          "error",
          "Sharing not supported",
          "Your device does not support sharing",
        );
        return;
      }

      await navigator.share({
        title: "Shared Image",
        text: "Check this out",
        url: shareUrl,
      });

      onClose();
    } catch {
      showToast("error", "Share cancelled", "No action completed");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("success", "Link copied", "You can now share it anywhere");
      onClose();
    } catch {
      showToast("error", "Copy failed", "Try again manually");
    }
  };

  const shareOptions = [
    {
      icon: xImg,
      name: "X/Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl,
      )}`,
    },
    {
      icon: whatsappImg,
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    },
    {
      icon: instaImg,
      name: "Instagram",
      url: "https://www.instagram.com/",
    },
    {
      icon: linkedInImg,
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl,
      )}`,
    },
    {
      icon: messengerImg,
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl,
      )}`,
    },
    {
      name: "More",
      icon: moreImg,
      action: handleNativeShare,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share"
      showTopControl={true}
      blur
    >
      <div className={styles.bottomWrapper}>
        <h4 className={styles.miniHeader}>Share with</h4>

        <ul className={styles.ul}>
          {shareOptions.map((item, i) => (
            <li className={styles.li} key={i}>
              {item.action ? (
                <button
                  className={styles.btnMore}
                  type="button"
                  onClick={item.action}
                >
                  <div className={styles.iconWrapper}>
                    <img className={styles.moreImg} src={item.icon} alt="" />
                  </div>

                  <p className={styles.optionName}>{item.name}</p>
                </button>
              ) : (
                <a
                  className={styles.anchor}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className={styles.iconWrapper}>
                    <img className={styles.socialImg} src={item.icon} alt="" />
                  </div>

                  <p className={styles.optionName}>{item.name}</p>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.lastWrapper}>
        <input className={styles.urlInput} value={shareUrl} readOnly />

        <BtnCTAWhiteSmall buttonText="Copy link" onClick={handleCopyLink} />
      </div>
    </Modal>
  );
}
