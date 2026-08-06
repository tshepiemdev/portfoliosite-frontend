import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { useToast } from "../components/ToastContext";
import { createPortal } from "react-dom";
import styles from "../styles/BlogPage.module.css";
import LoaderMaxView from "../components/LoaderMax";
import NotFound from "./NotFound";
import ImagePreviewModal from "../components/ImagePreviewModal";
import shareImg from "../assets/icons/share.svg";
import copyLinkImg from "../assets/icons/link.svg";
import threadsImg from "../assets/icons/threads.svg";
import xImg from "../assets/icons/twitter-alt.svg";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import linkImg from "../assets/icons/share.svg";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import SectionDevider from "../components/SectionDevider";
import bigFallbackImg from "../assets/images/fallback_img_16_9.svg";
import ShareSiteModal from "../components/ShareSiteModal";
import BlogPageTopTitlesView from "../components/BlogPageTopTitles";
import CounterView from "../components/CounterView";
import EyeImg from "../assets/icons/eye.svg";
import BlogsCompact from "../components/BlogsCompact";
import myDefaultProfileImage from "../assets/images/tshepang.jpg";
import ShareWith from "../components/ShareWith";
import { getShareOptions } from "../utils/shareOptions";
import { getVideoUrl } from "../utils/getVideoUrl";
import SubscribeLabel from "../components/SubscribeLabel";

export default function BlogPage() {
  const { showToast } = useToast();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const detailsRef = useRef(null);
  const hasViewed = useRef(false);
  const [showFloatingNav, setShowFloatingNav] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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

      const res = await fetch(`${API_URL}/api/blogs`);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
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
    } catch {
      setNotFound(true);
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
      if (detailsRef.current) observer.unobserve(detailsRef.current);
    };
  }, [blog]);

  if (loading) return <LoaderMaxView />;
  if (notFound || !blog) return <NotFound />;

  const displayDate = blog.publishedDate
    ? new Date(blog.publishedDate).toLocaleDateString("en-US", {
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

  const handleModalClick = (e) => e.stopPropagation();

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

  const shareOptions = getShareOptions({
    siteUrl,
    siteName: blog?.title,
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
        <BlogPageTopTitlesView
          category={blog.category || "Unspecified"}
          name={blog.title}
        />

        <div className={styles.blogBgWrapper}>
          <img
            className={styles.blogImg}
            src={blog.imageUrl || bigFallbackImg}
            alt={blog.title}
            onClick={() => setSelectedImage(blog?.imageUrl)}
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

        <section className={styles.detailedSection}>
          <div className={styles.topWrapper}>
            <div className={styles.box}>
              <div className={styles.minicontainer} title="Author">
                <div className={styles.authorImgWrapper}>
                  <img
                    className={styles.authorImg}
                    src={
                      blog.authorProfileImg?.trim()
                        ? blog.authorProfileImg
                        : myDefaultProfileImage
                    }
                    alt={blog.author}
                    onClick={() =>
                      setSelectedImage(
                        blog.authorProfileImg || myDefaultProfileImage,
                      )
                    }
                    onError={(e) => {
                      e.target.src = bigFallbackImg;
                    }}
                  />
                </div>
                <h4 className={styles.author}>{blog.author}</h4>
              </div>

              <div className={styles.minicontainer}>
                <p className={styles.label}>
                  {displayDate} • {readTime}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.wrapper}>
            <h1 className={styles.summary}>{blog.excerpt}</h1>
          </div>

          <div className={styles.sectionBlock}>
            <p className={styles.sectionTextContent}>{blog.content?.intro}</p>
          </div>

          {blog.content?.sections?.map((sec, index) => (
            <div className={styles.sectionBlock} key={index}>
              {sec.media?.type === "video" &&
                (sec.media.provider === "direct" ? (
                  <div className={styles.sectionVideoWrapper}>
                    {" "}
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
                    onClick={() => setSelectedImage(sec.sectionImage)}
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

          <div className={styles.opscontainer}>
            <ShareWith options={shareOptions} views={blog.views || 0} />
          </div>

          <BlogsCompact
            showThisCategory={blog.category}
            currentBlogSlug={blog.slug}
          />

          <SubscribeLabel/>
        </section>
      </div>

      <ShareSiteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <ImagePreviewModal
        src={
          selectedIndex !== null
            ? blog?.imageUrl?.[selectedIndex]
            : selectedImage
        }
        alt={blog?.title}
        pageName={blog?.title}
        imageDescription={blog?.excerpt}
        isOpen={selectedIndex !== null || !!selectedImage}
        onClose={() => {
          setSelectedImage(null);
          setSelectedIndex(null);
        }}
        currentImage={selectedIndex}
        totalImages={blog?.imageUrl?.length || 0}
        onNext={() => {
          setSelectedIndex((prev) => {
            if (prev === null) return 0;

            const images = blog?.imageUrl || [];
            const last = images.length - 1;

            if (last < 0) return null;

            return prev < last ? prev + 1 : prev;
          });
        }}
        onPrev={() => {
          setSelectedIndex((prev) => {
            if (prev === null) return 0;

            return prev > 0 ? prev - 1 : prev;
          });
        }}
      />
    </div>
  );
}
