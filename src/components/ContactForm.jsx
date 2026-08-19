import styles from "../styles/ContactForm.module.css";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import TextareaInput from "./TextareaInput";
import PhoneInput from "./PhoneInput";
import ResponseLayout from "./ResponseLayout";
import BtnCTAWhite from "./BtnCTAWhite";
import BtnCTABlack from "./BtnCTABlack";
import phoneImg from "../assets/icons/phone-flip.svg";
import emailImg from "../assets/icons/envelope.svg";
import contactInfo from "../config/contactInfo";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import API_URL from "../config/api";
import useDetectLocation from "../hooks/useDetectLocation";
import { getCountryCallingCode } from "libphonenumber-js";

countries.registerLocale(enLocale);

const generateRef = () =>
  "M" +
  new Date().toISOString().slice(0, 10).replace(/-/g, "") +
  "-" +
  Math.random().toString(36).substring(2, 10).toUpperCase();

const countryOptions = Object.entries(
  countries.getNames("en", { select: "official" }),
)
  .map(([code, name]) => ({
    value: code,
    label: name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: {
    iso: "ZA",
    code: "+27",
    number: "",
  },
  country: "ZA",
  reason: "",
  message: "",
  teamSize: "",
};

const teamSizeOptions = [
  { value: "solo", label: "Just me" },
  { value: "small", label: "2 - 10 people" },
  { value: "medium", label: "11 - 50 people" },
  { value: "large", label: "51 - 200 people" },
  { value: "enterprise", label: "200+ people" },
];

const reasons = [
  {
    value: "general_inquiry",
    label: "General Inquiry",
  },
  {
    value: "job_opportunity",
    label: "Job Opportunity / Employment",
  },
  {
    value: "collaboration",
    label: "Collaboration / Partnership",
  },
  {
    value: "consultation",
    label: "Technical Consultation",
  },
  {
    value: "career_guidance",
    label: "Career Guidance / Mentorship",
  },
  {
    value: "feedback",
    label: "Website / Service Feedback",
  },
  {
    value: "report",
    label: "Report a Problem",
  },
  {
    value: "support",
    label: "Technical Support",
  },
  {
    value: "review",
    label: "Leave a Review",
  },
  {
    value: "business_inquiry",
    label: "Business Inquiry",
  },
  {
    value: "other",
    label: "Other",
  },
];

export default function ContactForm({ onResponseStatusChange }) {
  const [responseData, setResponseData] = useState({
    title: "",
    subtitle: "",
    status: "",
  });

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const turnstileRef = useRef(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const countryRef = useRef(null);
  const reasonRef = useRef(null);
  const teamSizeRef = useRef(null);
  const messageRef = useRef(null);

  useDetectLocation(setForm);

  const validate = (values) => {
    const newErrors = {};

    if (!values.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!values.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!values.country) {
      newErrors.country = "Please select your country";
    }

    if (!values.reason) {
      newErrors.reason = "Please select a reason";
    }

    if (!values.teamSize) {
      newErrors.teamSize = "Please select team size";
    }

    if (values.message.length > 1000) {
      newErrors.message = "Length limit reached";
    }

    return newErrors;
  };

  const focusFirstError = (validationErrors) => {
    if (validationErrors.firstName) {
      return firstNameRef.current?.focus();
    }

    if (validationErrors.lastName) {
      return lastNameRef.current?.focus();
    }

    if (validationErrors.email) {
      return emailRef.current?.focus();
    }

    if (validationErrors.phone) {
      return phoneRef.current?.focus();
    }

    if (validationErrors.country) {
      return countryRef.current?.focus();
    }

    if (validationErrors.reason) {
      return reasonRef.current?.focus();
    }

    if (validationErrors.teamSize) {
      return teamSizeRef.current?.focus();
    }

    if (validationErrors.message) {
      return messageRef.current?.focus();
    }
  };

  const handleChange = (field) => (e) => {
    const updated = {
      ...form,
      [field]: e.target.value,
    };

    setForm(updated);

    if (submitted) {
      setErrors(validate(updated));
    }
  };

  const showResponse = (status, title, subtitle) => {
    setResponseData({
      status,
      title,
      subtitle,
    });

    onResponseStatusChange(status);
  };

  const closeResponse = () => {
    setResponseData({
      title: "",
      subtitle: "",
      status: "",
    });

    onResponseStatusChange("");
  };

  const resetTurnstile = () => {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

  const clearForm = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
    resetTurnstile();
  };

  const handleSuccessClose = () => {
    clearForm();
    closeResponse();
  };

  const handleErrorClose = () => {
    closeResponse();
  };

  const checkEmailStatus = async (mailRef, firstName) => {
    const maxAttempts = 30;
    const interval = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const res = await fetch(
          `${API_URL}/api/contact/status/${encodeURIComponent(mailRef)}`,
        );

        if (res.ok) {
          const data = await res.json();
          const status = data?.confirmationEmailStatus;

          if (status === "bounced") {
            showResponse(
              "error",
              <>
                Couldn't reach this
                <br />
                email address.
              </>,
              <>
                Please check your email address <br />
                and retry again.
              </>,
            );

            resetTurnstile();
            return;
          }

          if (status === "failed") {
            showResponse(
              "error",
              <>
                Couldn't deliver to this
                <br />
                email address.
              </>,
              <>
                Please check your email address <br />
                and retry again.
              </>,
            );

            resetTurnstile();
            return;
          }

          if (status === "complained") {
            showResponse(
              "error",
              <>
                Couldn't complete the
                <br />
                request.
              </>,
              "Please try again later.",
            );

            resetTurnstile();
            return;
          }

          if (status === "delivered") {
            clearForm();

            showResponse(
              "success",
              <>
                Message sent
                <br />
                successfully
              </>,
              <>
                Thank you {firstName}. Your message has been received and I'll
                get back to you soon. <br />
                Reference: {mailRef}
              </>,
            );

            return;
          }
        }
      } catch {}

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    showResponse(
      "error",
      <>
        We're still processing
        <br />
        your message
      </>,
      "Your message was submitted, but we couldn't confirm email delivery yet. Please try again later.",
    );

    resetTurnstile();
  };

  const submitForm = async () => {
    const validationErrors = validate(form);

    setErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors);
      return;
    }

    if (!navigator.onLine) {
      showResponse(
        "network",
        <>
          Looks like
          <br />
          you're offline
        </>,
        <>
          Please check your internet connection <br />
          and retry again.
        </>,
      );
      return;
    }

    if (!turnstileToken) {
      showResponse(
        "error",
        <>Verification Error</>,
        <>
          Please complete the verification <br />
          to submit your message.
        </>,
      );
      return;
    }

    const ref = generateRef();
    const firstName = form.firstName;

    showResponse("loading", "", "");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail_ref: ref,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone?.number
            ? `${form.phone.code} ${form.phone.number}`
            : "N/A",
          country:
            countryOptions.find((c) => c.value === form.country)?.label ||
            form.country,
          reason:
            reasons.find((r) => r.value === form.reason)?.label || form.reason,
          teamSize:
            teamSizeOptions.find((item) => item.value === form.teamSize)
              ?.label || form.teamSize,
          message: form.message || "No message provided",
          turnstile_token: turnstileToken,
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned an invalid response");
      }

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || data?.error || "Failed to send message",
        );
      }

      await checkEmailStatus(ref, firstName);
    } catch (error) {
      const isNetworkError = error instanceof TypeError || !navigator.onLine;

      resetTurnstile();

      if (isNetworkError) {
        showResponse(
          "network",
          <>
            Looks like
            <br />
            you're offline
          </>,
          <>
            Please check your internet connection <br />
            and retry again.
          </>,
        );
      } else {
        showResponse(
          "error",
          <>
            Failed to send
            <br />
            your message
          </>,
          error instanceof Error
            ? error.message
            : "Failed to send your message",
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    await submitForm();
  };

  const handleRetry = async () => {
    closeResponse();

    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    await submitForm();
  };

  if (responseData.status) {
    return (
      <ResponseLayout
        status={responseData.status}
        title={responseData.title}
        subtitle={responseData.subtitle}
        onSuccess={handleSuccessClose}
        onError={handleErrorClose}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.inputsWrapper}>
        <TextInput
          ref={firstNameRef}
          label="First name"
          placeholder="Your first name"
          value={form.firstName}
          required
          onChange={handleChange("firstName")}
          error={submitted ? errors.firstName : ""}
        />

        <TextInput
          ref={lastNameRef}
          label="Last name"
          placeholder="Your last name"
          value={form.lastName}
          required
          onChange={handleChange("lastName")}
          error={submitted ? errors.lastName : ""}
        />
      </div>

      <TextInput
        ref={emailRef}
        label="Email address"
        placeholder="yourname@company.com"
        type="email"
        value={form.email}
        required
        onChange={handleChange("email")}
        error={submitted ? errors.email : ""}
      />

      <PhoneInput
        ref={phoneRef}
        label="Phone number"
        value={form.phone}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            phone: value,
          }))
        }
        error={submitted ? errors.phone : ""}
      />

      <div className={styles.inputsWrapper}>
        <SelectInput
          ref={teamSizeRef}
          label="Team size"
          value={form.teamSize}
          required
          onChange={handleChange("teamSize")}
          options={teamSizeOptions}
          placeholder="Select team size"
          error={submitted ? errors.teamSize : ""}
        />

        <SelectInput
          ref={countryRef}
          label="Country"
          value={form.country}
          required
          onChange={(e) => {
            const countryCode = e.target.value;

            let dialCode = form.phone.code;

            try {
              dialCode = `+${getCountryCallingCode(countryCode)}`;
            } catch {}

            setForm((prev) => ({
              ...prev,
              country: countryCode,
              phone: {
                ...prev.phone,
                iso: countryCode,
                code: dialCode,
              },
            }));
          }}
          options={countryOptions}
          placeholder="Select your country"
          error={submitted ? errors.country : ""}
        />
      </div>

      <SelectInput
        ref={reasonRef}
        label="How can I help you?"
        value={form.reason}
        required
        onChange={handleChange("reason")}
        options={reasons}
        placeholder="Select an option"
        error={submitted ? errors.reason : ""}
      />

      <TextareaInput
        ref={messageRef}
        label="Message"
        placeholder="Tell me more about your inquiry..."
        value={form.message}
        onChange={handleChange("message")}
        rows={10}
        error={submitted ? errors.message : ""}
      />

      <div className={styles.turnstileWrapper}>
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

      <p className={styles.terms}>
        By submitting this form, you agree to be contacted regarding your
        inquiry and acknowledge that your information will be handled in
        accordance with our{" "}
        <Link
          className={styles.termsLink}
          to="/legal/tshepiemdev-website-terms-of-use"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          className={styles.termsLink}
          to="/legal/tshepiemdev-website-privacy-policy"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className={styles.controlWrapper}>
        <BtnCTAWhite type="submit" buttonText="Submit message" fullWidth />

        <div className={styles.altOptionsWrapper}>
          <BtnCTABlack
            iconB={emailImg}
            buttonText="Mail me directly"
            fullWidth
            href={`mailto:${contactInfo.personal.email}`}
          />

          <BtnCTABlack
            iconB={phoneImg}
            buttonText="Give me a call"
            fullWidth
            href={`tel:${contactInfo.personal.phone}`}
          />
        </div>
      </div>

      <input
        name="website"
        style={{
          display: "none",
        }}
      />
    </form>
  );
}
