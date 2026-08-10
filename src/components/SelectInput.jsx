import styles from "../styles/SelectInput.module.css";
import ErrorImg from "../assets/icons/triangle-warning-red.svg";
import { forwardRef } from "react";

const SelectInput = forwardRef(function SelectInput(
  {
    label,
    name,
    value,
    options = [],
    placeholder = "Select option",
    onChange,
    required = false,
    disabled = false,
    id,
    error,
  },
  ref,
) {
  const inputId = id || name;

  return (
    <div className={styles.selectWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.selectLabel}>
          {label} {required && <span className={styles.requiredStar}>*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${styles.selectSelect} ${
          error ? styles.selectSelectError : ""
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <div className={styles.inputErrorWrapper}>
          <img className={styles.errorImg} src={ErrorImg} alt="error" />
          <p className={styles.inputErrorText}>{error}</p>
        </div>
      )}
    </div>
  );
});

export default SelectInput;
