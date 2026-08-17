import { useEffect, useMemo, useState } from "react";
import styles from "../styles/BlogsCompact.module.css";
import BlogBoxCompact from "../components/BlogBoxCompact";
import LoaderView from "./Loader";
import ErrorView from "./ErrorView";
import API_URL from "../config/api";
import BtnCTABlackSmall from "./BtnCTABlackSmall";
import ListFooter from "./ListFooter";
import { slugify } from "../utils/slugify";

export default function BlogsCompact({
  showThisCategory,
  currentBlogSlug,
  limit = 4,
}) {
  const [myBlogs, setMyBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(limit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/blogs`);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const blogsData = (Array.isArray(data) ? data : data?.data || []).map(
        (blog) => ({
          ...blog,
          slug: blog.slug || slugify(blog.title),
        }),
      );

      setMyBlogs(blogsData);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    setVisibleCount(limit);
  }, [showThisCategory, currentBlogSlug, limit]);

  const relatedBlogs = useMemo(() => {
    let blogs = [...myBlogs];

    if (currentBlogSlug) {
      blogs = blogs.filter(
        (blog) => (blog.slug || slugify(blog.title)) !== currentBlogSlug,
      );
    }

    if (showThisCategory) {
      blogs = blogs.filter(
        (blog) =>
          blog.category?.trim().toLowerCase() ===
          showThisCategory.trim().toLowerCase(),
      );
    }

    return blogs;
  }, [myBlogs, showThisCategory, currentBlogSlug]);

  const visibleBlogs = relatedBlogs.slice(0, visibleCount);

  if (!loading && !error && relatedBlogs.length === 0) {
    return null;
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.topWrapper}>
        <h2 className={styles.heading}>Related articles</h2>
      </div>

      <div className={styles.blogsList}>
        {loading && <LoaderView />}

        {!loading && error && (
          <ErrorView errorText={error} onRetry={fetchBlogs} />
        )}

        {!loading &&
          !error &&
          visibleBlogs.map((blog) => (
            <BlogBoxCompact
              key={blog._id || blog.slug}
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

      {/* {!loading && !error && relatedBlogs.length > 0 && (
          <div className={styles.blogControls}>
            {visibleCount < relatedBlogs.length ? (
              <BtnCTABlackSmall
                buttonText="Load more articles"
                onClick={() => setVisibleCount((prev) => prev + limit)}
              />
            ) : (
              <ListFooter
                text="You have reached the end of related articles list."
                icon=""
              />
            )}
          </div>
        )} */}
    </div>
  );
}
