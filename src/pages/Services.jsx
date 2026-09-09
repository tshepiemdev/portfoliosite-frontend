import { useState } from "react";
import {
  useLoaderData,
  useLocation,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";
import styles from "../styles/Services.module.css";
import ServiceBox from "../components/ServiceBox";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import { slugify } from "../utils/slugify";
import FilterBar from "../components/FilterBar";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";

const SITE_URL = "https://tshepiem.dev";

export async function loader() {
  try {
    const res = await fetch(`${API_URL}/api/services`);

    let data;

    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      throw new Error(data?.message || `Request failed (${res.status})`);
    }

    const servicesData = (Array.isArray(data) ? data : data?.data || []).filter(
      (service) => service.isActive === true,
    );

    return {
      services: servicesData,
      errorType: null,
    };
  } catch (err) {
    if (err instanceof TypeError) {
      return {
        services: [],
        errorType: "server",
      };
    }

    return {
      services: [],
      errorType: "default",
    };
  }
}

export default function Services({ showFilter = true, marginTop = 0 }) {
  const { settings } = useOutletContext();
  const { services, errorType } = useLoaderData();
  const revalidator = useRevalidator();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const servicesUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.services === true;

  const loading = revalidator.state === "loading";

  const siteUrl = `${SITE_URL}${location.pathname}`;

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter(
          (service) =>
            service.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const categories = [
    "All",
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  const handleRetry = () => {
    setSelectedCategory("All");
    revalidator.revalidate();
  };

  return (
    <div className={styles.services}>
      <PageHelmet
        title="Services"
        image={ogImages.services}
        description="Building solutions for start-ups, medium and large-scale enterprise clients."
        url={siteUrl}
        keywords="developer services, website development, web applications, mobile apps, software solutions, Tshepiem Dev"
        siteName=""
      />

      <div className={styles.servicesWrapper}>
        <div className={styles.topWrapper}>
          <PageTopHeading
            title={<>Services</>}
            subtext={
              <>
                Building solutions for startup <br />
                and enterprise clients.
              </>
            }
            textAlign="center"
            centerContent="center"
          />

          {showFilter &&
            !servicesUnderMaintenance &&
            !errorType &&
            services.length > 0 && (
              <div className={styles.filterWrapper}>
                <FilterBar
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  marginTop={0}
                  marginBottom={2}
                />
              </div>
            )}
        </div>

        <div
          className={styles.contentWrapper}
          style={{ marginTop: `${marginTop}rem` }}
        >
          {servicesUnderMaintenance && (
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

          {!servicesUnderMaintenance && loading && (
            <div className={styles.fullSpan}>
              <LoaderView />
            </div>
          )}

          {!servicesUnderMaintenance && !loading && errorType && (
            <div className={styles.fullSpan}>
              <ErrorView errType={errorType} onRetry={handleRetry} />
            </div>
          )}

          {!servicesUnderMaintenance &&
            !loading &&
            !errorType &&
            filteredServices.length === 0 && (
              <div className={styles.fullSpan}>
                <ErrorView
                  errType="default"
                  errorText={
                    <>
                      Couln't find any <br />
                      listed services
                    </>
                  }
                  onRetry={handleRetry}
                />
              </div>
            )}

          {!servicesUnderMaintenance &&
            !loading &&
            !errorType &&
            filteredServices.length > 0 && (
              <div className={styles.servicesGrid}>
                {filteredServices.map((service, index) => (
                  <ServiceBox
                    key={service._id || index}
                    name={service.name}
                    serviceLink={`/services/${slugify(service.name)}`}
                    isFeatured={service.isFeatured}
                  />
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
