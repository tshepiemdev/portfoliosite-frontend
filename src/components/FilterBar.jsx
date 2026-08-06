import { useState, useEffect, useRef, useMemo } from "react";
import styles from "../styles/FilterBar.module.css";

export default function FilterBar({
  categories = [],
  defaultCategory = "All",
  onFilterChange,
  marginTop = 0,
  marginBottom = 0,
}) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const listRef = useRef(null);
  const buttonRefs = useRef({});

  const finalCategories = useMemo(() => {
    const normalizedCategories = Array.isArray(categories)
      ? categories.filter(Boolean)
      : [];

    return normalizedCategories.includes("All")
      ? normalizedCategories
      : ["All", ...normalizedCategories];
  }, [categories]);

  useEffect(() => {
    setActiveCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeBtn = buttonRefs.current[activeCategory];
      const list = listRef.current;

      if (!activeBtn || !list) return;

      const btnRect = activeBtn.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();

      setIndicatorStyle({
        width: `${btnRect.width}px`,
        transform: `translateX(${btnRect.left - listRect.left}px)`,
      });
    };

    updateIndicator();

    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeCategory, finalCategories]);

  const handleClick = (category) => {
    setActiveCategory(category);
    onFilterChange?.(category);

    buttonRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        marginTop: `${marginTop}rem`,
        marginBottom: `${marginBottom}rem`,
      }}
    >
      <nav className={styles.nav}>
        <ul ref={listRef} className={styles.ul}>
          <div className={styles.indicator} style={indicatorStyle} />

          {finalCategories.map((category) => (
            <li key={category} className={styles.li}>
              <button
                ref={(el) => (buttonRefs.current[category] = el)}
                className={`${styles.a} ${
                  activeCategory === category ? styles.active : ""
                }`}
                onClick={() => handleClick(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
