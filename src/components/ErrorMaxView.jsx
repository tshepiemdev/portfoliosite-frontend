import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/ErrorMaxView.module.css";
import PageHelmet from "./PageHelmet";
import SectionDevider from "./SectionDevider";
import PageTopHeading from "./PageTopHeading";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import LogoImg from "../assets/icons/logo-black.svg";
import ErrorImg from "../assets/icons/triangle-warning-black.svg";
import InternetErrorImg from "../assets/icons/no-network.svg";
import ServerErrorImg from "../assets/icons/thunderstorm-risk (1).svg";
import chevronImg from "../assets/icons/chevron-down.svg";

export default function ErrorMaxView({
  errType,
  errorText,
  errorSubtext,
  onRetry,
}) {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  const icons = {
    network: InternetErrorImg,
    server: ServerErrorImg,
    default: ErrorImg,
  };

  const getIcon = () => {
    if (!navigator.onLine) return icons.network;
    if (errType === "network") return icons.network;
    if (errType === "server") return icons.server;
    return icons.default;
  };

  const icon = getIcon();

  const getDefaults = () => {
    if (!navigator.onLine || errType === "network") {
      return {
        title: (
          <>
            Oops! Looks like <br />
            you're offline
          </>
        ),
        subtext: (
          <>
            Please check your internet <br />
            connection and retry.
          </>
        ),
      };
    }

    if (errType === "server") {
      return {
        title: "Can't reach server",
        subtext: (
          <>
            Oops! The server couldn’t be reached.
            <br />
            Please try again shortly.
          </>
        ),
      };
    }

    return {
      title: (
        <>
          Something <br />
          went wrong
        </>
      ),
      subtext: <>Please try again later.</>,
    };
  };

  const getTroubleshootingSteps = () => {
    if (!navigator.onLine || errType === "network") {
      return [
        "Check that your internet connection is active.",
        "Try opening another website to confirm you're online.",
        "Restart your Wi-Fi or mobile data.",
        "Disable any VPN or proxy.",
        "Press 'Try again' once you're back online.",
      ];
    }

    if (errType === "server") {
      return [
        "Wait a few moments and try again.",
        "Refresh the page.",
        "Check that your internet connection is stable.",
        "The server may be temporarily unavailable.",
        <>
          If the problem continues,{" "}
          <Link to="/contact?reason=support" className={styles.supportLink}>
            contact support
          </Link>
          .
        </>,
      ];
    }

    return [
      "Refresh the page.",
      "Clear your browser cache.",
      "Restart your browser.",
      "Try another browser or device.",
      <>
        <Link to="/contact?reason=support" className={styles.supportLink}>
          Contact support
        </Link>{" "}
        if the issue persists.
      </>,
    ];
  };

  const defaults = getDefaults();
  const troubleshootingSteps = getTroubleshootingSteps();

  return (
    <div className={styles.errorMaxView}>
      <div className={styles.errorContentWrapper}>
        <PageTopHeading
          icon={icon}
          title={errorText || defaults.title}
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
            {errorSubtext || defaults.subtext}
          </p>

          {onRetry && (
            <BtnCTAWhiteSmall buttonText="Try again" onClick={onRetry} />
          )}
        </div>

        <div className={styles.wrapper}>
          <span className={styles.spanText}>Troubleshooting</span>

          <ol className={styles.troubleshootList}>
            {troubleshootingSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
