import { useState, forwardRef } from "react";
import styles from "../styles/TeamSizeRadioGroup.module.css";
import RadioCard from "./RadioCard";
import pplgroupImg from "../assets/icons/people-group.svg";
import personImg from "../assets/icons/person-simple.svg";
import ErrorImg from "../assets/icons/exclamation2.svg";

const TeamSizeRadioGroup = forwardRef(function TeamSizeRadioGroup(
  { value, onChange, error },
  ref,
) {
  const options = [
    {
      value: "solo",
      title: "Just me",
      description: "I'm reaching out independently.",
      imgIcon: personImg,
    },
    {
      value: "team",
      title: "Team / Company",
      description: "I'm part of a team or organization.",
      imgIcon: pplgroupImg,
    },
  ];

  const [internalValue, setInternalValue] = useState(options[0].value);

  const selected = value ?? internalValue;

  const handleChange = (val) => {
    if (onChange) {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <h4 className={styles.heading}>How big is your team?</h4>
      <p className={styles.subHeading}>
        I've worked with solo creators, startups and multiple companies
      </p>
      <div
        className={`${styles.radiosWrapper} ${
          error ? styles.radiosWrapperError : ""
        }`}
      >
        {options.map((opt) => (
          <RadioCard
            key={opt.value}
            name="team-size"
            value={opt.value}
            selectedValue={selected}
            onChange={handleChange}
            title={opt.title}
            description={opt.description}
            imgIcon={opt.imgIcon}
          />
        ))}
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

export default TeamSizeRadioGroup;
