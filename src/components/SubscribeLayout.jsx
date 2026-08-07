import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/subscriptions/count`);
        const data = await res.json();

        if (res.ok) {
          setSubscriberCount(data.count || 0);
        }
      } catch {}
    };

    fetchSubscriberCount();
  }, []);

  useEffect(() => {
    if (subscriberCount <= 50) return;

    const interval = setInterval(() => {
      setShowCount((prev) => !prev);
    }, 6000);

    return () => clearInterval(interval);
  }, [subscriberCount]);

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

  const handleSubscribe = async () => {
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
        }),
      });

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      setEmail("");
      setSuccess(true);
      setDisableClose(true);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Subscription failed");
      setDisableClose(false);
    } finally {
      setLocalLoading(false);
    }
  };

  const footerText =
    subscriberCount > 50 && showCount ? (
      `${subscriberCount}+ subscribers`
    ) : (
      <>
        No spam. Unsubscribe anytime.
        <br />
        <Link to="/legal/tshepiemdev-website-blog-subscription-terms" className={styles.termsLink}>
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
                Hang tight, processing <br />
                your subscription
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

          <p className={styles.label}>{footerText}</p>
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
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubscribe();
                }
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
              className={styles.label}
              style={{
                color: "#ff8d8d",
              }}
            >
              {message}
            </p>
          )}

          <p className={styles.termsLabelWrapper}>{footerText}</p>
        </div>
      )}
    </div>
  );
}
