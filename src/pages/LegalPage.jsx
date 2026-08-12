import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { slugify } from "../utils/slugify";
import styles from "../styles/LegalPage.module.css";
import LoaderMaxView from "../components/LoaderMax";
import NotFound from "./NotFound";
import MarkdownText from "../components/MarkdownText";
import API_URL from "../config/api";
import PageHelmet from "../components/PageHelmet";
import PageTopHeading from "../components/PageTopHeading";
import ErrorMaxView from "../components/ErrorMaxView";
import ogImages from "../config/ogImages";

export default function LegalPage() {
  const { slug } = useParams();

  const [legal, setLegal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const fetchLegal = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      setError(null);

      const res = await fetch(`${API_URL}/api/legals`);

      if (!res.ok) {
        throw new Error("server");
      }

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("server");
      }

      const legals = Array.isArray(data) ? data : data?.data || [];

      const found = legals.find(
        (item) =>
          item.slug === slug || slugify(item.for + "-" + item.name) === slug,
      );

      if (!found) {
        setNotFound(true);
        return;
      }

      setLegal(found);
    } catch (err) {
      console.error("Failed to fetch legal information:", err);

      if (!navigator.onLine) {
        setError("network");
      } else {
        setError("server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegal();
  }, [slug]);

  if (loading) return <LoaderMaxView />;

  if (notFound) return <NotFound />;

  if (error) {
    return <ErrorMaxView errType={error} onRetry={fetchLegal} />;
  }

  if (!legal) {
    return <ErrorMaxView errType="default" onRetry={fetchLegal} />;
  }

  return (
    <div className={styles.legalPage}>
      <PageHelmet
        title={legal.name}
        description={`Legal Information & Notices by ${legal.for}`}
        image={ogImages.legal}
        url={window.location.href}
        keywords={`legal, ${legal.name}, ${legal.for}, tshepiem.dev policies`}
        siteName="Legal"
      />

      <div className={styles.legalWrapper}>
        <PageTopHeading
          title={<>{legal.name}</>}
          subtext={
            <>
              Legal Information & Notices <br />
              by {legal.for}
            </>
          }
          textAlign="start"
          centerContent="start"
        />

        <div className={styles.markdownWrapper}>
          <MarkdownText text={legal.text} />
        </div>

        <div className={styles.sectionBlock}>
          <p className={styles.miniHeader}>Feedback and Website Information</p>

          <p className={styles.text}>
            Any feedback, suggestions, ideas, or other information submitted
            through {legal.company} may be used to improve our website,
            services, and user experience. Unless otherwise agreed in writing,
            such feedback will not be considered confidential information.
          </p>

          <p className={styles.text}>
            We reserve the right to update, modify, or remove information,
            services, features, or content on this website at any time without
            prior notice. While we aim to provide accurate and current
            information, we do not guarantee that all content will always be
            complete, accurate, or up-to-date.
          </p>

          <p className={styles.text}>
            Copyright &copy; {legal.copyright_start}–{new Date().getFullYear()}{" "}
            {legal.company}. All rights reserved. {legal.company},{" "}
            {legal.company_address}.
          </p>

          <p className={styles.text}>
            This document was last updated by {legal.company} on{" "}
            {legal.last_update_date}.
          </p>
        </div>
      </div>
    </div>
  );
}
