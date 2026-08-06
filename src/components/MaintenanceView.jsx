import styles from "../styles/MaintenanceView.module.css";
import Logo from "./Logo";
import SocialIconsWrapper from "./SocialIconsWrapper";
import GearImg from "../assets/icons/wrench-fill.svg";
import BtnCTABlack from "./BtnCTABlack";

export default function MaintenanceView({ data }) {
  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.rowWrapper}>
        <Logo />
        {/* <SocialIconsWrapper
          only={["Twitter", "Instagram", "GitHub", "LinkedIn"]}
          filter="invert(1)"
        /> */}
      </div>

      <div className={styles.columnWrapper}>
        <img className={styles.img} src={GearImg} alt={data?.title} />

        <h2 className={styles.title}>{data?.title}</h2>

        <h2 className={styles.subtext}>{data?.message}</h2>

        {data?.ctaText && data?.ctaLink && (
          <BtnCTABlack buttonText={data.ctaText} href={data.ctaLink} />
        )}
      </div>
    </div>
  );
}
