import { useEffect, useState, useMemo } from "react";
import styles from "../styles/Blogs.module.css";
import BlogBox from "../components/BlogBox";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import FilterBar from "../components/FilterBar";
import { slugify } from "../utils/slugify";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";
import SubscribeLabel from "../components/SubscribeLabel";
import SearchBar from "../components/SearchBar";

export default function Blogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

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

  const filteredByCategory = useMemo(() => {
    if (activeCategory === "All") return myBlogs;

    return myBlogs.filter((blog) => {
      if (!blog.category) return false;

      return (
        blog.category.trim().toLowerCase() ===
        activeCategory.trim().toLowerCase()
      );
    });
  }, [myBlogs, activeCategory]);

  const featuredBlogs = useMemo(
    () => filteredByCategory.filter((b) => b.isFeatured),
    [filteredByCategory],
  );

  const nonFeaturedBlogs = useMemo(
    () =>
      filteredByCategory
        .filter((b) => !b.isFeatured)
        .sort(
          (a, b) =>
            new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0),
        ),
    [filteredByCategory],
  );

  const latestBlogs = useMemo(
    () => nonFeaturedBlogs.slice(0, 3),
    [nonFeaturedBlogs],
  );

  const moreBlogs = useMemo(
    () => nonFeaturedBlogs.slice(3),
    [nonFeaturedBlogs],
  );

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
      {myBlogs.length > 0 && (
        <SearchBar
          value={""}
          onChange={""}
          placeholder="Search"
          setMarginBottom={4}
        />
      )}

      <div className={styles.blogsWrapper}>
        {myBlogs.length > 0 && (
          <FilterBar
            categories={categories}
            onFilterChange={setActiveCategory}
            marginTop={0}
            marginBottom={2}
          />
        )}

        <div className={styles.blogSections}>
          {!loading && !errorType && myBlogs.length === 0 ? (
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
          ) : (
            <div className={styles.blogSections}>
              {activeCategory === "All" && (
                <div className={styles.sectionBlock}>
                  <div className={styles.featuredBlogsList}>
                    {loading && (
                      <div className={styles.fullSpan}>
                        <LoaderView />
                      </div>
                    )}

                    {!loading && errorType && (
                      <div className={styles.fullSpan}>
                        <ErrorView errType={errorType} onRetry={fetchBlogs} />
                      </div>
                    )}

                    {!loading && !errorType && featuredBlogs.length === 0 && (
                      <div className={styles.fullSpan}>
                        <ErrorView
                          errType="default"
                          errorText={
                            <>
                              Couldn't find <br />
                              featured articles
                            </>
                          }
                          onRetry={fetchBlogs}
                        />
                      </div>
                    )}

                    {!loading &&
                      !errorType &&
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

              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionHeader}>Latest articles</h2>

                <div className={styles.latestBlogsList}>
                  {loading && (
                    <div className={styles.fullSpan}>
                      <LoaderView />
                    </div>
                  )}

                  {!loading && errorType && (
                    <div className={styles.fullSpan}>
                      <ErrorView errType={errorType} onRetry={fetchBlogs} />
                    </div>
                  )}

                  {!loading && !errorType && latestBlogs.length === 0 && (
                    <div className={styles.fullSpan}>
                      <ErrorView
                        errType="default"
                        errorText={
                          <>
                            Couldn't find <br />
                            any new articles
                          </>
                        }
                        onRetry={fetchBlogs}
                      />
                    </div>
                  )}

                  {!loading &&
                    !errorType &&
                    latestBlogs.map((blog) => (
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

              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionHeader}>More articles</h2>

                <div className={styles.latestBlogsList}>
                  {loading && (
                    <div className={styles.fullSpan}>
                      <LoaderView />
                    </div>
                  )}

                  {!loading && errorType && (
                    <div className={styles.fullSpan}>
                      <ErrorView errType={errorType} onRetry={fetchBlogs} />
                    </div>
                  )}

                  {!loading && !errorType && moreBlogs.length === 0 && (
                    <div className={styles.fullSpan}>
                      <ErrorView
                        errType="default"
                        errorText={
                          <>
                            Couldn't find <br />
                            any more articles
                          </>
                        }
                        onRetry={fetchBlogs}
                      />
                    </div>
                  )}

                  {!loading &&
                    !errorType &&
                    moreBlogs.map((blog) => (
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
            </div>
          )}

          <SubscribeLabel
            text={
              <>
                to receive new <br />
                blogs, directly into your inbox.
              </>
            }
            marginTop={4}
          />
        </div>
      </div>
    </div>
  );
}
