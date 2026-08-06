import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LargeBanner.module.css";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTABlack from "./BtnCTABlack";
import MyLogoImg from "../assets/icons/logo.svg";
import WriteImg from "../assets/icons/terminal (1).svg";
import CreativeImg from "../assets/icons/spark.svg";
import Logo from "./Logo";
import SectionHeading from "./SectionHeading";

export default function LargeBanner() {
  return (
    <div className={styles.bannerWrapper}>
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
      <BtnCTAWhite buttonText={"Hire me now"} href={"/hire-me"} />
    </div>
  );
}
