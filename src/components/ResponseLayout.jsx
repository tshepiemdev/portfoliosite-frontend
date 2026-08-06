import styles from "../styles/ResponseLayout.module.css";
import SuccessImg from "../assets/icons/badge.svg";
import ErrorImg from "../assets/icons/triangle-warning-white.svg";
import InternetErrorImg from "../assets/icons/broken-link-white.svg";
import FallbackImg from "../assets/icons/logo-white.svg";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import BtnCTABlackSmall from "./BtnCTABlackSmall";
import LoaderView from "./Loader";

export default function ResponseLayout({ status, title, subtitle, onClose }) {
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isNetwork = status === "network";

  const resolvedImg = isSuccess
    ? SuccessImg
    : isNetwork
      ? InternetErrorImg
      : status === "error"
        ? ErrorImg
        : FallbackImg;

  const openEmailProvider = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Open email app",
          text: "Choose an email application",
        });
      } else {
        window.location.href = "mailto:";
      }

      onClose();
    } catch {}
  };

  return (
    <div className={styles.layout}>
      {isLoading ? (
        <LoaderView
          text={
            <>
              Hang tight, I'm
              <br />
              processing your message
            </>
          }
          setHeight={30}
        />
      ) : (
        <div className={styles.responseWrapper}>
          <img className={styles.messageImg} src={resolvedImg} alt="response" />

          <h2 className={styles.title}>{title}</h2>

          <p className={styles.subtitle}>{subtitle}</p>

          {isSuccess && (
            <div className={styles.ctasWrapper}>
              <BtnCTAWhiteSmall
                buttonText="Open emails"
                fullWidth
                onClick={openEmailProvider}
              />

              <BtnCTABlackSmall
                buttonText="Close"
                fullWidth
                onClick={onClose}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
