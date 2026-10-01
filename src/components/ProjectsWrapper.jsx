import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import styles from "../styles/ProjectsWrapper.module.css";
import Project from "./Project";
import LoaderView from "./Loader";
import ErrorView from "./ErrorView";
import API_URL from "../config/api";
import { slugify } from "../utils/slugify";
import FilterBar from "./FilterBar";

export default function ProjectsWrapper({
  showFilter = false,
  marginTop = 0,
  limit,
}) {
  const { settings } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const typeParam = searchParams.get("type");

  const projectsUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.projects === true;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/projects`);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      const projectsData = (
        Array.isArray(data) ? data : data?.data || []
      ).filter((p) => p.isActive === true);

      setProjects(projectsData);
    } catch (err) {
      console.log("Fetch error:", err);

      if (!navigator.onLine) {
        setErrorType("network");
      } else if (err instanceof TypeError) {
        setErrorType("server");
      } else {
        setErrorType("default");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = [
    "All",
    ...new Set(projects.map((p) => p.projectType).filter(Boolean)),
  ];

  const getCategoryFromParam = (param) => {
    if (!param) {
      return "All";
    }

    const normalizedParam = param.replace(/\s/g, "").toLowerCase();

    return (
      categories.find(
        (category) =>
          category.replace(/\s/g, "").toLowerCase() === normalizedParam,
      ) || "All"
    );
  };

  const selectedCategory = getCategoryFromParam(typeParam);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projects);
      return;
    }

    setFilteredProjects(
      projects.filter(
        (project) =>
          project.projectType?.replace(/\s/g, "").toLowerCase() ===
          selectedCategory.replace(/\s/g, "").toLowerCase(),
      ),
    );
  }, [projects, selectedCategory]);

  const handleFilterChange = (category) => {
    const selectedCategory = category || "All";
    const params = new URLSearchParams(searchParams);

    if (selectedCategory === "All") {
      params.delete("type");
    } else {
      params.set("type", selectedCategory.replace(/\s/g, "").toLowerCase());
    }

    setSearchParams(params);
  };

  return (
    <div className={styles.projectsWrapper}>
      {showFilter && !projectsUnderMaintenance && projects.length > 0 && (
        <div className={styles.filterWrapper}>
          <FilterBar
            categories={categories}
            defaultCategory={selectedCategory}
            onFilterChange={handleFilterChange}
            marginBottom={3}
          />
        </div>
      )}

      <div
        className={styles.contentWrapper}
        style={{ marginTop: `${marginTop}rem` }}
      >
        {projectsUnderMaintenance && (
          <ErrorView
            errType="default"
            errorText={
              <>
                Under maintenace. <br />
                Please check back later.
              </>
            }
          />
        )}

        {!projectsUnderMaintenance && loading && <LoaderView />}

        {!projectsUnderMaintenance && !loading && errorType && (
          <ErrorView errType={errorType} onRetry={fetchProjects} />
        )}

        {!projectsUnderMaintenance &&
          !loading &&
          !errorType &&
          filteredProjects.length === 0 && (
            <ErrorView
              errType="default"
              errorText={
                <>
                  Couln't find projects, <br />
                  come back later
                </>
              }
              onRetry={fetchProjects}
            />
          )}

        {!projectsUnderMaintenance &&
          !loading &&
          !errorType &&
          filteredProjects.length > 0 && (
            <div className={styles.wrapAllProjects}>
              {filteredProjects
                .slice(0, limit ?? filteredProjects.length)
                .map((project, index) => (
                  <Project
                    key={project._id || index}
                    isProjNew={project.isProjNew}
                    projectOrder={project.order}
                    projectIcon={project.projectIcon}
                    projectName={project.projectName}
                    projectStatus={project.projectStatus}
                    projectSummary={project.projectShortDescription}
                    projectType={project.projectType}
                    projectLink={`/projects/${slugify(project.projectName)}`}
                  />
                ))}
            </div>
          )}
      </div>
    </div>
  );
}
