import styles from "../styles/Projects.module.css";
import ProjectsWrapper from "../components/ProjectsWrapper";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";
import createMeta from "../config/seo";

export function meta() {
  return createMeta({
    title: "Projects",
    description: "Builds, deployments & project releases.",
    image: ogImages.projects,
    url: "/projects",
    keywords:
      "projects, software development, developer portfolio, web applications, mobile apps, programming",
  });
}

export default function Projects() {
  return (
    <div className={styles.projects}>
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
