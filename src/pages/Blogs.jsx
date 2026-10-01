import { useMemo, useState } from "react";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
  useSearchParams,
} from "react-router-dom";
import styles from "../styles/Blogs.module.css";
import BlogBox from "../components/BlogBox";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import SearchErrorView from "../components/SearchErrorView";
import API_URL from "../config/api";
import FilterBar from "../components/FilterBar";
import { slugify } from "../utils/slugify";
import PageTopHeading from "../components/PageTopHeading";
import ogImages from "../config/ogImages";
import SubscribeLabel from "../components/SubscribeLabel";
import SearchBar from "../components/SearchBar";
import createMeta from "../config/seo";

export async function loader() {
  try {
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

    return {
      blogs: blogsData,
      errorType: null,
    };
  } catch {
    return {
      blogs: [],
      errorType: "default",
    };
  }
}

export function meta() {
  return createMeta({
    title: "Blog",
    image: ogImages.blog,
    description:
      "Fresh tutorials, engineering insights, tech news and personal vlogs.",
    url: "/blog",
    keywords:
      "developer blog, software developer blog, software engineering blog, software development blog, programming blog, coding blog, web development blog, technology blog, tech blog, programming tutorials, coding tutorials, software engineering tutorials, web development tutorials, frontend development, backend development, full-stack development, React tutorials, React.js tutorials, JavaScript tutorials, TypeScript tutorials, Node.js tutorials, Express.js tutorials, C# tutorials, .NET tutorials, database tutorials, API development tutorials, REST API tutorials, Git tutorials, GitHub tutorials, HTML tutorials, CSS tutorials, responsive web development, web application development, software architecture, system analysis, object-oriented programming, programming guides, developer guides, engineering insights, software engineering insights, technology insights, developer insights, tech news, software development news, web development news, programming news, developer tools, developer technologies, modern web development, modern JavaScript, modern TypeScript, React development, Node.js development, full-stack development, frontend engineering, backend engineering, software projects, coding practices, clean code, software architecture, performance optimization, web performance, SEO development, developer career, software engineering career, IT career, South African developer, South African software engineer, Pretoria developer, Pretoria software engineer, tshepiem.dev",
  });
}

export default function Blogs() {
  const { settings } = useOutletContext();
  const { blogs: myBlogs, errorType } = useLoaderData();
  const revalidator = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");

  const getCategoryFromParam = (param, availableCategories) => {
    if (!param) {
      return "All";
    }

    const normalizedParam = param.replace(/\s/g, "").toLowerCase();

    return (
      availableCategories.find(
        (category) =>
          category.replace(/\s/g, "").toLowerCase() === normalizedParam,
      ) || "All"
    );
  };

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleMoreBlogs, setVisibleMoreBlogs] = useState(6);

  const loading = revalidator.state === "loading";

  const blogsUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.blog === true;

  const handleRetry = () => revalidator.revalidate();

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

  useMemo(() => {
    setActiveCategory(getCategoryFromParam(categoryParam, categories));
  }, [categoryParam, categories]);

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
    () => nonFeaturedBlogs.slice(0, 6),
    [nonFeaturedBlogs],
  );

  const moreBlogs = useMemo(
    () => nonFeaturedBlogs.slice(6),
    [nonFeaturedBlogs],
  );

  const visibleBlogs = useMemo(
    () => moreBlogs.slice(0, visibleMoreBlogs),
    [moreBlogs, visibleMoreBlogs],
  );

  const hasMoreBlogs = visibleMoreBlogs < moreBlogs.length;

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
    const selectedCategory = category || "All";

    setActiveCategory(selectedCategory);
    setVisibleMoreBlogs(6);

    const params = new URLSearchParams(searchParams);

    if (selectedCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory.replace(/\s/g, "").toLowerCase());
    }

    setSearchParams(params);
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(typeof value === "string" ? value : searchInput);
    setVisibleMoreBlogs(6);
  };

  const handleLoadMore = () => {
    setVisibleMoreBlogs((current) => current + 6);
  };

  return (
    <div className={styles.blogs}>
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
            defaultCategory={activeCategory}
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
              <ErrorView errType={errorType} onRetry={handleRetry} />
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
                onRetry={handleRetry}
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

                {visibleBlogs.length > 0 && (
                  <div className={styles.sectionBlock}>
                    <div className={styles.latestBlogsList}>
                      {visibleBlogs.map((blog) => (
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

                {hasMoreBlogs && (
                  <div className={styles.loadMore}>
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className={styles.loadMoreButton}
                    >
                      Load more
                    </button>
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
