import { useEffect, useState } from "react";
import { data, Outlet, useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionDevider from "../components/SectionDevider";
import MaintenanceView from "./MaintenanceView";
import LoaderMaxView from "./LoaderMax";
import ErrorMaxView from "./ErrorMaxView";
import BottomBar from "./BottomBar";
import API_URL from "../config/api";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        if (!navigator.onLine) {
          setError("network");
        } else {
          setError("server");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <LoaderMaxView />;
  }

  if (error && import.meta.env.PROD) {
    return <ErrorMaxView errType={error} onRetry={handleRetry} />;
  }

  const pathname = location.pathname;

  let pageName = null;

  if (pathname === "/") {
    pageName = "home";
  } else if (pathname === "/contact" || pathname === "/get-in-touch") {
    pageName = "contact";
  } else if (pathname === "/service-request") {
    pageName = "serviceRequest";
  } else if (pathname === "/hire-me") {
    pageName = "hireMe";
  } else if (pathname === "/services" || pathname.startsWith("/services/")) {
    pageName = "services";
  } else if (pathname === "/projects" || pathname.startsWith("/projects/")) {
    pageName = "projects";
  } else if (pathname === "/legal" || pathname.startsWith("/legal/")) {
    pageName = "legal";
  } else if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    pageName = "blogs";
  } else if (
    pathname === "/help-center" ||
    pathname.startsWith("/help-center/")
  ) {
    pageName = "helpCenter";
  } else if (pathname === "/cv" || pathname === "/resume") {
    pageName = "cv";
  } else if (pathname === "/pricing") {
    pageName = "pricing";
  } else if (
    pathname.startsWith("/subscribe/verify/") ||
    pathname.startsWith("/subscribe/unsubscribe/")
  ) {
    pageName = "subscribeVerify";
  }

  const pageUnderMaintenance =
    pageName && settings?.maintenancePages?.[pageName] === true;

  const isUnderMaintenance =
    import.meta.env.PROD &&
    (settings?.maintenanceMode === true || pageUnderMaintenance);

  if (isUnderMaintenance) {
    return (
      <div className={styles.layout}>
        <Header />
        <MaintenanceView data={settings} pageName={pageName} />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.content}>
        <Outlet />
      </main>

      <SectionDevider />
      <Footer />
      <BottomBar />
    </div>
  );
}
