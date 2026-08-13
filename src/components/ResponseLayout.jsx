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

  return (
    <div className={styles.layout}>
      {isLoading ? (
        <LoaderView setHeight={50} />
      ) : (
        <div className={styles.responseWrapper}>
          <div className={styles.iconWrapper}>
            <img className={styles.icon} src={resolvedImg} alt={resolvedAlt} />
          </div>

          <div className={styles.textsWrapper}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          <div className={styles.ctasWrapper}>
            {isSuccess && (
              <BtnCTABlack buttonText="Okay Got It" onClick={onSuccess} />
            )}

            {isError && (
              <>
                <BtnCTAWhite buttonText="Resubmit message" onClick={onRetry} />
                <BtnCTABlack buttonText="Cancel" onClick={onError} />
              </>
            )}

            {isNetwork && (
              <>
                <BtnCTAWhite buttonText="Retry submission" onClick={onRetry} />
                <BtnCTABlack buttonText="Cancel" onClick={onError} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
