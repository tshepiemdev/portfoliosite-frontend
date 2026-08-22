import styles from "../styles/Home.module.css";
import PageHelmet from "../components/PageHelmet";
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
import ogImages from "../config/ogImages";
import SubscribeLabel from "../components/SubscribeLabel";
import contactInfo from "../config/contactInfo";
import LazySection from "../components/LazySection";

export default function Home() {
  return (
    <main className={styles.home}>
      <PageHelmet
        title="tshepiem.dev"
        description="Creative developer building scalable, high-performance digital solutions with clean design and efficient engineering."
        image={ogImages.home}
        url={window.location.href}
        keywords="hire developer, software developer, web developer, React developer, Node.js developer, JavaScript, TypeScript, C#, South Africa"
        siteName="Creative & Skilled Software Engineer"
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

      <LazySection minHeight="400px">
        <SubscribeLabel
          heading={
            <>
              Subscribe now, <br />
              It's completely free
            </>
          }
          text={
            <>
              to receive new <br />
              blogs, directly into your inbox.
            </>
          }
          marginTop={4}
        />
      </LazySection>
    </main>
  );
}
