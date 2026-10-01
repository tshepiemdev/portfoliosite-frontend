import { useState } from "react";
import styles from "../styles/Contact.module.css";
import ContactForm from "../components/ContactForm";
import PageTopHeading from "../components/PageTopHeading";
import serviceImg from "../assets/icons/logo-black.svg";
import ogImages from "../config/ogImages";
import createMeta from "../config/seo";

export function meta() {
  return createMeta({
    title: "Get in touch",
    description:
      "Whether it's a question or an opportunity, let's talk. Send me a message, and I'll respond as soon as possible.",
    image: ogImages.contact,
    url: "/contact",
    keywords:
      "contact developer, contact software developer, contact software engineer, contact web developer, contact full-stack developer, hire software developer, hire web developer, hire full-stack developer, hire React developer, hire TypeScript developer, hire Node.js developer, hire C# developer, software development services, web development services, website development services, web application development services, custom software development, custom software developer, software engineering services, application development, API development, backend development, frontend development, full-stack development, SaaS development, digital product development, project collaboration, software project collaboration, web development project, software development project, custom application development, business software development, developer services, IT services, freelance software developer, freelance web developer, independent software developer, software engineer for hire, web developer for hire, full-stack developer for hire, South African software developer, South African software engineer, Pretoria software developer, Pretoria software engineer, Gauteng software developer, Gauteng software engineer, tshepiem.dev contact",
  });
}

export default function Contact() {
  const [responseStatus, setResponseStatus] = useState("");

  return (
    <div className={styles.contact}>
      <div className={styles.contactWrapper}>
        {!responseStatus && (
          <PageTopHeading
            icon={serviceImg}
            title={<>Get in touch</>}
            // miniTitle={
            //   <>
            //     Whether it's a question or <br />
            //     an opportunity, let's talk.
            //   </>
            // }
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
