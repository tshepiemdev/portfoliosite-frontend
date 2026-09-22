const SITE_URL = "https://tshepiem.dev";
const ogFallbackImage = "/og-banner.png";

const toAbsolute = (value) => {
  if (!value) return undefined;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
};

const createMeta = ({
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
  titleSuffix = "",
}) => {
  const baseTitle = title || siteName;

  const fullTitle = titleSuffix ? `${baseTitle} | ${titleSuffix}` : baseTitle;

  const metaImage = toAbsolute(image || ogFallbackImage);
  const isNoIndex = robots.includes("noindex");
  const canonicalUrl = url ? toAbsolute(url) : undefined;

  return [
    { title: fullTitle },

    ...(description ? [{ name: "description", content: description }] : []),

    ...(keywords ? [{ name: "keywords", content: keywords }] : []),

    { name: "author", content: author },
    { name: "robots", content: robots },
    { name: "theme-color", content: themeColor },

    ...(!isNoIndex && canonicalUrl
      ? [
          {
            tagName: "link",
            rel: "canonical",
            href: canonicalUrl,
          },
        ]
      : []),

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: siteName },
    { property: "og:title", content: fullTitle },

    ...(description
      ? [
          {
            property: "og:description",
            content: description,
          },
        ]
      : []),

    ...(canonicalUrl
      ? [
          {
            property: "og:url",
            content: canonicalUrl,
          },
        ]
      : []),

    { property: "og:image", content: metaImage },
    { property: "og:locale", content: locale },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },

    ...(description
      ? [
          {
            name: "twitter:description",
            content: description,
          },
        ]
      : []),

    { name: "twitter:image", content: metaImage },
  ];
};

export default createMeta;
