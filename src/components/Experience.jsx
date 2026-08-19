import { useState } from "react";
import styles from "../styles/Experience.module.css";
import DownImg from "../assets/icons/chevron-down.svg";
import CheckImg from "../assets/icons/check2.svg";
import StarImg from "../assets/icons/logo-white.svg";

export default function ExperienceBox({
  company,
  position,
  from,
  to,
  location,
  responsibilities,
  order,
}) {
  const [isOpen, setIsOpen] = useState(order === 1);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  const parseMonthYear = (str) => {
    if (!str) return null;

    const [monthName, year] = str.split(",").map((s) => s.trim());
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

    return new Date(Number(year), monthIndex, 1);
  };

  const calculateTimelapse = (start, end) => {
    const fromDate = parseMonthYear(start);

    const toDate =
      !end || end.toLowerCase() === "present"
        ? new Date()
        : parseMonthYear(end);

    if (!fromDate || !toDate || isNaN(fromDate) || isNaN(toDate)) {
      return "0 m";
    }

    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (months >= 11) {
      years++;
      months = 0;
    }

    const yearText = years > 0 ? `${years} yr${years > 1 ? "s" : ""}` : "";
    const monthText = months > 0 ? `${months} m` : "";

    return (
      `${yearText}${yearText && monthText ? " " : ""}${monthText}` || "0 m"
    );
  };

  const timelapse = calculateTimelapse(from, to);

  return (
    <div className={`${styles.experienceBox} ${isOpen ? styles.open : ""}`}>
      <div
        className={styles.topWrapper}
        onClick={toggleAccordion}
        role="button"
        tabIndex={0}
      >
        <div className={styles.experienceBoxMeta}>
          {position && <h1 className={styles.position}>{position}</h1>}

          {company && (
            <div className={styles.wrapper}>
              <img className={styles.starImg} src={StarImg} alt={company} />
              <h2 className={styles.company}>{company}</h2>
            </div>
          )}

          <div className={styles.durationWrapper}>
            <p className={styles.from}>{from}</p>
            <p className={styles.dash}>–</p>
            <p className={styles.to}>{to || "Present"}</p>
            <p className={styles.timelapse}>({timelapse})</p>
          </div>

          <p className={styles.location}>{location}</p>
        </div>

        <img
          className={`${styles.chevronImg} ${isOpen ? styles.rotate : ""}`}
          src={DownImg}
          alt="dropdown"
        />
      </div>

      <div
        className={`${styles.bottomWrapper} ${
          isOpen ? styles.open : styles.closed
        }`}
      >
        <hr className={styles.hr} />

        <h2 className={styles.heading}>Duties & responsibilities</h2>

        <ul className={styles.dutiesWrapper}>
          {responsibilities?.map((item, index) => (
            <li className={styles.duty} key={index}>
              <img className={styles.checkImg} src={CheckImg} alt="check" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
