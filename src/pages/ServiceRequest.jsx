import { useState } from "react";
import styles from "../styles/Contact.module.css";
import ServiceRequestForm from "../components/ServiceRequestForm";
import PageHelmet from "../components/PageHelmet";
import PageTopHeading from "../components/PageTopHeading";
import serviceImg from "../assets/icons/logo-black.svg";
import ogImages from "../config/ogImages";

export default function ServiceRequest() {
  const [responseStatus, setResponseStatus] = useState("");

  return (
    <div className={styles.contact}>
      <PageHelmet
        title="Request a Service"
        description="From concept to completion, let's make it happen. Select the service that fits your needs and I'll review your requirements to provide the right solution."
        image={ogImages.request_service}
        url={window.location.href}
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
