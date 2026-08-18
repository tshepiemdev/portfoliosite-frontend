import styles from "../styles/SearchBar.module.css";
import searchImg from "../assets/icons/search.svg";
import clearImg from "../assets/icons/close.svg";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  setMarginTop = 0,
  setMarginBottom = 0,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  const handleClear = () => {
    onChange("");
    onSearch?.("");
  };

  return (
    <form
      className={styles.searchWrapper}
      style={{
        marginTop: `${setMarginTop}rem`,
        marginBottom: `${setMarginBottom}rem`,
      }}
      onSubmit={handleSubmit}
    >
      <img className={styles.searchImg} src={searchImg} alt="search" />

      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchBar}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        enterKeyHint="search"
      />

      {value && (
        <button type="button" className={styles.clearBtn} onClick={handleClear}>
          <img className={styles.clearImg} src={clearImg} alt="clear" />
        </button>
      )}
    </form>
  );
}
