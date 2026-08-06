import { useEffect, useState } from "react";
import styles from "../styles/Legal.module.css";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import PageHelmet from "../components/PageHelmet";
import LegalBox from "../components/LegalBox";
import API_URL from "../config/api";
import { slugify } from "../utils/slugify";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";

export default function Legal() {
  const [myLegal, setLegal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const fetchLegal = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/legals`);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch legal guidelines");
      }

      const legalData = (data.data || [])
        .filter((l) => l.isActive === true)
        .sort((a, b) => a.order - b.order);

      setLegal(legalData);
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
    fetchLegal();
  }, []);

  return (
    <div className={styles.legal}>
      <PageHelmet
        title="Legal"
        description="Explore legal information resources concerning products and provided services."
        image={ogImages.legal}
        url={typeof window !== "undefined" ? window.location.href : ""}
        keywords="legal information, privacy policy, terms of service, business policies, tshepiem.dev"
        siteName=""
      />

      <div className={styles.legalWrapper}>
        <PageTopHeading
          title={<>Legal Resources</>}
          subtext={
            <>
              Explore legal information resources <br />
              concerning products, provided services <br />
              and affiliated partners.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <div className={styles.legalContainer}>
          {loading && <LoaderView />}

          {!loading && errorType && (
            <ErrorView errType={errorType} onRetry={fetchLegal} />
          )}

          {!loading && !errorType && myLegal.length === 0 && (
            <ErrorView
              errType="default"
              errorText={
                <>
                  Couln't find any listed <br />
                  legal guidelines
                </>
              }
              onRetry={fetchLegal}
            />
          )}

          {!loading && !errorType && myLegal.length > 0 && (
            <div className={styles.legalGridWrapper}>
              {myLegal.map((legal) => (
                <LegalBox
                  key={legal._id}
                  name={legal.name}
                  legalFor={legal.for}
                  link={`/legal/${slugify(legal.for + "-" + legal.name)}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
