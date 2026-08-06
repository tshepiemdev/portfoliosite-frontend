import { useEffect, useState } from "react";
import styles from "../styles/SkillListingWrapper.module.css";
import SkillListingBentoBox from "./SkillListingBentoBox";
import API_URL from "../config/api";
import LoaderView from "./Loader";
import ErrorView from "./ErrorView";

export default function SkillListingWrapper() {
  const [techStack, setTechStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/skills`);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      const skillsData = (data.data || []).filter((s) => s.isActive === true);

      setTechStack(skillsData);
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
    fetchSkills();
  }, []);

  return (
    <div className={styles.wrapAll}>
      <div className={styles.ListingWrapper}>
        {loading && (
          <div className={styles.fullSpan}>
            <LoaderView />
          </div>
        )}

        {!loading && errorType && (
          <ErrorView errType={errorType} onRetry={fetchSkills} />
        )}

        {!loading && !errorType && techStack.length === 0 && (
          <ErrorView
            errType="default"
            errorText="Couldn't find any listed skills & techstack"
            onRetry={fetchSkills}
          />
        )}

        {!loading && !errorType && (
          <div className={styles.skillList}>
            {techStack.map((categoryObj, index) => (
              <SkillListingBentoBox
                key={categoryObj._id || index}
                listImg={categoryObj.img}
                listHeader={categoryObj.category}
                listItem={categoryObj.items}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
