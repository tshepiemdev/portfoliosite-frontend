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
      "software projects, software development projects, developer projects, developer portfolio, software engineering portfolio, software development portfolio, programming portfolio, web development portfolio, full-stack development projects, full-stack projects, frontend projects, backend projects, web application projects, web app projects, website projects, custom software projects, mobile application projects, mobile app projects, SaaS projects, API projects, REST API projects, database projects, React projects, React.js projects, React developer portfolio, JavaScript projects, TypeScript projects, Node.js projects, Express.js projects, C# projects, .NET projects, VB.NET projects, MongoDB projects, PostgreSQL projects, SQL projects, GitHub projects, open source projects, modern web development projects, responsive web applications, software applications, digital products, software engineering projects, application development projects, system analysis projects, software architecture projects, UI development projects, API integration projects, South African developer portfolio, South African software developer projects, Pretoria developer portfolio, Pretoria software projects, Gauteng developer portfolio, programming projects South Africa, tshepiem.dev projects",
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

        <ProjectsWrapper
          marginTop={0}
          showBar={false}
          showFilter={true}
          gridColumns="2"
        />
      </div>
    </div>
  );
}
