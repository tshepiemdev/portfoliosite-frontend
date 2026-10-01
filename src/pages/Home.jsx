import styles from "../styles/Home.module.css";
import createMeta from "../config/seo";
import LandingSection from "../components/LandingSection";
import SkillListingWrapper from "../components/SkillListingWrapper";
import QualificationsWrapper from "../components/QualificationsWrapper";
import ProjectsWrapper from "../components/ProjectsWrapper";
import ExperienceWrapper from "../components/ExperienceWrapper";
import ReviewsListingWrapper from "../components/ReviewsListingWrapper";
import HeroBentoWrapper from "../components/HeroBentoWrapper";
import LargeBanner from "../components/LargeBanner";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";
import BtnCTABlackSmall from "../components/BtnCTABlackSmall";
import MeetWrapper from "../components/MeetWrapper";
import SectionHeading from "../components/SectionHeading";
import contactInfo from "../config/contactInfo";
import LazySection from "../components/LazySection";

export function meta() {
  return createMeta({
    title:
      "tshepiem.dev | Creative & Skilled Developer: Building Software Solutions",
    description:
      "Building ideas into efficient, scalable software through clean code, creative thinking, and engineering.",
    image: "/og-banner.png",
    url: "/",
    keywords:
      "software engineer, software developer, full-stack developer, full stack developer, web developer, web application developer, application developer, frontend developer, frontend engineer, backend developer, backend engineer, full-stack engineer, software engineer portfolio, developer portfolio, software development, software engineering, custom software development, custom software developer, software solutions, digital product development, digital products, application development, web development, modern web development, website development, web application development, custom applications, business software, SaaS development, SaaS developer, API development, REST API development, backend development, frontend development, full-stack software development, scalable software, scalable applications, responsive web development, responsive websites, modern websites, high-performance websites, SEO-friendly websites, accessible websites, cloud applications, web applications, software applications, software architecture, application architecture, system analysis, object-oriented programming, software projects, software engineering projects, technology solutions, digital solutions, software services, developer services, IT services, React developer, React.js developer, React 19 developer, JavaScript developer, TypeScript developer, Node.js developer, Node developer, Express.js developer, Express developer, C# developer, C Sharp developer, .NET developer, Microsoft .NET developer, VB.NET developer, Visual Basic .NET developer, MongoDB developer, MongoDB, PostgreSQL developer, PostgreSQL, SQL developer, SQL Server developer, MySQL developer, database development, database design, REST APIs, APIs, API integration, JSON, OAuth, Git, GitHub, Vite, React Router, Tailwind CSS, HTML, CSS, JavaScript, TypeScript, React, Node.js, Express.js, C#, .NET, VB.NET, MongoDB, PostgreSQL, SQL Server, MySQL, responsive UI development, frontend engineering, backend engineering, software architecture, web application architecture, API integration, database integration, modern JavaScript development, modern TypeScript development, component-based development, server-side rendering, SSR web development, performance optimization, web performance, South African developer, South Africa developer, South African software developer, South African software engineer, software developer South Africa, software engineer South Africa, web developer South Africa, full-stack developer South Africa, React developer South Africa, TypeScript developer South Africa, Node.js developer South Africa, custom software developer South Africa, web application developer South Africa, Pretoria developer, Pretoria software developer, Pretoria software engineer, Pretoria web developer, Pretoria full-stack developer, Pretoria React developer, Pretoria TypeScript developer, Pretoria Node.js developer, Pretoria software development, software developer Pretoria, software engineer Pretoria, web developer Pretoria, full-stack developer Pretoria, custom software developer Pretoria, web application developer Pretoria, Gauteng developer, Gauteng software developer, Gauteng software engineer, Gauteng web developer, Gauteng full-stack developer, independent software developer, independent software engineer, freelance software developer, freelance web developer, freelance full-stack developer, software development portfolio, web development portfolio, programming portfolio, technology portfolio, IT developer, IT software developer, information technology developer, information technology software development",
  });
}

export default function Home() {
  return (
    <div className={styles.home}>
      <section id="hero" className={styles.landingSectionWrapper}>
        <LandingSection />
      </section>

      <section className={styles.bentoImagesSectionWrapper}>
        <HeroBentoWrapper />
      </section>

      <section id="meet" className={styles.meetSection}>
        <div className={styles.wrapper}>
          <div className={styles.titlesWrapper}>
            <SectionHeading
              badgeText="Hello"
              title={
                <>
                  Meet tshepang,
                  <br /> a developer based in <br />
                  South Africa, Pretoria.
                </>
              }
            />
          </div>

          <div className={styles.actionsWrapper}>
            <BtnCTABlackSmall buttonText="Learn more" focusTo="skills" />
            <BtnCTAWhiteSmall buttonText="Get resume" href="/resume" />
          </div>
        </div>

        <LazySection minHeight="400px">
          <MeetWrapper />
        </LazySection>
      </section>

      <section id="skills" className={styles.section}>
        <SectionHeading
          badgeText="Skills"
          title={
            <>
              Skills, tools & <br />
              tech I work with.
            </>
          }
        />

        <LazySection minHeight="400px">
          <SkillListingWrapper />
        </LazySection>
      </section>

      <section id="projects" className={styles.section}>
        <div className={styles.wrapper}>
          <div className={styles.titlesWrapper}>
            <SectionHeading
              badgeText="Projects"
              title={
                <>
                  Builds, deployments <br />& project releases.
                </>
              }
            />
          </div>

          <div className={styles.actionsWrapper}>
            <BtnCTABlackSmall buttonText="Browse all" href="/projects" />
            <BtnCTAWhiteSmall
              buttonText="Repositories"
              href={
                contactInfo.social.find((social) => social.name === "GitHub")
                  ?.url
              }
            />
          </div>
        </div>

        <LazySection minHeight="600px">
          <ProjectsWrapper marginTop={1} showBar={true} limit={3} />
        </LazySection>
      </section>

      <section id="qualifications" className={styles.section}>
        <SectionHeading
          badgeText="Qualifications"
          title={
            <>
              Continuous professional <br />
              development records.
            </>
          }
        />

        <LazySection minHeight="500px">
          <QualificationsWrapper />
        </LazySection>
      </section>

      <section id="experience" className={styles.section}>
        <SectionHeading
          badgeText="experience"
          title={
            <>
              Professional work <br />
              experience overview.
            </>
          }
        />

        <LazySection minHeight="500px">
          <ExperienceWrapper />
        </LazySection>
      </section>

      <section id="reviews" className={styles.reviewsSection}>
        <SectionHeading
          badgeText="reviews"
          title={
            <>
              What people say <br />
              about my Work.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <BtnCTAWhiteSmall
          buttonText="Leave a review"
          href="/contact?reason=review"
        />

        <LazySection minHeight="500px">
          <ReviewsListingWrapper />
        </LazySection>
      </section>

      <section className={styles.subFooterSectionWrapper}>
        <LazySection minHeight="500px">
          <LargeBanner />
        </LazySection>
      </section>
    </div>
  );
}
