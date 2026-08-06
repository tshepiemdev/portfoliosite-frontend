import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/NotFound.module.css";
import ErrorImg from "../assets/icons/logo-black.svg";
import PageHelmet from "../components/PageHelmet";
import SectionDevider from "../components/SectionDevider";
import BtnCTAWhite from "../components/BtnCTAWhite";
import BackArrowImg from "../assets/icons/back_arrow.svg";
import ogImages from "../config/ogImages";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <PageHelmet
        title="Page not found"
        description="The page you were looking for might not exist or has been temporarly removed."
        image={ogImages.notFound}
        url={window.location.href}
        keywords="page not found"
        robots="noindex, nofollow"
        siteName=""
      />

      <div className={styles.errorContentWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.errorImgWrapper}>
            <img className={styles.notFoundImg} src={ErrorImg} alt="error" />
          </div>
        </div>

        <div className={styles.wrapper}>
          <h1 className={styles.h1}>Oops!</h1>
          <h2 className={styles.h2}>
            I couldn't find the page
            <br />
            you were looking for
          </h2>
          <p className={styles.p}>
            The page you were looking for might not <br />
            exist or has been temporarly removed. <br />
            Error code [404]
          </p>

          <BtnCTAWhite buttonText={"Go home"} href={"/"} />
        </div>
      </div>
    </div>
  );
}
