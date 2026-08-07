import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/OptionsMenu.module.css";
import SaveImg from "../assets/icons/download.svg";
import HelpIcon from "../assets/icons/interrogation.svg";
import ReportIcon from "../assets/icons/report.svg";
import CopyIcon from "../assets/icons/clone (1).svg";
import ShareIcon from "../assets/icons/share2.svg";
import IconFallbackImg from "../assets/icons/logo2.svg";
import { useToast } from "./ToastContext";

export default function OptionsMenu({
  isOpen,
  setIsOpen,
  onLinkClick,
  onShareClick,
  imageSrc,
}) {
  const { showToast } = useToast();
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const imageUrl = imageSrc;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);

      showToast("success", "Image Link copied", "Ready to share");

      setIsOpen(false);
    } catch {
      showToast("error", "Copy failed", "Try again manually");
    }
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = imageUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);

      showToast("success", "Download started", "Please wait");

      setIsOpen(false);
    } catch {
      showToast("error", "Download failed", "Try again manually");
    }
  };

  const menuOptions = [
    {
      name: "Save Image",
      icon: SaveImg,
      action: handleDownloadImage,
    },
    {
      name: "Share",
      icon: ShareIcon,
      action: onShareClick,
    },
    {
      name: "Copy Image Url",
      icon: CopyIcon,
      action: handleCopyLink,
    },
    {
      name: "Help",
      icon: HelpIcon,
      link: "/help-center",
    },
    {
      name: "Report",
      icon: ReportIcon,
      link: "/contact?reason=report",
    },
  ];

  const filteredOptions = menuOptions.filter(
    (option) => option.link !== location.pathname,
  );

  const handleOptionClick = (option) => {
    if (option.action) {
      option.action();
    }

    setIsOpen(false);

    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className={styles.menuWrapper} ref={menuRef}>
      <ul className={styles.ul}>
        {filteredOptions.map((option) => (
          <li key={option.name} className={styles.li}>
            {option.link ? (
              <Link
                className={styles.linkTo}
                to={option.link}
                onClick={() => handleOptionClick(option)}
              >
                <img
                  className={styles.icon}
                  src={option.icon || IconFallbackImg}
                  alt={option.name}
                />
                {option.name}
              </Link>
            ) : (
              <button
                type="button"
                className={styles.linkToButton}
                onClick={() => handleOptionClick(option)}
              >
                <img
                  className={styles.icon}
                  src={option.icon || IconFallbackImg}
                  alt={option.name}
                />
                {option.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
