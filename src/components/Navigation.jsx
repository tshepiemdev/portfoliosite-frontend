import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Navigation.module.css";

export default function Navigation({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Meet", id: "meet" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Qualifications", id: "qualifications" },
    { name: "Experience", id: "experience" },
    { name: "Reviews", id: "reviews" },
    { name: "Blog", path: "/blog" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
  ];

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = navLinks
      .filter((link) => link.id)
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname]);

  const handleScroll = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    onNavigate?.();
  };

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const id = location.state.scrollTo;

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  }, [location]);

  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        {navLinks.map((link) => (
          <li key={link.name} className={styles.li}>
            {link.id ? (
              <button
                type="button"
                onClick={() => handleScroll(link.id)}
                className={`${styles.a} ${
                  activeSection === link.id ? styles.active : ""
                }`}
              >
                {link.name}
              </button>
            ) : (
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `${styles.a} ${isActive ? styles.active : ""}`
                }
                onClick={() => onNavigate?.()}
              >
                {link.name}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
