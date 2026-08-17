import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import styles from "../styles/SubscribeLayout.module.css";
import LogoIcon from "./LogoIcon";
import mailIcon from "../assets/icons/envelope.svg";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";
import API_URL from "../config/api";
import LoaderView from "../components/Loader";
import successIcon from "../assets/icons/badge.svg";
import BtnCTABlackSmall from "../components/BtnCTABlackSmall";

export default function SubscribeLayout({ onSuccess, setDisableClose }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLocalLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const turnstileRef = useRef(null);

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/subscriptions/count`);

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setSubscriberCount(data?.count || 0);
      } catch {}
    };

    fetchSubscriberCount();
  }, []);

  useEffect(() => {
    if (subscriberCount <= 50) {
      setShowCount(false);
      return;
    }

    const interval = setInterval(() => {
      setShowCount((prev) => !prev);
    }, 6000);

    return () => clearInterval(interval);
  }, [subscriberCount]);

  const resetTurnstile = () => {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

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

      onSuccess();
    } catch {}
  };

  const checkEmailStatus = async (emailId) => {
    const maxAttempts = 30;
    const interval = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const res = await fetch(
          `${API_URL}/api/subscriptions/email-status/${encodeURIComponent(
            emailId,
          )}`,
        );

        if (res.ok) {
          const data = await res.json();
          const status = data?.status;

          if (status === "bounced") {
            setLocalLoading(false);
            setSuccess(false);
            setMessage("Couldn't reach this email address.");
            setDisableClose(false);
            resetTurnstile();
            return;
          }

          if (status === "failed") {
            setLocalLoading(false);
            setSuccess(false);
            setMessage("Couldn't deliver to this email address.");
            setDisableClose(false);
            resetTurnstile();
            return;
          }

          if (status === "complained") {
            setLocalLoading(false);
            setSuccess(false);
            setMessage("Couldn't complete the subscription.");
            setDisableClose(false);
            resetTurnstile();
            return;
          }

          if (status === "delivered") {
            setEmail("");
            setWebsite("");
            resetTurnstile();
            setLocalLoading(false);
            setSuccess(true);
            setMessage("");
            setDisableClose(true);
            return;
          }
        }
      } catch {}

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    setLocalLoading(false);
    setSuccess(true);
    setMessage("");
    setDisableClose(true);
  };

  const handleSubscribe = async () => {
    if (loading) {
      return;
    }

    const value = email.trim();

    setMessage("");

    if (!value) {
      setMessage("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!navigator.onLine) {
      setMessage(
        <>
          You're offline. Please check your internet <br />
          connection and try again.
        </>,
      );
      return;
    }

    if (!turnstileToken) {
      setMessage("Please complete the verification.");
      return;
    }

    try {
      setLocalLoading(true);
      setDisableClose(true);

      const res = await fetch(`${API_URL}/api/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: value,
          website,
          turnstile_token: turnstileToken,
        }),
      });

      const text = await res.text();

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Couldn't process the server response.");
        }
      }

      if (!res.ok) {
        throw new Error(
          data?.message || "Couldn't complete your subscription.",
        );
      }

      if (data?.success === false) {
        throw new Error(
          data?.message || "Couldn't complete your subscription.",
        );
      }

      if (!data?.emailId) {
        throw new Error("Couldn't track the confirmation email.");
      }

      await checkEmailStatus(data.emailId);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Couldn't complete your subscription.";

      setMessage(errorMessage);
      setSuccess(false);
      setDisableClose(false);
      setLocalLoading(false);
      resetTurnstile();
    }
  };

  const footerText =
    subscriberCount > 50 && showCount ? (
      `${subscriberCount}+ subscribers`
    ) : (
      <>
        No spam. Unsubscribe anytime.
        <br />
        <Link
          to="/legal/tshepiemdev-website-blog-subscription-terms"
          className={styles.termsLink}
        >
          Subscription terms
        </Link>{" "}
        apply.
      </>
    );

  return (
    <div className={styles.layout}>
      {!success && !loading && (
        <div className={styles.wrapper}>
          <LogoIcon size={2} />

          <h4 className={styles.title}>
            Subscribe, stay in <br />
            the loop with articles
          </h4>

          <p className={styles.label}>
            Get new articles delivered <br />
            right into your inbox.
          </p>
        </div>
      )}

      {loading ? (
        <div className={styles.responseWrapper}>
          <LoaderView
            text={
              <>
                Hang tight, <br />
                I'm processing <br />
                your request
              </>
            }
            setHeight={40}
          />
        </div>
      ) : success ? (
        <div className={styles.responseWrapper}>
          <img className={styles.successIcon} src={successIcon} alt="success" />

          <p className={styles.successLabel}>
            Check your email <br />
            to confirm your blog <br />
            subscription.
          </p>

          <BtnCTAWhiteSmall
            buttonText="Open emails"
            fullWidth
            onClick={openEmailProvider}
          />

          <BtnCTABlackSmall
            buttonText="Close"
            fullWidth
            onClick={() => {
              setDisableClose(false);
              onSuccess();
            }}
          />
        </div>
      ) : (
        <div className={styles.controlsWrapper}>
          <input
            type="text"
            value={website}
            tabIndex="-1"
            autoComplete="off"
            style={{ display: "none" }}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <div className={styles.inputWrapper}>
            <img className={styles.emailIcon} src={mailIcon} alt="email" />

            <input
              className={styles.input}
              type="email"
              value={email}
              placeholder="Enter your email here..."
              autoComplete="email"
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);

                if (message) {
                  setMessage("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubscribe();
                }
              }}
            />
          </div>

          <div
            className={styles.turnstileWrapper}
            style={{
              display: turnstileToken ? "none" : "block",
            }}
          >
            <Turnstile
              ref={turnstileRef}
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={(token) => {
                setTurnstileToken(token);
              }}
              onExpire={() => {
                setTurnstileToken("");
              }}
              onError={() => {
                setTurnstileToken("");
              }}
              options={{
                theme: "light",
                size: "flexible",
              }}
            />
          </div>

          <BtnCTAWhiteSmall
            buttonText="Subscribe"
            fullWidth
            onClick={handleSubscribe}
          />

          {message && (
            <p
              className={styles.errorlabel}
              style={{
                color: "#ff8d8d",
                fontSize: "0.8rem",
                maxWidth:"250px"
              }}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {footerText && !loading && (
        <div className={styles.footerTextWrapper}>
          <p className={styles.termsLabelWrapper}>{footerText}</p>
        </div>
      )}
    </div>
  );
}
