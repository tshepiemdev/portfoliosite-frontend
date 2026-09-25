import styles from "../styles/ResponseLayout.module.css";
import SuccessImg from "../assets/icons/badge.svg";
import ErrorImg from "../assets/icons/triangle-warning-red.svg";
import InternetErrorImg from "../assets/icons/no-network-white.svg";
import FallbackImg from "../assets/icons/logo-white.svg";
import BtnCTABlack from "./BtnCTABlack";
import BtnCTAWhite from "./BtnCTAWhite";
import LoaderView from "./Loader";

export default function ResponseLayout({
  status,
  title,
  subtitle,
  email,
  onSuccess,
  onError,
  onRetry,
}) {
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";
  const isNetwork = status === "network";

  const resolvedImg =
    {
      success: SuccessImg,
      error: ErrorImg,
      network: InternetErrorImg,
    }[status] || FallbackImg;

  const resolvedAlt =
    {
      success: "Success",
      error: "Error",
      network: "No internet connection",
    }[status] || "Response";

  const resolvedTitle =
    title ||
    {
      error: "Something went wrong",
      network: "You're offline",
    }[status] ||
    "Please wait";

  const resolvedSubtitle =
    subtitle ||
    {
      error: "We couldn't send your message. Please try again.",
      network:
        "Your message wasn't sent because your internet connection was unavailable.",
    }[status] ||
    "";

  return (
    <div className={styles.layout}>
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <LoaderView
            text={
              <>
                Sending your message
                <br />
                Please wait a moment
              </>
            }
            setHeight={50}
            circleVariant="dynamic"
          />
        </div>
      ) : (
        <div className={styles.responseWrapper}>
          <div className={styles.iconWrapper}>
            <img className={styles.icon} src={resolvedImg} alt={resolvedAlt} />
          </div>

          <div className={styles.textsWrapper}>
            <h2 className={styles.title}>{resolvedTitle}</h2>

            <p className={styles.subtitle}>
              {resolvedSubtitle}

              {isSuccess && email && (
                <>
                  {" "}
                  We’ll get back to you at{" "}
                  <span className={styles.email}>{email}</span>.
                </>
              )}
            </p>
          </div>

          <div className={styles.ctasWrapper}>
            {isSuccess && (
              <BtnCTAWhite buttonText="Okay, got it" onClick={onSuccess} setRadius={90}/>
            )}

            {isError && (
              <>
                <BtnCTAWhite buttonText="Try again" onClick={onRetry} />

                <BtnCTABlack buttonText="Go back" onClick={onError} />
              </>
            )}

            {isNetwork && (
              <>
                <BtnCTAWhite buttonText="Try again" onClick={onRetry} />

                <BtnCTABlack buttonText="Go back" onClick={onError} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
