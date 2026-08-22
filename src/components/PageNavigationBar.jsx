import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backChevronImg from "../assets/icons/chevron-down.svg";
import styles from "../styles/PageNavigationBar.module.css";
import PopupMenu from "../components/PopupMenu";
import ShareSiteModal from "../components/ShareSiteModal";
import menuImg from "../assets/icons/menu-dots.svg";

export default function PageNavigationBar({ showMenu = false }) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenShare = () => {
    setIsMenuOpen(false);
    setIsShareOpen(true);
  };

  const handleCloseShare = () => {
    setIsShareOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navButtonsWrapper}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
        >
          <img className={styles.backImg} src={backChevronImg} alt="Go back" />
        </button>
      </div>

      {showMenu && (
        <button
          className={styles.menuBtn}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <img className={styles.menuImg} src={menuImg} alt="menu" />
        </button>
      )}

      <PopupMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        onLinkClick={handleCloseMenu}
        onShareClick={handleOpenShare}
      />

      <ShareSiteModal isOpen={isShareOpen} onClose={handleCloseShare} />
    </nav>
  );
}
