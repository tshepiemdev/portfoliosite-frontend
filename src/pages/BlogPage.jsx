import { useEffect, useRef, useState } from "react";
import { useToast } from "../components/ToastContext";
import { useParams, Link } from "react-router-dom";
import { slugify } from "../utils/slugify";
import styles from "../styles/BlogPage.module.css";
import LoaderMaxView from "../components/LoaderMax";
import NotFound from "./NotFound";
import ErrorMaxView from "../components/ErrorMaxView";
import ImagePreviewModal from "../components/ImagePreviewModal";
import shareImg from "../assets/icons/share.svg";
import copyLinkImg from "../assets/icons/link.svg";
import threadsImg from "../assets/icons/threads.svg";
import xImg from "../assets/icons/twitter-alt.svg";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import bigFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import ShareSiteModal from "../components/ShareSiteModal";
import BlogPageTopTitlesView from "../components/BlogPageTopTitles";
import BlogsCompact from "../components/BlogsCompact";
import ShareWith from "../components/ShareWith";
import { getShareOptions } from "../utils/shareOptions";
import { getVideoUrl } from "../utils/getVideoUrl";
import SubscribeLabel from "../components/SubscribeLabel";

export default function BlogPage() {
  const { showToast } = useToast();
  const { slug } = useParams();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const detailsRef = useRef(null);
  const hasViewed = useRef(false);
  const [showFloatingNav, setShowFloatingNav] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);

  const addView = async (blogSlug) => {
    try {
      const res = await fetch(`${API_URL}/api/blogs/${blogSlug}/view`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setBlog((prev) => ({
          ...prev,
          views: data.views,
        }));
      }
    } catch (err) {
      console.error("Failed to add view", err);
    }
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      setError(null);

      const res = await fetch(`${API_URL}/api/blogs`);

      if (!res.ok) {
        throw new Error("server");
      }

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("server");
      }

      const blogs = Array.isArray(data) ? data : data?.data || [];

      const found = blogs.find(
        (item) => item.slug === slug || slugify(item.title) === slug,
      );

      if (!found) {
        setNotFound(true);
        return;
      }

      setBlog(found);
    } catch (err) {
      console.error("Failed to fetch blog:", err);

      if (!navigator.onLine) {
        setError("network");
      } else {
        setError("server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hasViewed.current = false;
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (!blog || hasViewed.current) return;

    const viewedKey = `blog-viewed-${blog._id}`;

    if (localStorage.getItem(viewedKey)) return;

    hasViewed.current = true;

    const increment = async () => {
      await addView(blog.slug);
      localStorage.setItem(viewedKey, "true");
    };

    increment();
  }, [blog]);

  useEffect(() => {
    if (!detailsRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingNav(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(detailsRef.current);

    return () => {
      if (detailsRef.current) {
        observer.unobserve(detailsRef.current);
      }
    };
  }, [blog]);

  if (loading) return <LoaderMaxView />;

  if (notFound) return <NotFound />;

  if (error) {
    return <ErrorMaxView errType={error} onRetry={fetchBlog} />;
  }

  if (!blog) {
    return <ErrorMaxView errType="default" onRetry={fetchBlog} />;
  }

  const displayDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const calculateReadTime = (blog) => {
    if (!blog?.content) return "1 min read";

    const wordsPerMinute = 220;
    let text = blog.content.intro || "";

    blog.content.sections?.forEach((sec) => {
      text += " " + (sec.heading || "") + " " + (sec.body || "");
    });

    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return `${minutes} min read`;
  };

  const readTime = calculateReadTime(blog);

  const siteUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    try {
      if (!navigator.share) {
        showToast(
          "error",
          "Sharing not supported",
          "Your device does not support sharing",
        );
        return;
      }

      await navigator.share({
        title: "Share with friends",
        text: "Check this out",
        name: "",
        url: siteUrl,
      });
    } catch {
      showToast("error", "Share cancelled", "No action completed");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);

      showToast("success", "Link copied", "You can now share it anywhere");
    } catch {
      showToast("error", "Copy failed", "Try again");
    }
  };

  const handleAuthorImageClick = () => {
    if (!blog?.authorProfileImg) return;

    setSelectedImage(blog.authorProfileImg);
  };

  const handleBlogImageClick = (image) => {
    if (!image) return;

    setSelectedImage(image);
  };

  const shareOptions = getShareOptions({
    siteUrl,
    siteName: blog.title,
    handleCopyLink,
    openShareModal: () => setIsShareModalOpen(true),
    icons: {
      copyLink: copyLinkImg,
      share: shareImg,
      threads: threadsImg,
      x: xImg,
      linkedIn: linkedInImg,
    },
  });

  return (
    <div className={styles.blogPage}>
      <PageHelmet
        title={blog.title}
        description={blog.excerpt}
        image={blog.imageUrl}
        url={siteUrl}
        keywords={`${blog.category}, software development, programming, technology, coding`}
        siteName="Blog"
      />

      <div className={styles.blogWrapper}>
        <div className={styles.topSection}>
          <BlogPageTopTitlesView
            category={blog.category || "Unspecified"}
            name={blog.title}
            publishedAt={blog.publishedAt}
            shortDescription={blog.excerpt}
            shareOptions={shareOptions}
            views={blog.views || 0}
            authorName={blog.author}
            authorPic={blog.authorProfileImg}
            totalReadTime={readTime}
            onAuthorImageClick={(image) => {
              setSelectedImage(image);
              setSelectedIndex(null);
            }}
          />
        </div>

        <div className={styles.blogBgWrapper}>
          <img
            className={styles.blogImg}
            src={blog.imageUrl || bigFallbackImg}
            alt={blog.title}
            onClick={() => handleBlogImageClick(blog.imageUrl)}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = bigFallbackImg;
            }}
          />
        </div>

        <section className={styles.detailedSection}>
          <p className={styles.imgSrcLabel}>
            <span>Image source</span>:{" "}
            {blog.imageSource || "Unspecified image source"}
          </p>

          <div className={styles.sectionBlock}>
            <p className={styles.sectionTextContent}>{blog.content?.intro}</p>
          </div>

          {blog.content?.sections?.map((sec, index) => (
            <div className={styles.sectionBlock} key={index}>
              {sec.media?.type === "video" &&
                (sec.media.provider === "direct" ? (
                  <div className={styles.sectionVideoWrapper}>
                    <video
                      className={styles.sectionVideo}
                      controls
                      preload="metadata"
                    >
                      <source src={sec.media.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className={styles.sectionVideoWrapper}>
                    <iframe
                      className={styles.sectionVideo}
                      src={getVideoUrl(sec.media.url, sec.media.provider)}
                      title={sec.heading}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ))}

              {sec.sectionImage && (
                <div className={styles.sectionImageWrapper}>
                  <img
                    className={styles.sectionImage}
                    src={sec.sectionImage || bigFallbackImg}
                    alt={blog.title}
                    onClick={() => handleBlogImageClick(sec.sectionImage)}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = bigFallbackImg;
                    }}
                  />

                  {blog.imageSource && (
                    <p className={styles.imgSrcLabel}>
                      {blog.imageSource || "Unspecified image source"}
                    </p>
                  )}
                </div>
              )}

              <h3 className={styles.miniHeader}>{sec.heading}</h3>

              <p className={styles.sectionTextContent}>{sec.body}</p>
            </div>
          ))}

          <div className={styles.bentoWrapperStyle}>
            <p className={styles.label}>Share article</p>
            <ShareWith options={shareOptions} />
          </div>

          <div className={styles.bentoWrapper}>
            <p className={styles.label}>Blog & Newsletter Information</p>

            <p className={styles.text}>
              For blog updates, article questions, topic suggestions, or other
              newsletter-related inquiries, contact{" "}
              <a className={styles.link} href="mailto:newsletter@tshepiem.dev">
                newsletter@tshepiem.dev
              </a>
              . By subscribing, you agree to receive blog updates, new article
              notifications, and occasional newsletter emails in accordance with
              our{" "}
              <Link
                className={styles.link}
                to="/legal/tshepiemdev-website-blog-subscription-terms"
              >
                Subscription Terms
              </Link>
              . You can unsubscribe at any time using the unsubscribe link
              included in our emails.
            </p>
          </div>

          <BlogsCompact
            showThisCategory={blog.category}
            currentBlogSlug={blog.slug}
          />

          <SubscribeLabel marginTop={6} />
        </section>
      </div>

      <ShareSiteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <ImagePreviewModal
        src={selectedImage}
        alt={blog?.title}
        pageName={blog?.title}
        imageDescription={blog?.excerpt}
        images={selectedImage ? [selectedImage] : []}
        isOpen={!!selectedImage}
        currentImage={0}
        totalImages={selectedImage ? 1 : 0}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
