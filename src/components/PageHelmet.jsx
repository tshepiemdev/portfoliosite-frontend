import { Helmet } from "react-helmet-async";

const ogFallbackImage = "/og-banner.png";

export default function PageHelmet({
  title,
  description,
  image,
  url,
  keywords,
  author = "tshepiem.dev | Tshepang Mmathebe Kgaphola",
  themeColor = "#000000",
  robots = "index, follow",
  locale = "en_ZA",
  siteName = "tshepiem.dev",
}) {
  const fullTitle = title
    ? siteName
      ? `${title} | ${siteName}`
      : title
    : siteName;

  const metaImage = image || ogFallbackImage;

  const isNoIndex = robots.includes("noindex");

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description || ""} />
      <meta name="keywords" content={keywords || ""} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="theme-color" content={themeColor} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />

      {url && !isNoIndex && <link rel="canonical" href={url} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || ""} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={metaImage} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || ""} />
      <meta name="twitter:image" content={metaImage} />

      <link rel="icon" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/favicon.png" />

      <meta name="application-name" content={siteName} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      <meta name="referrer" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
}
