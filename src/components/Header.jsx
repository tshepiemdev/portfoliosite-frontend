import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import imgBtnStyles from "../styles/ImgButton.module.css";
import ctaBtnStyles from "../styles/BtnCTAWhiteSmall.module.css";
import Logo from "./Logo";
import Navigation from "./Navigation";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import ImgButton from "./ImgButton";
import toggleSidebarImg from "../assets/icons/sidebar-flip.svg";
import closeImg from "../assets/icons/cross-small.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const moreNavLinks = [
    { name: "Get my resume", path: "/resume" },
    { name: "Help center", path: "/help-center" },
    { name: "Legal", path: "/legal" },
  ];

  return (
    <header className={`${styles.header} ${isMenuOpen ? styles.open : ""}`}>
      <div className={styles.gridWrapper}>
        <div className={styles.logo}>
          <Logo text="tshepiem.dev" />
        </div>

        <div className={styles.nav}>
          <Navigation onNavigate={closeMenu} />

          <div className={styles.miniMenu}>
            <ul className={styles.ul}>
              {moreNavLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    className={styles.link}
                    to={item.path}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <BtnCTAWhiteSmall
            buttonText="Get in touch"
            href="/contact"
            className={ctaBtnStyles.mobileOnly}
            onClick={closeMenu}
          />

          <ImgButton
            buttonImgSrc={isMenuOpen ? closeImg : toggleSidebarImg}
            altText={isMenuOpen ? "close menu" : "open menu"}
            className={imgBtnStyles.mobileOnly}
            onClick={toggleMenu}
          />
        </div>
      </div>
    </header>
  );
}
