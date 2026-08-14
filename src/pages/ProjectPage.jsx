import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { useToast } from "../components/ToastContext";
import styles from "../styles/ProjectPage.module.css";
import LoaderMaxView from "../components/LoaderMax";
import NotFound from "./NotFound";
import shareImg from "../assets/icons/share.svg";
import copyLinkImg from "../assets/icons/link.svg";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import xImg from "../assets/icons/twitter-alt.svg";
import threadsImg from "../assets/icons/threads.svg";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import ShareSiteModal from "../components/ShareSiteModal";
import ImagePreviewModal from "../components/ImagePreviewModal";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";
import BtnCTABlackSmall from "../components/BtnCTABlackSmall";
import CloudCodeImg from "../assets/icons/cloud-data.svg";
import TechStackImg from "../assets/icons/square-terminal.svg";
import FeaturesImg from "../assets/icons/spark.svg";
import ShippedImg from "../assets/icons/cloud.svg";
import DiscontinuedImg from "../assets/icons/ban.svg";
import BuildingImg from "../assets/icons/logo.svg";
import bigFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import ShareWith from "../components/ShareWith";
import { getShareOptions } from "../utils/shareOptions";
import NoticeLbl from "../components/NoticeLbl";
import liveprodImg from "../assets/icons/globe (1).svg";
import ErrorMaxView from "../components/ErrorMaxView";

export default function ProjectPage() {
  const { showToast } = useToast();
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const hasViewed = useRef(false);

  const addView = async (projectSlug) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectSlug}/view`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setProject((prev) => ({
          ...prev,
          views: data.views,
        }));
      }
    } catch (err) {
      console.error("Failed to add view", err);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      setError(null);

      const res = await fetch(`${API_URL}/api/projects`);

      if (!res.ok) {
        throw new Error("server");
      }

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("server");
      }

      const projects = Array.isArray(data) ? data : data?.data || [];

      const found = projects.find(
        (item) => item.slug === slug || slugify(item.projectName) === slug,
      );

      if (!found) {
        setNotFound(true);
        return;
      }

      setProject(found);
    } catch (err) {
      console.error("Failed to fetch project:", err);

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
    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!project || hasViewed.current) return;

    const viewedKey = `project-viewed-${project._id}`;

    if (localStorage.getItem(viewedKey)) return;

    hasViewed.current = true;

    const increment = async () => {
      await addView(project.slug);
      localStorage.setItem(viewedKey, "true");
    };

    increment();
  }, [project]);

  if (loading) return <LoaderMaxView />;

  if (notFound) return <NotFound />;

  if (error) {
    return <ErrorMaxView errType={error} onRetry={fetchProject} />;
  }

  if (!project) {
    return <ErrorMaxView errType="default" onRetry={fetchProject} />;
  }

  const siteUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = siteUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      showToast("success", "Link copied", "You can now share it anywhere");
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("error", "Copy failed", "Try again manually");
    }
  };

  const status = project.projectStatus || "";

  const finalBadgeText = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Status unavailable";

  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  const statusImages = {
    shipped: ShippedImg,
    building: BuildingImg,
    discontinued: DiscontinuedImg,
  };

  const statusImage = statusImages[status.toLowerCase()] || null;

  const activeImage =
    selectedIndex !== null
      ? project.projectImages?.[selectedIndex]
      : selectedImage;

  const isModalOpen = !!activeImage;

  const shareOptions = getShareOptions({
    siteUrl,
    projectName: project.projectName,
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
    <div className={styles.projectPage}>
      <PageHelmet
        title={project.projectName}
        description={project.projectShortDescription}
        image={project.projectIcon}
        url={siteUrl}
        keywords={`${project.projectName}, ${project.projectType}, ${project.projectCategory}, software development, portfolio project`}
        siteName="Project"
      />

      <div className={styles.projectWrapper}>
        <div className={styles.topWrapper}>
          <div className={styles.boxFlexP}>
            <div className={styles.projectIconWrapper}>
              <img
                className={styles.projectIcon}
                src={project.projectIcon || bigFallbackImg}
                alt={project.projectName}
                onClick={() => {
                  if (!project.projectIcon) return;
                  setSelectedIndex(null);
                  setSelectedImage(project.projectIcon);
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = bigFallbackImg;
                }}
                loading="lazy"
              />
            </div>

            <div className={styles.boxFlexT}>
              <h4 className={styles.projectName}>
                {project.projectName} Project
              </h4>

              <div className={styles.boxFlexF}>
                <h4 className={`${styles.mainLabel} ${styles[statusClass]}`}>
                  {statusImage && (
                    <img
                      className={styles.statusImg}
                      src={statusImage}
                      alt={project.projectStatus || "status"}
                    />
                  )}
                  {finalBadgeText}
                </h4>

                <h4 className={styles.mainLabel}>
                  {project.projectType
                    ? "• " + project.projectType
                    : "Type unavailable"}
                </h4>
              </div>
            </div>
          </div>

          <div className={styles.bentoBox}>
            <p className={styles.label}>Summary</p>
            <h4 className={styles.summary}>
              {project.projectShortDescription || "Summary unavailable"}
            </h4>
          </div>

          <div className={styles.boxFlex}>
            <div className={styles.box}>
              <p className={styles.label}>Category</p>
              <h4 className={styles.mainLabel}>
                {project.projectCategory || "N/A"}
              </h4>
            </div>

            <div className={styles.box}>
              <p className={styles.label}>Ownership</p>
              <h4 className={styles.mainLabel}>
                {project.projectOwnership || "N/A"}
              </h4>
            </div>

            <div className={styles.box}>
              <p className={styles.label}>Role</p>
              <h4 className={styles.mainLabel}>{project.role || "N/A"}</h4>
            </div>

            <div className={styles.box}>
              <p className={styles.label}>Team size</p>
              <h4 className={styles.mainLabel}>{project.teamSize || "N/A"}</h4>
            </div>
          </div>

          <ShareWith
            marginTop={1}
            options={shareOptions}
            views={project.views || 0}
          />
        </div>

        <div className={styles.projectImagesWrapper}>
          {(project.projectImages || []).map((item, index) => (
            <div key={index} className={styles.projectImgWrapper}>
              <img
                className={styles.projectImg}
                src={item || bigFallbackImg}
                alt={project.projectName}
                onClick={() => {
                  const img = project.projectImages?.[index];
                  if (!img) return;

                  setSelectedImage(null);
                  setSelectedIndex(index);
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = bigFallbackImg;
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className={styles.detailedSection}>
          <div className={styles.sectionBlock}>
            <h3 className={styles.miniHeader}>
              <img
                className={styles.sectionIcon}
                src={TechStackImg}
                alt="Tech Stack"
              />
              Tech Stack
            </h3>

            <p className={styles.sectionTextContent}>
              {project.projectStack?.join(", ") || "No stack listed"}
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h3 className={styles.miniHeader}>
              <img
                className={styles.sectionIcon}
                src={FeaturesImg}
                alt="Features"
              />
              Features
            </h3>

            <p className={styles.sectionTextContent}>
              {project.keyFeatures?.join(", ") || "No features listed"}
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h3 className={styles.miniHeader}>
              <img
                className={styles.sectionIcon}
                src={CloudCodeImg}
                alt="Source Code"
              />
              Source Code
            </h3>

            <p className={styles.sectionTextContentTitle}>
              Browse the project's source code and development history.
            </p>

            {project.projectRepoLink ? (
              <div className={styles.ctaButtonsWrapper}>
                <BtnCTABlackSmall
                  buttonText="Git Repository"
                  href={project.projectRepoLink}
                />
              </div>
            ) : (
              <NoticeLbl
                title={"Note"}
                text={
                  "Repository is not publicly available. Project is currently in " +
                  finalBadgeText +
                  " stage."
                }
              />
            )}
          </div>

          <div className={styles.sectionBlock}>
            <h3 className={styles.miniHeader}>
              <img
                className={styles.sectionIcon}
                src={liveprodImg}
                alt="Live Project"
              />
              Live Project
            </h3>

            <p className={styles.sectionTextContentTitle}>
              Access the deployed version of this project.
            </p>

            {project.projectLiveLink ? (
              <div className={styles.ctaButtonsWrapper}>
                <BtnCTAWhiteSmall
                  buttonText="Open Live Project"
                  href={project.projectLiveLink}
                />
              </div>
            ) : (
              <NoticeLbl
                title={"Note"}
                text={
                  "Live deployment is not available. Project is currently in " +
                  finalBadgeText +
                  " stage."
                }
              />
            )}
          </div>
        </div>
      </div>

      <ShareSiteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <ImagePreviewModal
        src={activeImage}
        alt={project.projectName}
        pageName={project.projectName}
        imageDescription={project.projectShortDescription}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedImage(null);
          setSelectedIndex(null);
        }}
        currentImage={selectedIndex}
        totalImages={(project.projectImages || []).length}
        onNext={() => {
          setSelectedIndex((prev) => {
            const images = project.projectImages || [];

            if (!images.length) return null;

            const last = images.length - 1;

            return prev < last ? prev + 1 : prev;
          });
        }}
        onPrev={() => {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }}
      />
    </div>
  );
}
