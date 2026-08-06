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
import SubmitIcon from "../assets/icons/flower.svg";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import API_URL from "../config/api";
import useDetectLocation from "../hooks/useDetectLocation";
import { getCountryCallingCode } from "libphonenumber-js";

countries.registerLocale(enLocale);

const generateRef = () =>
  "SR" +
  new Date().toISOString().slice(0, 10).replace(/-/g, "") +
  "-" +
  Math.random().toString(36).substring(2, 10).toUpperCase();

const slugify = (text = "") => text.toLowerCase().trim().replace(/\s+/g, "-");

const countryOptions = Object.entries(
  countries.getNames("en", { select: "official" }),
)
  .map(([code, name]) => ({
    value: code,
    label: name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const budgetOptions = [
  {
    value: "unknown",
    label: "Not sure yet",
  },
  {
    value: "under-5000",
    label: "Below R5,000",
  },
  {
    value: "5000-15000",
    label: "R5,000 - R15,000",
  },
  {
    value: "15000-30000",
    label: "R15,000 - R30,000",
  },
  {
    value: "30000-60000",
    label: "R30,000 - R60,000",
  },
  {
    value: "60000-plus",
    label: "Above R60,000",
  },
];

const startTimeOptions = [
  {
    value: "asap",
    label: "Immediately",
  },
  {
    value: "two-weeks",
    label: "Within 2 weeks",
  },
  {
    value: "one-month",
    label: "Within 1 month",
  },
  {
    value: "three-months",
    label: "2 - 3 months",
  },
  {
    value: "flexible",
    label: "Flexible",
  },
];

export default function ServiceRequestForm() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [pricingPackages, setPricingPackages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
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
    country: "",
    company: "",
    service: "",
    package: "",
    budget: "",
    startTime: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");

  useDetectLocation(setForm);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const countryRef = useRef(null);
  const serviceRef = useRef(null);
  const packageRef = useRef(null);
  const budgetRef = useRef(null);
  const startTimeRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, pricingRes] = await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/pricings`),
        ]);

        const servicesData = await servicesRes.json();
        const pricingData = await pricingRes.json();

        if (servicesData?.success) {
          setServices(servicesData.data);
        }
        if (pricingData?.success) {
          setPricingPackages(pricingData.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!services.length || !pricingPackages.length) return;

    const serviceParam = searchParams.get("service");
    const packageParam = searchParams.get("package");

    if (!serviceParam) return;

    const service = services.find(
      (item) => item.pricingAlias?.toLowerCase() === serviceParam.toLowerCase(),
    );

    if (!service) return;

    const pricingCategory = pricingPackages.find(
      (item) =>
        item.type?.toLowerCase() === service.pricingAlias?.toLowerCase(),
    );

    const selectedPackages =
      pricingCategory?.packages?.filter((pkg) => pkg.isActive) || [];

    const selectedPackage = packageParam
      ? selectedPackages.find(
          (pkg) => slugify(pkg.package) === packageParam.toLowerCase(),
        )
      : null;

    setSelectedService(service);

    setPackages(selectedPackages);

    setForm((prev) => ({
      ...prev,
      service: service._id,
      package: selectedPackage?.package || "",
    }));
  }, [services, pricingPackages, searchParams]);

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;

    const service = services.find((item) => item._id === serviceId);

    if (!service) return;

    const pricingCategory = pricingPackages.find(
      (item) =>
        item.type?.toLowerCase() === service.pricingAlias?.toLowerCase(),
    );

    const servicePackages =
      pricingCategory?.packages?.filter((pkg) => pkg.isActive) || [];

    setSelectedService(service);

    setPackages(servicePackages);

    setForm((prev) => ({
      ...prev,
      service: serviceId,
      package: "",
    }));
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

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

    if (!values.service) {
      newErrors.service = "Please select a service";
    }

    if (packages.length > 0 && !values.package) {
      newErrors.package = "Please select a package";
    }

    if (!values.budget) {
      newErrors.budget = "Please select your budget";
    }

    if (!values.startTime) {
      newErrors.startTime = "Please select your preferred start time";
    }

    if (values.message.length > 1000) {
      newErrors.message = "Length limit reached";
    }

    return newErrors;
  };

  const focusFirstError = (errors) => {
    if (errors.firstName) {
      return firstNameRef.current?.focus();
    }

    if (errors.lastName) {
      return lastNameRef.current?.focus();
    }

    if (errors.email) {
      return emailRef.current?.focus();
    }

    if (errors.country) {
      return countryRef.current?.focus();
    }

    if (errors.service) {
      return serviceRef.current?.focus();
    }

    if (errors.package) {
      return packageRef.current?.focus();
    }

    if (errors.budget) {
      return budgetRef.current?.focus();
    }

    if (errors.startTime) {
      return startTimeRef.current?.focus();
    }

    if (errors.message) {
      return messageRef.current?.focus();
    }
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
            Verification <br />
            required
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

    setIsResponseModalOpen(true);

    setResponseData({
      title: "",
      subtitle: "",
      status: "loading",
    });

    setDisableClose(true);

    try {
      const selectedPackage =
        packages.find((pkg) => pkg.package === form.package) || null;

      const res = await fetch(`${API_URL}/api/service-request`, {
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

          company: form.company || "N/A",

          service: selectedService?.name || "",

          package: selectedPackage?.title || "N/A",

          price:
            selectedPackage?.nowPrice ??
            selectedService?.pricing?.startingFrom ??
            selectedService?.pricing?.rate ??
            null,

          pricingType: selectedPackage
            ? "package"
            : selectedService?.pricing?.type || "custom",

          budget:
            budgetOptions.find((item) => item.value === form.budget)?.label ||
            form.budget,

          startTime:
            startTimeOptions.find((item) => item.value === form.startTime)
              ?.label || form.startTime,

          message: form.message || "No project details provided",

          recaptcha_token: captchaToken,
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned an invalid response");
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to send request");
      }

      setResponseData({
        title: "Request sent successfully",
        subtitle: `Thank you ${form.firstName}. I'll review your request and get back to you soon. Reference: ${ref}`,
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

        country: "",

        company: "",

        service: "",
        package: "",

        budget: "",
        startTime: "",

        message: "",
      });

      setSelectedService(null);

      setPackages([]);

      setSubmitted(false);

      setErrors({});

      setCaptchaToken("");

      recaptchaRef.current?.reset();
    } catch (error) {
      setResponseData({
        title: (
          <>
            Failed to send <br />
            your request
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

        <TextInput
          label="Company"
          placeholder="Company name"
          value={form.company}
          onChange={handleChange("company")}
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

                code: dialCode,

                iso: countryCode,
              },
            }));
          }}
          options={countryOptions}
          placeholder="Select your country"
          error={submitted ? errors.country : ""}
        />

        <div className={styles.inputsWrapper}>
          <SelectInput
            ref={serviceRef}
            label="Service"
            value={form.service}
            required
            onChange={handleServiceChange}
            options={services.map((service) => ({
              value: service._id,
              label: service.name,
            }))}
            placeholder="Select a service"
            error={submitted ? errors.service : ""}
          />

          <SelectInput
            ref={packageRef}
            label="Package"
            value={form.package}
            required
            onChange={handleChange("package")}
            options={packages.map((pkg) => ({
              value: pkg.package,
              label: pkg.title,
            }))}
            placeholder="Select a package"
            error={submitted ? errors.package : ""}
          />
        </div>

        <div className={styles.inputsWrapper}>
          <SelectInput
            ref={budgetRef}
            label="Project budget"
            value={form.budget}
            required
            onChange={handleChange("budget")}
            options={budgetOptions}
            placeholder="Select budget"
            error={submitted ? errors.budget : ""}
          />

          <SelectInput
            ref={startTimeRef}
            label="Preferred start time"
            value={form.startTime}
            required
            onChange={handleChange("startTime")}
            options={startTimeOptions}
            placeholder="Select timeline"
            error={submitted ? errors.startTime : ""}
          />
        </div>

        <TextareaInput
          ref={messageRef}
          label="Project details"
          placeholder="Describe your project, what you need, and any important requirements or goals..."
          value={form.message}
          onChange={handleChange("message")}
          rows={14}
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
          service request and acknowledge that your information will be handled
          in accordance with the{" "}
          <Link
            className={styles.termsLink}
            to="/legal/tshepiemdev-website-privacy-policy"
          >
            Terms
          </Link>
          .
        </p>

        <BtnCTAWhite
          type="submit"
          icon={SubmitIcon}
          buttonText="Submit request"
        />

        <input
          name="website"
          style={{
            display: "none",
          }}
        />
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
