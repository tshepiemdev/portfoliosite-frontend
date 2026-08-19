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
  const [searchInput, setSearchInput] = useState("");
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
        .filter((blog) => blog.isActive === true)
        .map((blog) => ({
          ...blog,
          slug: blog.slug || slugify(blog.title),
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
    const uniqueCategories = new Map();

    myBlogs.forEach((blog) => {
      if (!blog.category) return;

      const category = blog.category.trim();

      if (!category) return;

      const key = category.toLowerCase();

      if (!uniqueCategories.has(key)) {
        uniqueCategories.set(key, category);
      }
    });

    return ["All", ...uniqueCategories.values()];
  }, [myBlogs]);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const selectedCategory = activeCategory.trim().toLowerCase();

    return myBlogs.filter((blog) => {
      const blogCategory = String(blog.category || "")
        .trim()
        .toLowerCase();

      const matchesCategory =
        selectedCategory === "all" || blogCategory === selectedCategory;

      const searchableContent = [
        blog.title,
        blog.category,
        blog.author,
        blog.excerpt,
        blog.content?.intro,
        ...(blog.content?.sections || []).flatMap((section) => [
          section.heading,
          section.body,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableContent.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [myBlogs, searchQuery, activeCategory]);

  const featuredBlogs = useMemo(
    () => filteredBlogs.filter((blog) => blog.isFeatured),
    [filteredBlogs],
  );

  const nonFeaturedBlogs = useMemo(
    () =>
      [...filteredBlogs]
        .filter((blog) => !blog.isFeatured)
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt || 0).getTime() -
            new Date(a.publishedAt || a.createdAt || 0).getTime(),
        ),
    [filteredBlogs],
  );

  const latestBlogs = useMemo(
    () => nonFeaturedBlogs.slice(0, 3),
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
    myBlogs.length > 0 &&
    filteredBlogs.length === 0 &&
    (searchQuery.trim() !== "" || activeCategory !== "All");

  const handleFilterChange = (category) => {
    setActiveCategory(category || "All");
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(typeof value === "string" ? value : searchInput);
  };

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
          value={searchInput}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search"
          setMarginBottom={2}
        />
      )}

      <div className={styles.blogsWrapper}>
        {!blogsUnderMaintenance && myBlogs.length > 0 && (
          <FilterBar
            categories={categories}
            onFilterChange={handleFilterChange}
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
                header={
                  activeCategory !== "All" && !searchQuery.trim() ? (
                    <>No blogs in this category</>
                  ) : (
                    <>Oops! Blog not found</>
                  )
                }
                subText={
                  activeCategory !== "All" && !searchQuery.trim() ? (
                    <>
                      Couldn't find any blogs in <br />"{activeCategory}". Try
                      another category.
                    </>
                  ) : (
                    <>
                      Couldn't find any blogs matching <br />"
                      {searchQuery.trim()}". Try searching something else.
                    </>
                  )
                }
                bg="transparent"
                border="none"
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
                {!searchQuery.trim() && featuredBlogs.length > 0 && (
                  <div className={styles.sectionBlock}>
                    <div className={styles.featuredBlogsList}>
                      {featuredBlogs.map((blog) => (
                        <BlogBox
                          key={blog._id || blog.slug}
                          variant="featured"
                          title={blog.title}
                          category={blog.category}
                          publishedAt={blog.publishedAt}
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
                          publishedAt={blog.publishedAt}
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
                          publishedAt={blog.publishedAt}
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
            heading={
              <>
                Subscribe now, <br />
                It's completely free
              </>
            }
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
