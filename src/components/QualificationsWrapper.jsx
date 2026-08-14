import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../styles/QualificationsWrapper.module.css";
import QualificationBox from "./Qualification";
import API_URL from "../config/api";
import LoaderView from "./Loader";
import ErrorView from "./ErrorView";

export default function QualificationsWrapper() {
  const { settings } = useOutletContext();

  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const qualificationsUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.qualifications === true;

  const fetchQualifications = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/qualifications`);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch qualifications");
      }

      const filtered = (data.data || []).filter((q) => q.isActive === true);

      setQualifications(filtered);
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
    fetchQualifications();
  }, []);

  return (
    <div className={styles.qualificationsWrapper}>
      {qualificationsUnderMaintenance && (
        <div className={styles.fullSpan}>
          <ErrorView
            errType="default"
            errorText={
              <>
                Under maintenace. <br />
                Please check back later.
              </>
            }
          />
        </div>
      )}

      {!qualificationsUnderMaintenance && loading && (
        <div className={styles.fullSpan}>
          <LoaderView />
        </div>
      )}

      {!qualificationsUnderMaintenance && !loading && errorType && (
        <div className={styles.fullSpan}>
          <ErrorView errType={errorType} onRetry={fetchQualifications} />
        </div>
      )}

      {!qualificationsUnderMaintenance &&
        !loading &&
        !errorType &&
        qualifications.length === 0 && (
          <div className={styles.fullSpan}>
            <ErrorView
              errType="default"
              errorText={
                <>
                  Couldn't find any <br />
                  listed qualifications
                </>
              }
              onRetry={fetchQualifications}
            />
          </div>
        )}

      {!qualificationsUnderMaintenance &&
        !loading &&
        !errorType &&
        qualifications.length > 0 && (
          <div className={styles.wrapAllQualifications}>
            {qualifications.map((qualification, index) => (
              <QualificationBox
                key={qualification._id || index}
                status={qualification.status}
                type={qualification.type}
                name={qualification.name}
                institute={qualification.institute}
                year={qualification.year}
              />
            ))}
          </div>
        )}
    </div>
  );
}
