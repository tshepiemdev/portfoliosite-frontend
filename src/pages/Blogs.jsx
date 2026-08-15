import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../styles/Blogs.module.css";
import BlogBox from "../components/BlogBox";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import SearchErrorView from "../components/SearchErrorView";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import FilterBar from "../components/FilterBar";
import { slugify } from "../utils/slugify";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";
import SubscribeLabel from "../components/SubscribeLabel";
import SearchBar from "../components/SearchBar";

export default function Blogs() {
  const { settings } = useOutletContext();

  const [myBlogs, setMyBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const blogsUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.blog === true;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/blogs`);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Oops! Something went wrong");
      }

      const blogsData = (Array.isArray(data) ? data : data?.data || [])
        .filter((b) => b.isActive === true)
        .map((b) => ({
          ...b,
          slug: b.slug || slugify(b.title),
        }));

      setMyBlogs(blogsData);
    } catch (err) {
      console.log("Fetch error:", err);

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
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(myBlogs.map((b) => b.category).filter(Boolean))];
  }, [myBlogs]);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return myBlogs.filter((blog) => {
      const matchesSearch =
        !query ||
        [blog.title, blog.category, blog.author, blog.excerpt, blog.content]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesCategory =
        activeCategory === "All" ||
        (blog.category &&
          blog.category.trim().toLowerCase() ===
            activeCategory.trim().toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [myBlogs, searchQuery, activeCategory]);

  const featuredBlogs = useMemo(
    () => filteredBlogs.filter((b) => b.isFeatured),
    [filteredBlogs],
  );

  const nonFeaturedBlogs = useMemo(
    () =>
      [...filteredBlogs]
        .filter((b) => !b.isFeatured)
        .sort(
          (a, b) =>
            new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0),
        ),
    [filteredBlogs],
  );

  const latestBlogs = useMemo(
    () => nonFeaturedBlogs.slice(0, 9),
    [nonFeaturedBlogs],
  );

  const moreBlogs = useMemo(
    () => nonFeaturedBlogs.slice(3),
    [nonFeaturedBlogs],
  );

  const hasNoBlogs =
    !blogsUnderMaintenance && !loading && !errorType && myBlogs.length === 0;

  const hasNoSearchResults =
    !blogsUnderMaintenance &&
    !loading &&
    !errorType &&
    searchQuery.trim() !== "" &&
    myBlogs.length > 0 &&
    filteredBlogs.length === 0;

  return (
    <div className={styles.blogs}>
      <PageHelmet
        title="Blog"
        image={ogImages.blog}
        description="Fresh tutorials, engineering insights, tech news and personal vlogs."
        url={typeof window !== "undefined" ? window.location.href : ""}
        keywords="developer blog, software development, programming tutorials, coding, web development, technology articles"
        siteName=""
      />

      <PageTopHeading
        title={<>Blog</>}
        subtext={
          <>
            Fresh news, engineering, <br />
            tech and personal vlogs.
          </>
        }
        textAlign="center"
        centerContent="center"
      />

      {!blogsUnderMaintenance && myBlogs.length > 0 && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search"
          setMarginBottom={2}
        />
      )}

      <div className={styles.blogsWrapper}>
        {!blogsUnderMaintenance && myBlogs.length > 0 && (
          <FilterBar
            categories={categories}
            onFilterChange={setActiveCategory}
            marginTop={0}
            marginBottom={2}
          />
        )}

        <div className={styles.blogSections}>
          {blogsUnderMaintenance && (
            <div className={styles.fullSpan}>
              <ErrorView
                errType="default"
                errorText={
                  <>
                    Under maintenance. <br />
                    Please check back later.
                  </>
                }
              />
            </div>
          )}

          {loading && !blogsUnderMaintenance && (
            <div className={styles.fullSpan}>
              <LoaderView />
            </div>
          )}

          {!loading && errorType && !blogsUnderMaintenance && (
            <div className={styles.fullSpan}>
              <ErrorView errType={errorType} onRetry={fetchBlogs} />
            </div>
          )}

          {hasNoBlogs && (
            <div className={styles.fullSpan}>
              <ErrorView
                errType="default"
                errorText={
                  <>
                    No blogs found, <br />
                    come back later
                  </>
                }
                onRetry={fetchBlogs}
              />
            </div>
          )}

          {hasNoSearchResults && (
            <div className={styles.fullSpan}>
              <SearchErrorView
                header={<>Oops! Blog not found</>}
                subText={
                  <>
                    Couldn't find any blogs matching <br />"{searchQuery.trim()}
                    " . Try searching something else.
                  </>
                }
                bg={"transparent"}
                border={"none"}
                showAssist={false}
              />
            </div>
          )}

          {!blogsUnderMaintenance &&
            !loading &&
            !errorType &&
            myBlogs.length > 0 &&
            filteredBlogs.length > 0 && (
              <>
                {activeCategory === "All" && !searchQuery.trim() && (
                  <div className={styles.sectionBlock}>
                    <div className={styles.featuredBlogsList}>
                      {featuredBlogs.length > 0 &&
                        featuredBlogs.map((blog) => (
                          <BlogBox
                            key={blog._id || blog.slug}
                            variant="featured"
                            title={blog.title}
                            category={blog.category}
                            publishedDate={blog.publishedDate}
                            formattedDate={blog.formattedDate}
                            imageUrl={blog.imageUrl}
                            isFeatured={blog.isFeatured}
                            blogLink={`/blog/${blog.slug}`}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {latestBlogs.length > 0 && (
                  <div className={styles.sectionBlock}>
                    <div className={styles.latestBlogsList}>
                      {latestBlogs.map((blog) => (
                        <BlogBox
                          key={blog._id || blog.slug}
                          variant="compact"
                          title={blog.title}
                          category={blog.category}
                          publishedDate={blog.publishedDate}
                          formattedDate={blog.formattedDate}
                          imageUrl={blog.imageUrl}
                          isFeatured={blog.isFeatured}
                          blogLink={`/blog/${blog.slug}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {moreBlogs.length > 0 && (
                  <div className={styles.sectionBlock}>
                    <div className={styles.latestBlogsList}>
                      {moreBlogs.map((blog) => (
                        <BlogBox
                          key={blog._id || blog.slug}
                          variant="compact"
                          title={blog.title}
                          category={blog.category}
                          publishedDate={blog.publishedDate}
                          formattedDate={blog.formattedDate}
                          imageUrl={blog.imageUrl}
                          isFeatured={blog.isFeatured}
                          blogLink={`/blog/${blog.slug}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          <SubscribeLabel
            text={
              <>
                to receive new <br />
                blogs, directly into your inbox.
              </>
            }
            marginTop={8}
          />
        </div>
      </div>
    </div>
  );
}
