import { useEffect, useState, useRef } from "react";
import styles from "../styles/Home.module.css";
import PageHelmet from "../components/PageHelmet";
import LandingSection from "../components/LandingSection";
import SkillListingWrapper from "../components/SkillListingWrapper";
import QualificationsWrapper from "../components/QualificationsWrapper";
import ProjectsWrapper from "../components/ProjectsWrapper";
import ExperienceWrapper from "../components/ExperienceWrapper";
import SectionDevider from "../components/SectionDevider";
import OverlayAdvertisement from "../components/OverlayAdvertisement";
import ReviewsListingWrapper from "../components/ReviewsListingWrapper";
import HeroBentoWrapper from "../components/HeroBentoWrapper";
import LargeBanner from "../components/LargeBanner";
import BtnCTAWhite from "../components/BtnCTAWhite";
import BtnCTABlack from "../components/BtnCTABlack";
import MeetWrapper from "../components/MeetWrapper";
import SectionHeading from "../components/SectionHeading";
import ogImages from "../config/ogImages";
import SubscribeLabel from "../components/SubscribeLabel";

export default function Home() {
  return (
    <main className={styles.home}>
      <PageHelmet
        title="tshepiem.dev"
        description="Creative developer building scalable, high-performance digital solutions with clean design and efficient engineering."
        image={ogImages.home}
        url={window.location.href}
        keywords="hire developer, software developer, web developer, React developer, Node.js developer, JavaScript, TypeScript, C#, South Africa"
        siteName="Creative & Skilled developer"
      />

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
              badgeText={"Hello"}
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
            <BtnCTABlack buttonText={"Learn more"} focusTo={"skills"} />
            <BtnCTAWhite buttonText="Get resume" href={"/resume"} />
          </div>
        </div>

        <MeetWrapper />
      </section>

      <section id="skills" className={styles.section}>
        <SectionHeading
          badgeText={"Skills"}
          title={
            <>
              Skills, tools & <br />
              tech I work with.
            </>
          }
        />
        <SkillListingWrapper />
      </section>

      <section id="projects" className={styles.section}>
        <div className={styles.wrapper}>
          <div className={styles.titlesWrapper}>
            <SectionHeading
              badgeText={"Projects"}
              title={
                <>
                  Builds, deployments <br />& project releases.
                </>
              }
            />
          </div>

          <div className={styles.actionsWrapper}>
            <BtnCTABlack buttonText="Browse all" href={"/projects"} />
          </div>
        </div>

        <ProjectsWrapper marginTop={2} showBar={true} limit={3} />
      </section>

      <section id="qualifications" className={styles.section}>
        <SectionHeading
          badgeText={"Qualifications"}
          title={
            <>
              Continuous professional <br />
              development records.
            </>
          }
        />

        <QualificationsWrapper />
      </section>

      <section id="experience" className={styles.section}>
        <SectionHeading
          badgeText={"experience"}
          title={
            <>
              Professional work <br />
              experience overview.
            </>
          }
        />

        <ExperienceWrapper />
      </section>

      <section id="reviews" className={styles.reviewsSection}>
        <SectionHeading
          badgeText={"reviews"}
          title={
            <>
              What people say <br />
              about my Work.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <BtnCTAWhite
          buttonText={"Leave a review"}
          href={"/contact?reason=review"}
        />
        <ReviewsListingWrapper />
      </section>

      <section className={styles.subFooterSectionWrapper}>
        <LargeBanner />
      </section>

      <section className={styles.bentoImagesSectionWrapper}>
        <HeroBentoWrapper />
      </section>

      <SubscribeLabel
        text={
          <>
            to receive new <br />
            blogs, directly into your inbox.
          </>
        }
        marginTop={4}
      />
    </main>
  );
}
