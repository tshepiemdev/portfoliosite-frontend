import styles from "../styles/ContactForm.module.css";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import TextareaInput from "./TextareaInput";
import PhoneInput from "./PhoneInput";
import Modal from "./Modal";
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

export default function ContactForm() {
  const [searchParams] = useSearchParams();
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [disableClose, setDisableClose] = useState(false);

  const [responseData, setResponseData] = useState({
    title: "",
    subtitle: "",
    status: "",
  });

  const [form, setForm] = useState({
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
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [mailRef, setMailRef] = useState("");

  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");

  useDetectLocation(setForm);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const countryRef = useRef(null);
  const reasonRef = useRef(null);
  const teamSizeRef = useRef(null);
  const messageRef = useRef(null);

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

  useEffect(() => {
    const reason = searchParams.get("reason");

    if (reason && reasons.some((item) => item.value === reason)) {
      setForm((prev) => ({
        ...prev,
        reason,
      }));
    }
  }, [searchParams]);

  const validate = (values) => {
    const newErrors = {};

    if (!values.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!values.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!values.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!values.country) newErrors.country = "Please select your country";
    if (!values.reason) newErrors.reason = "Please select a reason";
    if (!values.teamSize) newErrors.teamSize = "Please select team size";

    if (values.message.length > 1000)
      newErrors.message = "Length limit reached";

    return newErrors;
  };

  const focusFirstError = (errors) => {
    if (errors.firstName) return firstNameRef.current?.focus();
    if (errors.lastName) return lastNameRef.current?.focus();
    if (errors.email) return emailRef.current?.focus();
    if (errors.phone) return phoneRef.current?.focus();
    if (errors.country) return countryRef.current?.focus();
    if (errors.reason) return reasonRef.current?.focus();
    if (errors.teamSize) return teamSizeRef.current?.focus();
    if (errors.message) return messageRef.current?.focus();
  };

  const handleChange = (field) => (e) => {
    const updated = { ...form, [field]: e.target.value };
    setForm(updated);
    if (submitted) setErrors(validate(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors);
      return;
    }

    if (!navigator.onLine) {
      setResponseData({
        title: "You're offline",
        subtitle: "Please check your internet connection and try again.",
        status: "network",
      });

      setIsResponseModalOpen(true);
      setDisableClose(false);
      return;
    }

    if (!captchaToken) {
      setResponseData({
        title: (
          <>
            Verification is <br />
            required to submit
          </>
        ),
        subtitle: "Please confirm that you are not a robot to continue.",
        status: "error",
      });

      setIsResponseModalOpen(true);
      setDisableClose(false);
      return;
    }

    const ref = generateRef();
    setMailRef(ref);

    setIsResponseModalOpen(true);
    setResponseData({
      title: "",
      subtitle: "",
      status: "loading",
    });

    setDisableClose(true);

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
            {
              solo: "Just me",
              small: "2 - 10 people",
              medium: "11 - 50 people",
              large: "51 - 200 people",
              enterprise: "200+ people",
            }[form.teamSize] || form.teamSize,
          message: form.message || "No message provided",
          recaptcha_token: captchaToken,
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Server returned an invalid response");
      }

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.error || data?.message || "Failed to send message",
        );
      }

      setResponseData({
        title: "Message sent successfully",
        subtitle: `Thank you ${form.firstName}. I'll get back to you soon. Reference: ${ref}`,
        status: "success",
      });

      setDisableClose(true);

      setForm({
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
      });

      setSubmitted(false);
      setErrors({});
      setCaptchaToken("");
      recaptchaRef.current?.reset();
    } catch (error) {
      setResponseData({
        title: (
          <>
            Failed to send <br />
            your mail
          </>
        ),
        subtitle: error.message,
        status: "error",
      });

      setDisableClose(false);
    }
  };

  return (
    <>
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
            onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
            options={[
              { value: "solo", label: "Just me" },
              { value: "small", label: "2 - 10 people" },
              { value: "medium", label: "11 - 50 people" },
              { value: "large", label: "51 - 200 people" },
              { value: "enterprise", label: "200+ people" },
            ]}
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

        <div className={styles.recaptchaWrapper}>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            theme="light"
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken("")}
          />
        </div>

        <p className={styles.terms}>
          By submitting this form, you agree to be contacted regarding your
          inquiry and acknowledge that the information you provide may be used
          to respond to your request and communicate with you about related
          services. Your information will be collected, processed, and handled
          in accordance with site's{" "}
          <Link
            className={styles.termsLink}
            to="/legal/tshepiemdev-website-privacy-policy"
          >
            Terms
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

        <input name="website" style={{ display: "none" }} />
      </form>

      <Modal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        showTopControl={
          responseData.status === "error" || responseData.status === "network"
        }
        disableClose={disableClose}
      >
        <ResponseLayout
          status={responseData.status}
          title={responseData.title}
          subtitle={responseData.subtitle}
          onClose={() => {
            setDisableClose(false);
            setIsResponseModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
