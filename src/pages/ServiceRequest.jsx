import { useState } from "react";
import styles from "../styles/Contact.module.css";
import ServiceRequestForm from "../components/ServiceRequestForm";
import PageTopHeading from "../components/PageTopHeading";
import serviceImg from "../assets/icons/logo-black.svg";
import ogImages from "../config/ogImages";
import API_URL from "../config/api";
import createMeta from "../config/seo";

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

export function meta() {
  return createMeta({
    title: "Request a Service",
    description:
      "From concept to completion, let's make it happen. Select the service that fits your needs and I'll review your requirements to provide the right solution.",
    image: ogImages.request_service,
    url: "/service-request",
    keywords:
      "request a service, request software development, request website development, request web development, request web application development, request custom software, request mobile app development, software development request, software development services, website development services, web application development services, mobile application development services, custom software development services, custom application development, frontend development services, backend development services, full-stack development services, API development services, REST API development, UI development services, responsive website development, SaaS development services, digital product development, software engineering services, application development services, database development, database integration, API integration, business software development, startup software development, small business software development, software solutions, digital solutions, website project request, software project request, developer project request, hire software developer, hire web developer, hire full-stack developer, freelance software development, independent software developer, South African software developer, South Africa software development, Pretoria software developer, Pretoria software development, Gauteng software developer, custom software developer Pretoria, web developer Pretoria, tshepiem.dev service request",
  });
}

export default function ServiceRequest() {
  const [responseStatus, setResponseStatus] = useState("");

  return (
    <div className={styles.contact}>
      <div className={styles.contactWrapper}>
        {!responseStatus && (
          <PageTopHeading
            icon={serviceImg}
            title={<>Request a service.</>}
            // miniTitle={
            //   <>
            //     From concept to completion, <br />
            //     let's make it happen.
            //   </>
            // }
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
