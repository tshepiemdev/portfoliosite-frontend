import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionDevider from "../components/SectionDevider";
import MaintenanceView from "./MaintenanceView";
import LoaderMaxView from "./LoaderMax";
import ErrorMaxView from "./ErrorMaxView";
import BottomBar from "./BottomBar";
import API_URL from "../config/api";

const SETTINGS_CACHE_KEY = "site_settings";

const getPageName = (pathname) => {
  if (pathname === "/") return "home";

  if (pathname === "/contact" || pathname === "/get-in-touch") {
    return "contact";
  }

  if (pathname === "/service-request") return "serviceRequest";
  if (pathname === "/hire-me") return "hireMe";

  if (pathname === "/services" || pathname.startsWith("/services/")) {
    return "services";
  }

  if (pathname === "/projects" || pathname.startsWith("/projects/")) {
    return "projects";
  }

  if (pathname === "/legal" || pathname.startsWith("/legal/")) {
    return "legal";
  }

  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    return "blogs";
  }

  if (pathname === "/help-center" || pathname.startsWith("/help-center/")) {
    return "helpCenter";
  }

  if (pathname === "/cv" || pathname === "/resume") {
    return "cv";
  }

  if (pathname === "/pricing") return "pricing";

  if (
    pathname.startsWith("/subscribe/verify/") ||
    pathname.startsWith("/subscribe/unsubscribe/")
  ) {
    return "subscribeVerify";
  }

  return null;
};

const getCachedSettings = () => {
  try {
    const cachedSettings = localStorage.getItem(SETTINGS_CACHE_KEY);

    if (!cachedSettings) {
      return null;
    }

    return JSON.parse(cachedSettings);
  } catch {
    return null;
  }
};

const cacheSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
  } catch {
    return;
  }
};

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();

  const fetchSettings = async () => {
    try {
      setError(null);

      const response = await fetch(`${API_URL}/api/settings`);

      if (!response.ok) {
        throw new Error("server");
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error("server");
      }

      setSettings(data.data);
      cacheSettings(data.data);
    } catch (error) {
      if (!settings) {
        const cachedSettings = getCachedSettings();

        if (cachedSettings) {
          setSettings(cachedSettings);
        } else {
          setError(!navigator.onLine ? "network" : "server");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedSettings = getCachedSettings();

    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      fetchSettings();
    } else {
      fetchSettings();
    }
  }, []);

  const handleRetry = () => {
    setLoading(true);
    fetchSettings();
  };

  if (loading) {
    return <LoaderMaxView />;
  }

  if (error && import.meta.env.PROD && !settings) {
    return <ErrorMaxView errType={error} onRetry={handleRetry} />;
  }

  const pageName = getPageName(location.pathname);

  const pageUnderMaintenance =
    pageName && settings?.maintenancePages?.[pageName] === true;

  const globalMaintenance = settings?.maintenanceMode === true;

  const isUnderMaintenance =
    import.meta.env.PROD && (globalMaintenance || pageUnderMaintenance);

  if (isUnderMaintenance) {
    return (
      <div className={styles.layout}>
        {!globalMaintenance && <Header />}

        <MaintenanceView data={settings} pageName={pageName} />

        {!globalMaintenance && (
          <>
            <SectionDevider />
            <Footer />
            <BottomBar />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.content}>
        <Outlet context={{ settings }} />
      </main>

      <SectionDevider />
      <Footer />
      <BottomBar />
    </div>
  );
}
