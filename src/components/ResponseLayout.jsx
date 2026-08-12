import styles from "../styles/ResponseLayout.module.css";
import SuccessImg from "../assets/icons/badge.svg";
import ErrorImg from "../assets/icons/triangle-warning-red.svg";
import InternetErrorImg from "../assets/icons/no-network.svg";
import FallbackImg from "../assets/icons/logo-white.svg";
import BtnCTABlackSmall from "./BtnCTABlackSmall";
import LoaderView from "./Loader";
import AnimatedBentoGrid from "./AnimatedBentoGrid";

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

  return (
    <div className={styles.layout}>
      {isLoading ? (
        <LoaderView
          text={
            <>
              Hang tight, processing
              <br />
              your message
            </>
          }
          setHeight={30}
          bg={"#1a1a1a"}
          border={"1px solid #1f1f1f"}
          radius={0.5}
        />
      ) : (
        <div className={styles.responseWrapper}>
            <div className={styles.wrapper}>
              <div className={styles.iconWrapper}>

              </div>
            <img
              className={styles.messageImg}
              src={resolvedImg}
              alt="response"
            />

            <h2 className={styles.title}>{title}</h2>

            <p className={styles.subtitle}>{subtitle}</p>

            <div className={styles.ctasWrapper}>
              <BtnCTABlackSmall
                buttonText="Close"
                fullWidth
                onClick={onClose}
              />
            </div>
          </div>

          <div className={styles.wrapper}>
            {isSuccess && (
              <AnimatedBentoGrid
                width={"100%"}
                height={"100%"}
                showLinkTo={false}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
