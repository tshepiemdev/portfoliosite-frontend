import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LandingSection.module.css";
import HeroHeadingText from "./HeroHeaderText";
import SubHeaderText from "./SubHeaderHeroText";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTABlack from "./BtnCTABlack";
import BgImg from "../assets/images/tshepang.jpg";
import ArrowImg from "../assets/icons/arrow-narrow-next.svg";
import LogoImg from "../assets/icons/logo-white.svg";

export default function LandingSection() {
  return (
    <div
      className={styles.landingSection}
      style={{ backgroundImage: `url(${""})` }}
    >
      <div className={styles.overlay}>
        <Link className={styles.badge} to={"/projects"}>
          <img
            className={styles.badgeIcon}
            src={LogoImg}
            alt="tshepiem.dev, Solutions I've build"
          />

          <p className={styles.message}>Solutions I've build</p>
          <img className={styles.nextIcon} src={ArrowImg} alt="open work" />
        </Link>

        <HeroHeadingText />
        <SubHeaderText />

        <div className={styles.heroButtonsWrapper}>
          <BtnCTAWhite buttonText={"Hire me"} href={"/hire-me"} fullWidth />
          <BtnCTABlack buttonText={"Get resume"} href={"/resume"} fullWidth />
        </div>
      </div>
    </div>
  );
}
