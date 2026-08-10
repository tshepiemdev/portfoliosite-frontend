import { useEffect, useState, useRef } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/BottomBar.module.css";
import ImgButton from "./ImgButton";
import toggleSidebarImg from "../assets/icons/menu-dots.svg";
import closeImg from "../assets/icons/cross-small.svg";
import backChevronImg from "../assets/icons/chevron-left.svg";
import nextChevronImg from "../assets/icons/chevron-right.svg";
import FaviconIcon from "../assets/images/favicon.svg";
import ShareIcon from "../assets/icons/paper-plane.svg";
import IconFallbackImg from "../assets/icons/logo2.svg";
import { useToast } from "./ToastContext";
import ShareSiteModal from "./ShareSiteModal";
import contactInfo from "../config/contactInfo";
import phoneImg from "../assets/icons/phone-flip.svg";
import emailImg from "../assets/icons/envelope.svg";

export default function BottomBar() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showProjects, setShowProjects] = useState(true);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function checkProjects() {
      const el = document.getElementById("projects");
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 200;

      setShowProjects(!isVisible);
    }

    checkProjects();
    window.addEventListener("scroll", checkProjects);

    return () => window.removeEventListener("scroll", checkProjects);
  }, []);

  const navLinks = [
    { name: "Jump to work", id: "projects" },
    { name: "Blog", path: "/blog" },
    { name: "Services", path: "/services" },
  ];

  const filteredOptions = navLinks.filter((link) => {
    if (link.path && link.path === location.pathname) {
      return false;
    }

    return true;
  });

  const handleScroll = (id) => {
    setIsMenuOpen(false);

    const scrollToSection = () => {
      const el = document.getElementById(id);
      if (!el) return;

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToSection, 200);
    } else {
      requestAnimationFrame(() => {
        scrollToSection();
      });
    }
  };

  const siteUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      showToast("success", "Page Link copied", "Ready to share");
      setIsMenuOpen(false);
    } catch {
      showToast("error", "Failed to copy", "Try again manually");
    }
  };

  const menuOptions = [
    {
      name: "Share",
      icon: ShareIcon,
      action: () => {
        setIsShareOpen(true);
        setIsMenuOpen(false);
      },
    },
    {
      name: "Get my resume",
      icon: FaviconIcon,
      link: "/resume",
    },
  ];

  const filteredMenuOptions = menuOptions.filter((option) => {
    if (option.link && option.link === location.pathname) {
      return false;
    }

    return true;
  });

  const contactOptions = [
    {
      name: "Call",
      icon: phoneImg,
      href: `tel:${contactInfo.personal.phone}`,
    },
    {
      name: "Mail",
      icon: emailImg,
      href: `mailto:${contactInfo.personal.email}`,
    },
  ];

  const handleOptionClick = (option) => {
    if (option.action) option.action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={styles.bottomBarHoverWrapper}>
        <div
          ref={menuRef}
          className={`${styles.BottomBar} ${isMenuOpen ? styles.open : ""}`}
        >
          <div className={styles.listsWrapper}>
            <button
              className={styles.closeChip}
              type="button"
              onClick={toggleMenu}
            ></button>

            <ul className={styles.optionsUl}>
              {filteredMenuOptions.map((option) => (
                <li key={option.name} className={styles.optionsLi}>
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
                      <img
                        className={styles.nextImg}
                        src={nextChevronImg}
                        alt={option.name}
                      />
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

            <ul className={styles.contactOptionsUl}>
              {contactOptions.map((option) => (
                <li key={option.name} className={styles.contactOptionsLi}>
                  <a
                    className={styles.contactOptionsLinkTo}
                    href={option.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img
                      className={styles.icon2}
                      src={option.icon || IconFallbackImg}
                      alt={option.name}
                    />
                    {option.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.gridWrapper}>
            {location.pathname !== "/" && (
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
                <img
                  className={styles.backImg}
                  src={backChevronImg}
                  alt="Go back"
                />
              </button>
            )}

            <div className={styles.nav}>
              <ul className={styles.ul}>
                {filteredOptions.map((link) => (
                  <li
                    key={link.name}
                    className={`${styles.li} ${
                      link.id === "projects" && !showProjects
                        ? styles.hideLi
                        : ""
                    }`}
                  >
                    {link.id ? (
                      <button
                        type="button"
                        className={styles.a}
                        onClick={() => handleScroll(link.id)}
                      >
                        {link.name}
                      </button>
                    ) : (
                      <NavLink to={link.path} className={styles.a}>
                        {link.name}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <ImgButton
              buttonImgSrc={isMenuOpen ? closeImg : toggleSidebarImg}
              altText={isMenuOpen ? "close menu" : "open menu"}
              onClick={toggleMenu}
              setMarginLeft={"0.5rem"}
            />
          </div>
        </div>
      </div>

      <ShareSiteModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
}
