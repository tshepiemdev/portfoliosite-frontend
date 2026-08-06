import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../styles/HelpCenter.module.css";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import PageHelmet from "../components/PageHelmet";
import HelpCenterBox from "../components/HelpCenterBox";
import API_URL from "../config/api";
import SearchBar from "../components/SearchBar";
import SearchErrorView from "../components/SearchErrorView";
import SearchErrorImg from "../assets/icons/not-found-alt.svg";
import PageTopHeading from "../components/PageTopHeading";
import HelpOptionBox from "../components/HelpOptionBox";
import starImg from "../assets/icons/logo-black.svg";
import faqsImg from "../assets/icons/logo-black.svg";
import fileImg from "../assets/icons/folder.svg";
import pagesImg from "../assets/icons/objects-column (1).svg";
import contactImg from "../assets/icons/triangle-warning-black.svg";
import helpCategoryIcons from "../utils/helpCategoryIcons";
import contactInfo from "../config/contactInfo";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import phoneImg from "../assets/icons/phone-flip.svg";
import emailImg from "../assets/icons/envelope.svg";
import threadsImg from "../assets/icons/threads.svg";
import xImg from "../assets/icons/twitter-alt.svg";
import instaImg from "../assets/icons/instagram-logo-fill.svg";
import plusImg from "../assets/icons/plus.svg";
import minusImg from "../assets/icons/minus.svg";
import handImg from "../assets/icons/hand-wave (1).svg";
import ogImages from "../config/ogImages";

const socialIcons = {
  LinkedIn: linkedInImg,
  Instagram: instaImg,
  Twitter: xImg,
  Threads: threadsImg,
  Facebook: pagesImg,
  YouTube: pagesImg,
  GitHub: pagesImg,
};

const helpOptions = [
  {
    type: "single",
    icon: faqsImg,
    name: (
      <>
        FAQs. Your search <br />
        for help starts here
      </>
    ),
    url: "",
    focusTo: "helpArticles",
    isFeatured: true,
    isPopular: true,
    optionCTAText: "Browse help articles",
  },
  {
    type: "group",
    icon: pagesImg,
    name: (
      <>
        Pages you may <br />
        be looking for
      </>
    ),
    url: "",
    isFeatured: true,
    options: [
      {
        name: "/Services",
        url: "/services",
        icon: "",
      },
      {
        name: "/Pricing",
        url: "/pricing",
        icon: "",
      },
      {
        name: "/Blog",
        url: "/blog",
        icon: "",
      },
    ],
  },
  {
    type: "single",
    icon: fileImg,
    name: (
      <>
        Resources you may
        <br />
        be looking for
      </>
    ),
    url: "/legal",
    isFeatured: true,
    optionCTAText: "Browse legal resources",
  },
];

const helpBottomOptions = [
  {
    type: "single",
    icon: contactImg,
    name: (
      <>
        Still need
        <br />
        assistance?
      </>
    ),
    url: "/contact?reason=support",
    isFeatured: true,
    optionCTAText: "Contact support",
  },
  {
    type: "single",
    icon: pagesImg,
    name: (
      <>
        Based in South <br />
        Africa, Pretoria
      </>
    ),
    description: "",
    url: contactInfo.personal.address.mapsUrl,
    isFeatured: false,
    optionCTAText: "Search on maps",
  },
  {
    type: "single",
    icon: handImg,
    name: (
      <>
        More contact options <br />
        to choose from
      </>
    ),
    description: "",
    url: "",
    isFeatured: true,
    options: [
      {
        name: "Phone",
        url: `tel:${contactInfo.personal.phone}`,
        icon: phoneImg,
      },
      {
        name: "Mail me",
        url: `mailto:${contactInfo.personal.email}`,
        icon: emailImg,
      },

      ...contactInfo.social
        .filter((social) =>
          ["LinkedIn", "Instagram", "Twitter", "Threads"].includes(social.name),
        )
        .map((social) => ({
          name: social.name,
          url: social.url,
          icon: socialIcons[social.name] || pagesImg,
        })),
    ],
  },
];

export default function HelpCenter() {
  const [helpSections, setHelpSections] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (title) => {
    setOpenCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setSearchLoading(false);
    }, 300);

    setSearchLoading(true);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchHelpCenter = useCallback(async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/helpcenters`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed fetching help center");
      }

      const sections = (data.data || [])
        .filter((section) => section.isActive)

        .sort((a, b) => a.order - b.order)

        .map((section) => ({
          ...section,

          articles: (section.articles || [])
            .filter((article) => article.isActive)

            .sort((a, b) => a.order - b.order),
        }))

        .filter((section) => section.articles.length > 0);

      setHelpSections(sections);
    } catch (err) {
      console.error("Help center fetch error:", err);

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
  }, []);

  useEffect(() => {
    fetchHelpCenter();
  }, [fetchHelpCenter]);

  const filteredHelp = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return helpSections;
    }

    return helpSections

      .map((section) => ({
        ...section,

        articles: section.articles.filter(
          (article) =>
            article.title?.toLowerCase().includes(query) ||
            article.description?.toLowerCase().includes(query),
        ),
      }))

      .filter((section) => section.articles.length > 0);
  }, [helpSections, searchTerm]);

  const showSearch = !loading && !errorType;

  return (
    <div className={styles.helpCenter}>
      <PageHelmet
        title="Help Center"
        description="Browse help content, documentation, and assistance resources."
        image={ogImages.helpCenter}
        url={typeof window !== "undefined" ? window.location.href : ""}
        keywords="help center, documentation, support, tshepiem.dev"
        siteName=""
      />

      <div className={styles.helpCenterWrapper}>
        <PageTopHeading
          title="Help Center"
          subtext={
            <>
              Browse help content, documentation,
              <br />
              and assistance resources.
            </>
          }
          textAlign="center"
          centerContent="center"
        />

        <div className={styles.helpGrid}>
          <div className={styles.helpOptionsWrapper}>
            {helpOptions.map((option) => (
              <HelpOptionBox
                key={option.optionCTAText}
                icon={option.icon}
                name={option.name}
                description={option.description}
                optionCTALink={option.url}
                optionCTAText={option.optionCTAText}
                isFeatured={option.isFeatured}
                isPopular={option.isPopular}
                options={option.options}
                type={option.type}
                focusTo={option.focusTo}
              />
            ))}
          </div>

          <div className={styles.box} id="helpArticles" tabIndex="-1">
            <div className={styles.helpCenterArticles}>
              <div className={styles.topWrapper}>
                <h2 className={styles.sectionTitle}>Help Articles</h2>

                <h2 className={styles.bentoName}>
                  Search help articles,
                  <br />
                  never get lost again
                </h2>
                {showSearch && (
                  <SearchBar
                    value={searchInput}
                    onChange={setSearchInput}
                    placeholder="Search help articles"
                  />
                )}
              </div>

              {(loading || searchLoading) && (
                <LoaderView bg="black" border="none" />
              )}

              {!loading && errorType && (
                <ErrorView errType={errorType} onRetry={fetchHelpCenter} />
              )}

              {!loading &&
                !searchLoading &&
                !errorType &&
                filteredHelp.length === 0 && (
                  <SearchErrorView
                    icon={SearchErrorImg}
                    header={
                      <>
                        Your search couldn't <br />
                        be found in articles
                      </>
                    }
                    subText="Try searching for something else."
                    bg="black"
                    border="none"
                  />
                )}

              {!loading &&
                !searchLoading &&
                !errorType &&
                filteredHelp.map((section) => (
                  <section
                    key={section.title}
                    className={`${styles.helpCategory} ${
                      openCategories[section.title] ? styles.openCategory : ""
                    }`}
                  >
                    <button
                      className={styles.categoryHeader}
                      onClick={() => toggleCategory(section.title)}
                      aria-expanded={openCategories[section.title]}
                    >
                      <h3 className={styles.categoryTitle}>
                        <div
                          className={`${styles.categoryImgWrapper} ${
                            openCategories[section.title]
                              ? styles.openIcon
                              : styles.closedIcon
                          }`}
                        >
                          <img
                            className={styles.categoryIcon}
                            src={helpCategoryIcons[section.icon] || starImg}
                            alt={section.title}
                          />
                        </div>

                        {section.title}
                      </h3>

                      <span className={styles.chevron}>
                        <img
                          className={styles.chevronImg}
                          src={
                            openCategories[section.title] ? minusImg : plusImg
                          }
                          alt={
                            openCategories[section.title]
                              ? "Close category"
                              : "Open category"
                          }
                        />
                      </span>
                    </button>

                    {openCategories[section.title] && (
                      <>
                        {section.description && (
                          <p className={styles.categoryDescription}>
                            {section.description}
                          </p>
                        )}

                        <div className={styles.articlesGrid}>
                          {section.articles.map((article) => (
                            <HelpCenterBox
                              key={`${section.title}-${article.title}`}
                              title={article.title}
                              description={article.description}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </section>
                ))}
            </div>
          </div>

          <div className={styles.helpOptionsWrapper}>
            {helpBottomOptions.map((option) => (
              <HelpOptionBox
                key={option.name}
                icon={option.icon}
                name={option.name}
                description={option.description}
                optionCTALink={option.url}
                optionCTAText={option.optionCTAText}
                isFeatured={option.isFeatured}
                isPopular={option.isPopular}
                options={option.options}
                type={option.type}
                focusTo={option.focusTo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
