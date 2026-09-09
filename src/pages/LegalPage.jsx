import { useLoaderData, useRevalidator, useLocation } from "react-router-dom";
import { slugify } from "../utils/slugify";
import styles from "../styles/LegalPage.module.css";
import NotFound from "./NotFound";
import MarkdownText from "../components/MarkdownText";
import API_URL from "../config/api";
import PageHelmet from "../components/PageHelmet";
import PageTopHeading from "../components/PageTopHeading";
import ErrorMaxView from "../components/ErrorMaxView";
import ogImages from "../config/ogImages";

const SITE_URL = "https://tshepiem.dev";
const isBrowser = typeof window !== "undefined";

export async function loader({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(`${API_URL}/api/legals`);

    if (!res.ok) throw new Error("server");

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
      return { legal: null, notFound: true, error: null };
    }

    return { legal: found, notFound: false, error: null };
  } catch {
    const isOffline = isBrowser && !navigator.onLine;
    return { legal: null, notFound: false, error: isOffline ? "network" : "server" };
  }
}

export default function LegalPage() {
  const { legal, notFound, error } = useLoaderData();
  const revalidator = useRevalidator();
  const location = useLocation();

  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const handleRetry = () => revalidator.revalidate();

  if (notFound) return <NotFound />;

  if (error) {
    return <ErrorMaxView errType={error} onRetry={handleRetry} />;
  }

  if (!legal) {
    return <ErrorMaxView errType="default" onRetry={handleRetry} />;
  }

  return (
    <div className={styles.legalPage}>
      <PageHelmet
        title={legal.name}
        description={`Legal Information & Notices by ${legal.for}`}
        image={ogImages.legal}
        url={canonicalUrl}
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
          showNav
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