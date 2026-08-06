import styles from "../styles/SearchBar.module.css";
import searchImg from "../assets/icons/search.svg";
import clearImg from "../assets/icons/close.svg";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className={styles.searchWrapper}>
      <img className={styles.searchImg} src={searchImg} alt="search" />

      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchBar}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => onChange("")}
        >
          <img className={styles.clearImg} src={clearImg} alt="clear" />
        </button>
      )}
    </div>
  );
}
