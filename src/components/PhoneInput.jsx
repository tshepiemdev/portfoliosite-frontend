import styles from "../styles/PhoneInput.module.css";
import ErrorImg from "../assets/icons/exclamation2.svg";
import { forwardRef } from "react";

import { getCountries, getCountryCallingCode } from "libphonenumber-js/min";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

const phoneCodes = getCountries()
  .map((country) => {
    const name = countries.getName(country, "en");

    return {
      iso: country,
      name: name || country,
      code: `+${getCountryCallingCode(country)}`,
    };
  })
  .filter((c) => c.name && c.code)
  .sort((a, b) => a.name.localeCompare(b.name));

const getPlaceholder = (code) => {
  switch (code) {
    case "+27":
      return "(072) 000 000";
    case "+1":
      return "(201) 555 0123";
    case "+44":
      return "7123 456 789";
    case "+91":
      return "98765 43210";
    default:
      return "123 456 789";
  }
};

const PhoneInput = forwardRef(function PhoneInput(
  {
    label,
    name,
    value = { iso: "ZA", code: "+27", number: "" },
    onChange,
    id,
    error,
  },
  ref,
) {
  const inputId = id || name;

  const handleCountryChange = (e) => {
    const iso = e.target.value;
    const selected = phoneCodes.find((c) => c.iso === iso);

    onChange({
      ...value,
      iso,
      code: selected?.code || "+27",
    });
  };

  const handleNumberChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");

    onChange({
      ...value,
      number: onlyNumbers,
    });
  };

  return (
    <div className={styles.phoneWrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.inputLabel}>
          {label}
        </label>
      )}

      <div className={styles.phoneRow}>
        <select
          className={styles.phoneSelect}
          value={value.iso}
          onChange={handleCountryChange}
        >
          {phoneCodes.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>

        <input
          ref={ref}
          id={inputId}
          type="tel"
          name={name}
          value={value.number}
          onChange={handleNumberChange}
          placeholder={getPlaceholder(value.code)}
          className={`${styles.phoneInput} ${
            error ? styles.phoneInputError : ""
          }`}
        />
      </div>

      {error && (
        <div className={styles.inputErrorWrapper}>
          <img className={styles.errorImg} src={ErrorImg} alt="error" />
          <p className={styles.inputErrorText}>{error}</p>
        </div>
      )}
    </div>
  );
});

export default PhoneInput;
