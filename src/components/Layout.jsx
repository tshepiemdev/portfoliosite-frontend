import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionDevider from "../components/SectionDevider";
import MaintenanceView from "./MaintenanceView";
import LoaderMaxView from "./LoaderMax";
import styles from "../styles/Layout.module.css";
import BottomBar from "./BottomBar";
import API_URL from "../config/api";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        setSettings(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoaderMaxView />;
  }

  if (settings?.maintenanceMode === true) {
    return (
      <div className={styles.layout}>
        <MaintenanceView data={settings} />
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
