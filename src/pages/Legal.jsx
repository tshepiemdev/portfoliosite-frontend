import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import styles from "../styles/Legal.module.css";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import PageHelmet from "../components/PageHelmet";
import LegalBox from "../components/LegalBox";
import API_URL from "../config/api";
import { slugify } from "../utils/slugify";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";
import starImg from "../assets/icons/logo-black.svg";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";

export default function Legal() {
  const { settings } = useOutletContext();

  const [myLegal, setLegal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const legalUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.legal === true;

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
        url={window.location.href}
        keywords="legal information, privacy policy, terms of service, business policies, tshepiem.dev"
        siteName=""
      />

      <div className={styles.legalWrapper}>
        <PageTopHeading
          title={<>Legal</>}
          subtext={
            <>
              Browse site's and affiliated <br />
              partners legal resources.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <div className={styles.legalContainer}>
          {legalUnderMaintenance && (
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

          {!legalUnderMaintenance && loading && <LoaderView />}

          {!legalUnderMaintenance && !loading && errorType && (
            <ErrorView errType={errorType} onRetry={fetchLegal} />
          )}

          {!legalUnderMaintenance &&
            !loading &&
            !errorType &&
            myLegal.length === 0 && (
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

          {!legalUnderMaintenance &&
            !loading &&
            !errorType &&
            myLegal.length > 0 && (
              <div className={styles.legalGridWrapper}>
                <div className={styles.bento}>
                  <div className={styles.optionIconWrapper}>
                    <img
                      className={styles.optionIcon}
                      src={starImg}
                      loading="lazy"
                    />
                  </div>
                  <h2 className={styles.bentoName}>
                    Centralised space for <br />
                    legal guidelines and resources
                  </h2>

                  <p className={styles.description}>
                    Browse legal information resources <br />
                    concerning products, provided services
                    <br />
                    and affiliated partners.
                  </p>
                </div>

                <div className={styles.bento}>
                  <h4 className={styles.miniHeading}>
                    All resources <span className={styles.dot}>•</span> <span className={styles.text}>{myLegal.length} listings found</span>
                  </h4>
                </div>
                {myLegal.map((legal) => (
                  <LegalBox
                    key={legal._id}
                    name={legal.name}
                    legalFor={legal.for}
                    link={`/legal/${slugify(legal.for + "-" + legal.name)}`}
                  />
                ))}
                <div className={styles.bento}>
                  <div className={styles.optionIconWrapper}>
                    <img
                      className={styles.optionIcon}
                      src={starImg}
                      loading="lazy"
                    />
                  </div>
                  <h2 className={styles.bentoName}>
                    Couldn't find what <br />
                    you were looking for?
                  </h2>

                  <p className={styles.description}>
                    It's okay, no need to worry. Head to help center for an
                    assitance or you may directly contact me at{" "}
                    <a
                      className={styles.link}
                      href="mailto:support@tshepiem.dev"
                    >
                      support@tshepiem.dev
                    </a>{" "}
                    and I'll get back to you as soon as possible.
                  </p>

                  <BtnCTAWhiteSmall buttonText={"Head to help center"} href={"/help-center"} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
