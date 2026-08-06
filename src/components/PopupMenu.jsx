import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/PopupMenu.module.css";

import HelpIcon from "../assets/icons/interrogation.svg";
import ReportIcon from "../assets/icons/report.svg";
import ShareIcon from "../assets/icons/share.svg";
import IconFallbackImg from "../assets/icons/logo2.svg";

export default function PopupMenu({
  isOpen,
  setIsOpen,
  onLinkClick,
  onShareClick,
}) {
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

  const menuOptions = [
    { name: "Help", icon: HelpIcon, link: "/help-center" },
    { name: "Report a problem", icon: ReportIcon, link: "/contact" },
    { name: "Share", icon: ShareIcon, link: "" },
  ];

  const filteredOptions = menuOptions.filter(
    (option) => option.link !== location.pathname,
  );

  const handleClick = (option) => {
    if (option.name === "Share") {
      if (onShareClick) onShareClick();
    }

    setIsOpen(false);
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className={styles.menuWrapper} ref={menuRef}>
      <ul className={styles.ul}>
        {filteredOptions.map((option) => (
          <li key={option.name} className={styles.li}>
            {option.name === "Share" ? (
              <button
                className={styles.linkToButton}
                onClick={() => handleClick(option)}
              >
                <img
                  className={styles.icon}
                  src={option.icon || IconFallbackImg}
                  alt={option.name}
                />
                {option.name}
              </button>
            ) : (
              <Link
                className={styles.linkTo}
                to={option.link}
                onClick={() => handleClick(option)}
              >
                <img
                  className={styles.icon}
                  src={option.icon || IconFallbackImg}
                  alt={option.name}
                />
                {option.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
