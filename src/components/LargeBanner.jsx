import styles from "../styles/LargeBanner.module.css";
import BtnCTAWhite from "./BtnCTAWhite";
import Logo from "./Logo";
import SectionHeading from "./SectionHeading";

export default function LargeBanner() {
  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.backgroundImages} />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <Logo isClickable={false} />

        <SectionHeading
          title={
            <>
              Creative, skilled <br />& project ready <br />
              developer.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <BtnCTAWhite buttonText="Hire me now" href="/hire-me" setRadius={90}/>
      </div>
    </div>
  );
}
