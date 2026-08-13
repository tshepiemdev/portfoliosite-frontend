import { useEffect, useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import styles from "../styles/Pricing.module.css";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import PricingCard from "../components/PricingCard";
import FilterBar from "../components/FilterBar";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";

export default function Pricing() {
  const { settings } = useOutletContext();
  const [searchParams] = useSearchParams();

  const serviceParam = searchParams.get("service");

  const activeCategory = serviceParam
    ? serviceParam
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (char) => char.toUpperCase())
    : "All";

  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const pricingUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.pricing === true;

  const fetchPricing = async () => {
    try {
      setLoading(true);
      setErrorType(null);

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

      const pricingData = data.data || [];

      const flatPackages = pricingData.flatMap((category) =>
        category.packages
          .filter((pkg) => pkg.isActive)
          .map((pkg) => ({
            ...pkg,
            type: category.type,
          })),
      );

      const dynamicCategories = [
        "All",
        ...pricingData
          .filter((category) => category.isActive)
          .map((category) =>
            category.type
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace(/^./, (char) => char.toUpperCase()),
          ),
      ];

      setCategories(dynamicCategories);
      setAllPackages(flatPackages);

      if (serviceParam) {
        const filtered = flatPackages.filter(
          (pkg) => pkg.type.toLowerCase() === serviceParam.toLowerCase(),
        );

        setFilteredPackages(filtered);
      } else {
        setFilteredPackages(flatPackages);
      }
    } catch (err) {
      console.log("Pricing fetch error:", err);

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
    fetchPricing();
  }, [serviceParam]);

  const handleFilterChange = (category) => {
    if (category === "All") {
      setFilteredPackages(allPackages);
      return;
    }

    const filtered = allPackages.filter(
      (pkg) =>
        pkg.type.toLowerCase() === category.replace(/\s/g, "").toLowerCase(),
    );

    setFilteredPackages(filtered);
  };

  return (
    <div className={styles.pricing}>
      <PageHelmet
        title="Pricing"
        description="Choose a package that fits your goals whether you're starting out, growing, or scaling big."
        image={ogImages.pricing}
        url={window.location.href}
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
          <ErrorView errType={errorType} onRetry={fetchPricing} />
        )}

        {!pricingUnderMaintenance &&
          !loading &&
          !errorType &&
          filteredPackages.length === 0 && (
            <ErrorView
              errType="default"
              errorText="No packages found"
              onRetry={fetchPricing}
            />
          )}

        {!pricingUnderMaintenance && !loading && !errorType && (
          <>
            <FilterBar
              categories={categories}
              defaultCategory={activeCategory}
              onFilterChange={handleFilterChange}
              marginTop={0}
              marginBottom={2}
            />

            {filteredPackages.length > 0 && (
              <div className={styles.pricingGrid}>
                {filteredPackages.map((pkg, index) => (
                  <PricingCard
                    key={index}
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
