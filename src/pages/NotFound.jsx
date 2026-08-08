import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/NotFound.module.css";
import PageHelmet from "../components/PageHelmet";
import SectionDevider from "../components/SectionDevider";
import PageTopHeading from "../components/PageTopHeading";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";
import LogoImg from "../assets/icons/logo-black.svg";
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
        <PageTopHeading
          icon={LogoImg}
          title={
            <>
              Not found: <br />
              error: 404
            </>
          }
          textAlign="start"
          centerContent="start"
        />

        <div className={styles.card}>
          <p
            className={styles.label}
            style={{
              color: "#ff8d8d",
            }}
          >
            The page you were looking for might not <br />
            exist or has been temporarly removed.
          </p>

          <BtnCTAWhiteSmall buttonText={"Back to home"} href={"/"} />
        </div>
      </div>
    </div>
  );
}
