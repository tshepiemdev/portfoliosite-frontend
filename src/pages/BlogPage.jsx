import { useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useRevalidator,
  useLocation,
  Link,
} from "react-router-dom";
import { useToast } from "../components/ToastContext";
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

const SITE_URL = "https://tshepiem.dev";

export async function loader({ params }) {
  const { slug } = params;

  try {
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
      return {
        blog: null,
        notFound: true,
        error: null,
      };
    }

    return {
      blog: found,
      notFound: false,
      error: null,
    };
  } catch {
    return {
      blog: null,
      notFound: false,
      error: "default",
    };
  }
}

export default function BlogPage() {
  const { showToast } = useToast();
  const { blog, notFound, error } = useLoaderData();
  const revalidator = useRevalidator();
  const location = useLocation();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const detailsRef = useRef(null);
  const hasViewed = useRef(false);

  const [showFloatingNav, setShowFloatingNav] = useState(true);

  const loading = revalidator.state === "loading";

  const siteUrl = `${SITE_URL}${location.pathname}`;

  const handleRetry = () => revalidator.revalidate();

  useEffect(() => {
    if (!blog || hasViewed.current) return;

    if (typeof window === "undefined") return;

    const viewedKey = `blog-viewed-${blog._id}`;

    if (localStorage.getItem(viewedKey)) return;

    hasViewed.current = true;

    const addView = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${blog.slug}/view`, {
          method: "POST",
        });

        let data;

        try {
          data = await res.json();
        } catch {
          return;
        }

        if (data.success) {
          localStorage.setItem(viewedKey, "true");
        }
      } catch {
        hasViewed.current = false;
      }
    };

    addView();
  }, [blog]);

  useEffect(() => {
    if (!detailsRef.current) return;

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingNav(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(detailsRef.current);

    return () => {
      if (detailsRef.current) {
        observer.unobserve(detailsRef.current);
      }
    };
  }, [blog]);

  if (loading) {
    return <LoaderMaxView />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error) {
    return <ErrorMaxView errType={error} onRetry={handleRetry} />;
  }

  if (!blog) {
    return <ErrorMaxView errType="default" onRetry={handleRetry} />;
  }

  const displayDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const calculateReadTime = (blogData) => {
    if (!blogData?.content) {
      return "1 min read";
    }

    const wordsPerMinute = 220;

    let text = blogData.content.intro || "";

    blogData.content.sections?.forEach((sec) => {
      text += " " + (sec.heading || "") + " " + (sec.body || "");
    });

    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return `${minutes} min read`;
  };

  const readTime = calculateReadTime(blog);

  const handleNativeShare = async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.share) {
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
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(siteUrl);

      showToast("success", "Link copied", "You can now share it anywhere");
    } catch {
      showToast("error", "Copy failed", "Try again");
    }
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

          <div className={styles.sectionBlock} ref={detailsRef}>
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
