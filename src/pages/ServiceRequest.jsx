import { useState } from "react";
import styles from "../styles/Contact.module.css";
import ServiceRequestForm from "../components/ServiceRequestForm";
import PageHelmet from "../components/PageHelmet";
import PageTopHeading from "../components/PageTopHeading";
import serviceImg from "../assets/icons/logo-black.svg";
import ogImages from "../config/ogImages";
import API_URL from "../config/api";

const SITE_URL = "https://tshepiem.dev";

export async function loader() {
  try {
    const [servicesRes, pricingRes] = await Promise.all([
      fetch(`${API_URL}/api/services`),
      fetch(`${API_URL}/api/pricings`),
    ]);

    let servicesData;
    let pricingData;

    try {
      servicesData = await servicesRes.json();
      pricingData = await pricingRes.json();
    } catch {
      throw new Error("Server returned an invalid response");
    }

    if (!servicesRes.ok || !pricingRes.ok) {
      throw new Error(
        servicesData?.message ||
          pricingData?.message ||
          "Failed to load service request data",
      );
    }

    const services = (
      Array.isArray(servicesData) ? servicesData : servicesData?.data || []
    ).filter((service) => service?.isActive === true);

    const pricingPackages = Array.isArray(pricingData)
      ? pricingData
      : pricingData?.data || [];

    return {
      services,
      pricingPackages,
      error: null,
    };
  } catch (error) {
    return {
      services: [],
      pricingPackages: [],
      error: error instanceof TypeError ? "server" : "default",
    };
  }
}

export default function ServiceRequest() {
  const [responseStatus, setResponseStatus] = useState("");

  return (
    <div className={styles.contact}>
      <PageHelmet
        title="Request a Service"
        description="From concept to completion, let's make it happen. Select the service that fits your needs and I'll review your requirements to provide the right solution."
        image={ogImages.request_service}
        url={`${SITE_URL}/service-request`}
        keywords="request a service, software development services, website development, web application development, mobile app development, backend development, UI development, custom software solutions"
        siteName=""
      />

      <div className={styles.contactWrapper}>
        {!responseStatus && (
          <PageTopHeading
            icon={serviceImg}
            title={<>Request a service.</>}
            miniTitle={
              <>
                From concept to completion, <br />
                let's make it happen.
              </>
            }
            subtext={
              <>
                Select the service that fits your needs and <br />
                I'll review your requirements to provide the <br />
                right solution.
              </>
            }
            titleSize={2}
            miniTitleSize={2.2}
          />
        )}

        <ServiceRequestForm onResponseStatusChange={setResponseStatus} />
      </div>
    </div>
  );
}
