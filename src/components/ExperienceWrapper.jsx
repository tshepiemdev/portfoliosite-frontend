import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../styles/ExperienceWrapper.module.css";
import ExperienceBox from "./Experience";
import LoaderView from "./Loader";
import ErrorView from "./ErrorView";
import API_URL from "../config/api";

export default function ExperienceWrapper() {
  const { settings } = useOutletContext();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const experiencesUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.experiences === true;

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/experiences`);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch experiences");
      }

      const filtered = (data.data || [])
        .filter((e) => e.isActive === true)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

      setExperiences(filtered);
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
    fetchExperiences();
  }, []);

  return (
    <div className={styles.experienceWrapper}>
      {experiencesUnderMaintenance && (
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

      {!experiencesUnderMaintenance && loading && <LoaderView />}

      {!experiencesUnderMaintenance && !loading && errorType && (
        <ErrorView errType={errorType} onRetry={fetchExperiences} />
      )}

      {!experiencesUnderMaintenance &&
        !loading &&
        !errorType &&
        experiences.length === 0 && (
          <ErrorView
            errType="default"
            errorText="Couldn't find any listed working experiences"
            onRetry={fetchExperiences}
          />
        )}

      {!experiencesUnderMaintenance &&
        !loading &&
        !errorType &&
        experiences.length > 0 && (
          <div className={styles.wrapAllExperience}>
            {experiences.map((exp, index) => (
              <ExperienceBox
                key={exp._id || index}
                company={exp.company}
                position={exp.position}
                from={exp.from}
                to={exp.to}
                order={exp.order}
                location={exp.location}
                responsibilities={exp.responsibilities}
              />
            ))}
          </div>
        )}
    </div>
  );
}
