import { useEffect, useMemo, useState } from "react";
import {
  useLoaderData,
  useRevalidator,
  useLocation,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import styles from "../styles/Pricing.module.css";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import PricingCard from "../components/PricingCard";
import FilterBar from "../components/FilterBar";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";

const SITE_URL = "https://tshepiem.dev";

export async function loader() {
  try {
    const res = await fetch(`${API_URL}/api/pricings`);

    let data;

    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      throw new Error(data?.message || `Request failed (${res.status})`);
    }

    const pricingData = Array.isArray(data?.data) ? data.data : [];

    const flatPackages = pricingData.flatMap((category) =>
      Array.isArray(category?.packages)
        ? category.packages
            .filter((pkg) => pkg?.isActive)
            .map((pkg) => ({
              ...pkg,
              type: category.type,
            }))
        : [],
    );

    const categories = [
      "All",
      ...pricingData
        .filter((category) => category?.isActive && category?.type)
        .map((category) =>
          category.type
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/^./, (char) => char.toUpperCase()),
        ),
    ];

    return {
      allPackages: flatPackages,
      categories: [...new Set(categories)],
      errorType: null,
    };
  } catch {
    return {
      allPackages: [],
      categories: ["All"],
      errorType: "default",
    };
  }
}

export default function Pricing() {
  const { settings } = useOutletContext();
  const { allPackages, categories, errorType } = useLoaderData();
  const revalidator = useRevalidator();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const serviceParam = searchParams.get("service");

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
    getCategoryFromParam(serviceParam),
  );

  useEffect(() => {
    setSelectedCategory(getCategoryFromParam(serviceParam));
  }, [serviceParam, categories]);

  const loading = revalidator.state === "loading";

  const pricingUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.pricing === true;

  const filteredPackages = useMemo(() => {
    if (selectedCategory === "All") {
      return allPackages;
    }

    const normalizedCategory = selectedCategory
      .replace(/\s/g, "")
      .toLowerCase();

    return allPackages.filter(
      (pkg) =>
        pkg.type?.replace(/\s/g, "").toLowerCase() === normalizedCategory,
    );
  }, [allPackages, selectedCategory]);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      searchParams.delete("service");
    } else {
      const normalizedCategory = category.replace(/\s/g, "").toLowerCase();

      searchParams.set("service", normalizedCategory);
    }

    setSearchParams(searchParams);
  };

  const handleRetry = () => {
    revalidator.revalidate();
  };

  const siteUrl = `${SITE_URL}${location.pathname}${location.search}`;

  return (
    <div className={styles.pricing}>
      <PageHelmet
        title="Pricing"
        description="Choose a package that fits your goals whether you're starting out, growing, or scaling big."
        image={ogImages.pricing}
        url={siteUrl}
        keywords="software development pricing, website packages, web application pricing, mobile app development, developer services"
        siteName=""
      />

      <div className={styles.pricingWrapper}>
        <PageTopHeading
          title={<>Pricing</>}
          subtext={
            <>
              Choose a package built to align <br />
              seamlessly with your goals.
            </>
          }
        />

        {pricingUnderMaintenance && (
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

        {!pricingUnderMaintenance && loading && <LoaderView />}

        {!pricingUnderMaintenance && !loading && errorType && (
          <ErrorView errType={errorType} onRetry={handleRetry} />
        )}

        {!pricingUnderMaintenance &&
          !loading &&
          !errorType &&
          filteredPackages.length === 0 && (
            <ErrorView
              errType="default"
              errorText="No packages found"
              onRetry={handleRetry}
            />
          )}

        {!pricingUnderMaintenance && !loading && !errorType && (
          <>
            <FilterBar
              categories={categories}
              defaultCategory={selectedCategory}
              onFilterChange={handleFilterChange}
              marginTop={0}
              marginBottom={2}
            />

            {filteredPackages.length > 0 && (
              <div className={styles.pricingGrid}>
                {filteredPackages.map((pkg, index) => (
                  <PricingCard
                    key={pkg._id || index}
                    type={pkg.type}
                    packageType={pkg.package}
                    title={pkg.title}
                    nowPrice={pkg.nowPrice}
                    oldPrice={pkg.oldPrice}
                    per={pkg.per}
                    isFeatured={pkg.isFeatured}
                    description={pkg.description}
                    features={pkg.features}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
