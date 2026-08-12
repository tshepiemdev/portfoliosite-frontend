import { useState } from "react";
import styles from "../styles/Contact.module.css";
import ContactForm from "../components/ContactForm";
import PageHelmet from "../components/PageHelmet";
import PageTopHeading from "../components/PageTopHeading";
import serviceImg from "../assets/icons/logo-black.svg";
import ogImages from "../config/ogImages";

export default function Contact() {
  const [responseStatus, setResponseStatus] = useState("");

  return (
    <div className={styles.contact}>
      <PageHelmet
        title="Get in touch"
        description="Whether it's a question or an opportunity, let's talk. Send me a message, and I'll respond as soon as possible."
        image={ogImages.contact}
        url={window.location.href}
        keywords="contact developer, hire software developer, project collaboration, web development services, software development"
        siteName=""
      />

      <div className={styles.contactWrapper}>
        {!responseStatus && (
          <PageTopHeading
            icon={serviceImg}
            title={<>Get in touch</>}
            miniTitle={
              <>
                Whether it's a question or <br />
                an opportunity, let's talk.
              </>
            }
            titleSize={2}
            miniTitleSize={2.2}
            subtext={
              <>
                Send me a message, and I'll review and <br />
                provide feedback as soon as possible.
              </>
            }
          />
        )}

        <ContactForm onResponseStatusChange={setResponseStatus} />
      </div>
    </div>
  );
}
