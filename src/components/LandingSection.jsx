import { Link } from "react-router-dom";
import styles from "../styles/LandingSection.module.css";
import HeroHeadingText from "./HeroHeaderText";
import SubHeaderText from "./SubHeaderHeroText";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTABlack from "./BtnCTABlack";
import ArrowImg from "../assets/icons/arrow-narrow-next.svg";
import LogoImg from "../assets/icons/logo-white.svg";

export default function LandingSection() {
  return (
    <section className={styles.landingSection}>
      <div className={styles.overlay}>
        <Link className={styles.badge} to="/projects">
          <img
            className={styles.badgeIcon}
            src={LogoImg}
            alt=""
            width="24"
            height="24"
          />

          <span className={styles.message}>Solutions I've built</span>

          <img
            className={styles.nextIcon}
            src={ArrowImg}
            alt=""
            width="24"
            height="24"
          />
        </Link>

        <HeroHeadingText />
        <SubHeaderText />

        <div className={styles.heroButtonsWrapper}>
          <BtnCTAWhite buttonText="Hire me" href="/hire-me" fullWidth />
          <BtnCTABlack buttonText="Get resume" href="/resume" fullWidth />
        </div>
      </div>
    </section>
  );
}
