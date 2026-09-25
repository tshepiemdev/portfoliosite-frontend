import { useLoaderData, useRevalidator, useLocation } from "react-router";
import { slugify } from "../utils/slugify";
import styles from "../styles/LegalPage.module.css";
import NotFound from "./NotFound";
import MarkdownText from "../components/MarkdownText";
import API_URL from "../config/api";
import PageTopHeading from "../components/PageTopHeading";
import ErrorMaxView from "../components/ErrorMaxView";
import ogImages from "../config/ogImages";
import createMeta from "../config/seo";

export async function loader({ params }) {
  try {
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
        item.slug === params.slug ||
        slugify(item.for + "-" + item.name) === params.slug,
    );

    if (!found) {
      return {
        legal: null,
        notFound: true,
        error: null,
      };
    }

    return {
      legal: found,
      notFound: false,
      error: null,
    };
  } catch (err) {
    console.error("Failed to fetch legal information:", err);

    return {
      legal: null,
      notFound: false,
      error: err instanceof TypeError ? "server" : "default",
    };
  }
}

export function meta({ data, params }) {
  if (!data?.legal) {
    return createMeta({
      title: "Legal",
      description:
        "Legal information, policies, notices, and documentation for tshepiem.dev.",
      url: `/legal/${params.slug}`,
      robots: "noindex, nofollow",
    });
  }

  const legal = data.legal;

  return createMeta({
    title: legal.name,
    description: `Legal Information & Notices`,
    image: ogImages.legal,
    url: `/legal/${legal.slug || params.slug}`,
    keywords: `legal, ${legal.name}, ${legal.for}, tshepiem.dev policies`,
    siteName: "tshepiem.dev",
    titleSuffix: "Legal",
  });
}

export default function LegalPage() {
  const { legal, notFound, error } = useLoaderData();
  const revalidator = useRevalidator();
  const location = useLocation();

  const loading = revalidator.state === "loading";
  const siteUrl = `https://tshepiem.dev${location.pathname}`;

  const handleRetry = () => {
    revalidator.revalidate();
  };

  if (loading) {
    return null;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error) {
    return <ErrorMaxView errType={error} onRetry={handleRetry} />;
  }

  if (!legal) {
    return <ErrorMaxView errType="default" onRetry={handleRetry} />;
  }

  return (
    <div className={styles.legalPage}>
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
