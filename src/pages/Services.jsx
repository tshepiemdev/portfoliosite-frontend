import { useEffect, useState } from "react";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
  useSearchParams,
} from "react-router";
import styles from "../styles/Services.module.css";
import ServiceBox from "../components/ServiceBox";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import API_URL from "../config/api";
import { slugify } from "../utils/slugify";
import FilterBar from "../components/FilterBar";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";
import createMeta from "../config/seo";

export async function loader() {
  try {
    const res = await fetch(`${API_URL}/api/services`, {
      signal: AbortSignal.timeout(4000),
    });

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
    if (err instanceof TypeError || err?.name === "TimeoutError") {
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

export function meta() {
  return createMeta({
    title: "Services",
    url: "/services",
    image: ogImages.services,
    description:
      "Building solutions for start-ups, medium and large-scale enterprise clients.",
    keywords:
      "software development services, software engineering services, developer services, web development services, website development services, web application development, web application development services, custom software development, custom software development services, custom application development, mobile app development, mobile application development, SaaS development, digital product development, frontend development services, backend development services, full-stack development services, API development services, REST API development, API integration, database development, database integration, UI development, responsive web development, responsive website development, modern website development, business website development, business software development, startup software development, small business software development, enterprise software development, scalable software solutions, software solutions, digital solutions, software applications, web applications, custom business applications, software architecture, application development, software engineering, React development, React.js development, JavaScript development, TypeScript development, Node.js development, Express.js development, C# development, .NET development, VB.NET development, MongoDB development, PostgreSQL development, SQL development, South African software development services, South Africa software developer, South Africa web development, Pretoria software development, Pretoria web developer, Pretoria software engineer, Gauteng software development, Gauteng web developer, independent software developer, freelance software developer, custom software developer Pretoria, web application developer Pretoria, tshepiem.dev services",
  });
}

export default function Services({ showFilter = true, marginTop = 0 }) {
  const { settings } = useOutletContext();
  const { services, errorType } = useLoaderData();
  const revalidator = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeParam = searchParams.get("type");

  const categories = [
    "All",
    ...new Set(services.map((service) => service.category).filter(Boolean)),
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

  const [selectedCategory, setSelectedCategory] = useState(
    getCategoryFromParam(typeParam),
  );

  useEffect(() => {
    setSelectedCategory(getCategoryFromParam(typeParam));
  }, [typeParam, services]);

  const servicesUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.services === true;

  const loading = revalidator.state === "loading";

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter(
          (service) =>
            service.category?.replace(/\s/g, "").toLowerCase() ===
            selectedCategory.replace(/\s/g, "").toLowerCase(),
        );

  const handleFilterChange = (category) => {
    const selected = category || "All";
    const params = new URLSearchParams(searchParams);

    if (selected === "All") {
      params.delete("type");
    } else {
      params.set("type", selected.replace(/\s/g, "").toLowerCase());
    }

    setSearchParams(params);
  };

  const handleRetry = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("type");

    setSearchParams(params);
    revalidator.revalidate();
  };

  return (
    <div className={styles.services}>
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
                  defaultCategory={selectedCategory}
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
                    Under maintenance. <br />
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
                      Couldn't find any <br />
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
