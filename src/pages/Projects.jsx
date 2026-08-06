import styles from "../styles/Projects.module.css";
import PageHelmet from "../components/PageHelmet";
import SectionDevider from "../components/SectionDevider";
import ProjectsWrapper from "../components/ProjectsWrapper";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";

export default function Projects() {
  return (
    <div className={styles.projects}>
      <PageHelmet
        title="Projects"
        description="Builds, deployments & project releases."
        image={ogImages.projects}
        url={window.location.href}
        keywords="projects, software development, developer portfolio, web applications, mobile apps, programming"
        siteName=""
      />

      <div className={styles.projectsWrapper}>
        <PageTopHeading
          title={<>Projects</>}
          subtext={
            <>
              Builds, deployments <br />& project releases.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <ProjectsWrapper marginTop={0} showBar={false} showFilter={true} />
      </div>
    </div>
  );
}
