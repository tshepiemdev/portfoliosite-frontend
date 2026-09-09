import {
  Outlet,
  useLocation,
  useLoaderData,
  useRevalidator,
} from "react-router-dom";
import styles from "../styles/Layout.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionDevider from "../components/SectionDevider";
import MaintenanceView from "./MaintenanceView";
import ErrorMaxView from "./ErrorMaxView";
import BottomBar from "./BottomBar";
import AnalyticsTracker from "./AnalyticsTracker";
import ScrollToTop from "./ScrollToTop";
import API_URL from "../config/api";

const SETTINGS_CACHE_KEY = "site_settings";
const isBrowser = typeof window !== "undefined";

const getPageName = (pathname) => {
  if (pathname === "/") return "home";
  if (pathname === "/contact" || pathname === "/get-in-touch") return "contact";
  if (pathname === "/service-request") return "serviceRequest";
  if (pathname === "/hire-me") return "hireMe";
  if (pathname === "/services" || pathname.startsWith("/services/"))
    return "services";
  if (pathname === "/projects" || pathname.startsWith("/projects/"))
    return "projects";
  if (pathname === "/legal" || pathname.startsWith("/legal/")) return "legal";
  if (pathname === "/blog" || pathname.startsWith("/blog/")) return "blogs";
  if (pathname === "/help-center" || pathname.startsWith("/help-center/"))
    return "helpCenter";
  if (pathname === "/cv" || pathname === "/resume") return "cv";
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
  if (!isBrowser) return null;

  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const cacheSettings = (settings) => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
  } catch {
    return;
  }
};

export async function loader() {
  try {
    const response = await fetch(`${API_URL}/api/settings`);

    if (!response.ok) throw new Error("server");

    const data = await response.json();

    if (!data.success || !data.data) throw new Error("server");

    cacheSettings(data.data);

    return {
      settings: data.data,
      error: null,
    };
  } catch {
    const cached = getCachedSettings();

    if (cached) {
      return {
        settings: cached,
        error: null,
      };
    }

    const isOffline = isBrowser && !navigator.onLine;

    return {
      settings: null,
      error: isOffline ? "network" : "server",
    };
  }
}

export function shouldRevalidate() {
  return false;
}

export default function Layout() {
  const { settings, error } = useLoaderData();
  const revalidator = useRevalidator();
  const location = useLocation();

  const handleRetry = () => revalidator.revalidate();

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
        <ScrollToTop />
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
      <ScrollToTop />
      <AnalyticsTracker />
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
