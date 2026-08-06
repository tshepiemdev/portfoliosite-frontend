import styles from "../styles/TextareaInput.module.css";
import ErrorImg from "../assets/icons/exclamation2.svg";
import { forwardRef } from "react";

const TextareaInput = forwardRef(function TextareaInput(
  {
    label,
    name,
    value,
    onChange,
    placeholder,
    rows = 5,
    disabled = false,
    id,
    error,
  },
  ref,
) {
  const inputId = id || name;

  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.inputLabel}>
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={styles.textareaField}
      />

      {error && (
        <div className={styles.inputErrorWrapper}>
          <img className={styles.errorImg} src={ErrorImg} alt="error" />
          <p className={styles.inputErrorText}>{error}</p>
        </div>
      )}
    </div>
  );
});

export default TextareaInput;
