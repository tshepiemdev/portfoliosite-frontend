import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "../styles/SubscribeVerify.module.css";
import LoaderView from "../components/Loader";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import PageTopHeading from "../components/PageTopHeading";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";
import LogoImg from "../assets/icons/logo-black.svg";

export default function SubscribeVerify({ onSuccess }) {
  const { token } = useParams();
  const location = useLocation();

  const isUnsubscribe = location.pathname.includes("unsubscribe");

  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);
  const [message, setMessage] = useState("");
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const handleSubscriptionAction = async () => {
    if (!token) {
      setErrorType("default");
      setMessage(
        isUnsubscribe
          ? "Invalid unsubscribe link."
          : "Invalid verification link.",
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorType(null);
      setMessage("");
      setAlreadyVerified(false);

      const endpoint = isUnsubscribe
        ? `${API_URL}/api/subscriptions/unsubscribe/${token}`
        : `${API_URL}/api/subscriptions/verify/${token}`;

      const res = await fetch(endpoint);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response.");
      }

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (isUnsubscribe ? "Unsubscribe failed." : "Verification failed."),
        );
      }

      setAlreadyVerified(data?.data?.alreadyVerified || false);

      setMessage(
        data.message ||
          (isUnsubscribe
            ? "You have successfully unsubscribed from blog updates."
            : "Your email has been verified. You will now receive new articles."),
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (!navigator.onLine) {
        setErrorType("network");
        setMessage("No internet connection. Please try again.");
      } else if (err instanceof TypeError) {
        setErrorType("server");
        setMessage("Unable to connect to the server. Please try again.");
      } else {
        setErrorType("default");
        setMessage(err.message || "Request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubscriptionAction();
  }, [token]);

  return (
    <div className={styles.wrapper}>
      <PageHelmet
        title={
          isUnsubscribe
            ? "Blog subscription cancellation"
            : "Blog subscription verification"
        }
        description={
          isUnsubscribe
            ? "Manage your tshepiem.dev blog subscription."
            : "Confirm your subscription to receive new articles from tshepiem.dev."
        }
        robots="noindex, nofollow"
        url={typeof window !== "undefined" ? window.location.href : ""}
        siteName=""
      />

      <div className={styles.contentWrapper}>
        <PageTopHeading
          icon={LogoImg}
          title={
            <>
              Blog subscription <br />
              {isUnsubscribe ? "unsubscribe" : "verification"}
            </>
          }
          subtext={<></>}
          textAlign="start"
          centerContent="start"
        />

        {loading && (
          <div className={styles.card}>
            <LoaderView />
          </div>
        )}

        {!loading && errorType && (
          <div className={styles.card}>
            <p
              className={styles.label}
              style={{
                color: "#ff8d8d",
              }}
            >
              {message}
            </p>

            <BtnCTAWhiteSmall
              buttonText="Retry"
              onClick={handleSubscriptionAction}
            />
          </div>
        )}

        {!loading && !errorType && (
          <div className={styles.card}>
            <p
              className={styles.label}
              style={{
                color: isUnsubscribe
                  ? "#ff8d8d"
                  : alreadyVerified
                    ? "#ffd36b"
                    : "#8fff8d",
              }}
            >
              {isUnsubscribe
                ? "Subscription Cancelled"
                : alreadyVerified
                  ? "Already Confirmed"
                  : "Subscription Confirmed"}
            </p>

            <p className={styles.termsLabel}>
              {message}

              {!isUnsubscribe && (
                <>
                  {" "}
                  By confirming your subscription, you acknowledge that you have
                  read and agreed to the{" "}
                  <a
                    href="/legal/tshepiemdev-website-blog-subscription-terms"
                    style={{
                      color: "inherit",
                      textDecoration: "underline",
                    }}
                  >
                    terms
                  </a>{" "}
                  and understand that your email address will be used to deliver
                  blog updates, articles, and related communications from
                  tshepiem.dev. You can unsubscribe at any time using the
                  unsubscribe link included in future emails.
                </>
              )}

              {isUnsubscribe && (
                <>
                  {" "}
                  Your email address has been removed from active blog
                  communications. You will no longer receive new article updates
                  or subscription emails from tshepiem.dev. If you decide to
                  receive updates again in the future, you may subscribe again
                  at any time.
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
