import styles from "../styles/RadioCard.module.css";
import checkIcon from "../assets/icons/check2.svg"; 

export default function RadioCard({
  name,
  value,
  selectedValue,
  onChange,
  title,
  description,
  imgIcon,
}) {
  const selected = selectedValue === value;

  return (
    <label className={styles.label}>
      <div className={styles.imgIconWrapper}>
        <img className={styles.imgIcon} src={imgIcon} alt="team size"/>
      </div>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>

      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className={styles.input}
      />

      {/* Custom check */}
      <div className={styles.checkWrapper}>
        {selected && (
          <img src={checkIcon} alt="selected" className={styles.checkIcon} />
        )}
      </div>
    </label>
  );
}
