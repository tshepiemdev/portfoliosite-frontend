import styles from "../styles/TextInput.module.css";
import ErrorImg from "../assets/icons/triangle-warning-red.svg";
import { forwardRef } from "react";

const TextInput = forwardRef(function TextInput(
  {
    label,
    type = "text",
    name,
    value,
    placeholder,
    onChange,
    required = false,
    disabled = false,
    autocomplete = "off",
    id,
    error,
  },
  ref,
) {
  const inputId = id || name;

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.inputLabel}>
          {label} {required && <span className={styles.requiredStar}>*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autocomplete}
        className={`${styles.inputField} ${error ? styles.inputFieldError : ""}`}
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

export default TextInput;
