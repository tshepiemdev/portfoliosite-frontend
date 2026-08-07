import { useEffect, useState } from "react";
import styles from "../styles/CvPage.module.css";
import LoaderView from "../components/Loader";
import ErrorView from "../components/ErrorView";
import NotFound from "./NotFound";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import SectionDevider from "../components/SectionDevider";
import BtnCTAWhite from "../components/BtnCTAWhite";
import BtnCTABlack from "../components/BtnCTABlack";
import ShippedImg from "../assets/icons/cloud.svg";
import DiscontinuedImg from "../assets/icons/ban.svg";
import BuildingImg from "../assets/icons/square-terminal-color.svg";
import myDefaultProfileImage from "../assets/images/tshepang.jpg";
import bigFallbackImg from "../assets/images/fallback_img_16_9.svg";
import ShareSiteModal from "../components/ShareSiteModal";
import ImagePreviewModal from "../components/ImagePreviewModal";
import { convertDriveToPreview, convertDriveToDownload } from "../utils/drive";
import NextIcon from "../assets/icons/arrow-up-right.svg";
import { useToast } from "../components/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import StarImg from "../assets/icons/logo.svg";
import PageTopHeading from "../components/PageTopHeading";
import BtnCTABlackSmall from "../components/BtnCTABlackSmall";
import ChevronImg from "../assets/icons/chevron-right.svg";
import NextImg from "../assets/icons/arrow-small-right.svg";
import ogImages from "../config/ogImages";

export default function CvPage() {
  const navigate = useNavigate();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { showToast } = useToast();

  const fetchCv = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/cvs`);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch CV");
      }

      setCv(data.data || null);
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
    fetchCv();
  }, []);

  const handleDownloadCv = () => {
    if (!cv?.cvLink) {
      showToast("error", "Download failed", "CV file not found");
      return;
    }

    try {
      const downloadUrl = convertDriveToDownload(cv.cvLink);
      const win = window.open(downloadUrl, "_blank");

      if (win) {
        showToast("success", "Download started", "Please wait");
      } else {
        showToast(
          "error",
          "Popup blocked",
          "Please allow popups and try again",
        );
      }
    } catch {
      showToast("error", "Download failed", "Unexpected error occurred");
    }
  };

  const handleOpenCv = () => {
    if (!cv?.cvLink) {
      showToast("error", "Unable to open CV", "CV file not found");
      return;
    }

    try {
      const previewUrl = convertDriveToPreview(cv.cvLink);
      const win = window.open(previewUrl, "_blank");

      if (win) {
        showToast("success", "Opening CV", "Loading document");
      } else {
        showToast(
          "error",
          "Popup blocked",
          "Please allow popups and try again",
        );
      }
    } catch {
      showToast("error", "Unable to open CV", "Unexpected error occurred");
    }
  };

  const siteUrl = typeof window !== "undefined" ? window.location.href : "";

  const statusImages = {
    "open-to-work": ShippedImg,
    hired: BuildingImg,
    unavailable: DiscontinuedImg,
  };

  const statusKey =
    cv?.status === "Hired"
      ? "hired"
      : cv?.status === "Unavailable"
        ? "unavailable"
        : "open-to-work";

  const hiMe = cv?.fullName ? `Hey, I'm ${cv.fullName}` : "Hey";

  const bentoItems = [];

  const handleNavigate = (id) => {
    navigate("/");

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  return (
    <div className={styles.cvPage}>
      <PageHelmet
        title="Get my resume"
        description="Get my comprehensive, ATS optimized and ready cv"
        image={ogImages.resume}
        url={siteUrl}
        keywords={`${cv?.fullName}, CV, resume, software developer, developer portfolio`}
        siteName=""
      />

      <div className={styles.cvWrapper}>
        <div className={styles.allWrapper}>
          <div className={styles.columnWrapper}>
            <PageTopHeading
              title={
                <>
                  Get my comprehensive, <br />
                  ATS optimized resume
                </>
              }
            />
            {!loading && !errorType && cv && (
              <div className={styles.ctaButtonsWrapper}>
                <BtnCTAWhite
                  buttonText="Download CV"
                  onClick={handleDownloadCv}
                />

                <BtnCTABlack buttonText="Get in touch" href="/contact" />
                <p className={styles.linkyText}>
                  First time here?{" "}
                  <Link className={styles.linkyTextLink} to={"/"}>
                    Explore my portfolio
                    <img className={styles.chevronImg} src={NextImg} alt="/" />
                  </Link>
                </p>
              </div>
            )}
          </div>

          {loading && <LoaderView />}

          {!loading && errorType && (
            <ErrorView errType={errorType} onRetry={fetchCv} />
          )}

          {!loading && !errorType && !cv && (
            <ErrorView errType="default" onRetry={fetchCv} />
          )}

          {!loading && !errorType && cv && (
            <div className={styles.cvGrid}>
              <div className={styles.wrapper}>
                <div className={styles.boxFlexP}>
                  <div className={styles.cvIconWrapper}>
                    <img
                      className={styles.cvIcon}
                      src={
                        cv.profileImage?.trim()
                          ? cv.profileImage
                          : myDefaultProfileImage
                      }
                      alt={cv.fullName}
                      onClick={() =>
                        setSelectedImage(
                          cv.profileImage || myDefaultProfileImage,
                        )
                      }
                      onError={(e) => {
                        e.target.src = bigFallbackImg;
                      }}
                    />
                  </div>

                  <div className={styles.boxFlexT}>
                    <h5 className={styles.cvName}>
                      {cv.fullName} 'tshepiem.dev'
                    </h5>

                    <div className={styles.boxFlexF}>
                      <h5 className={styles.position}>
                        <img
                          className={styles.posImg}
                          src={StarImg}
                          alt={cv.position}
                        />
                        {cv.position}
                      </h5>

                      <h5
                        className={`${styles.mainLabel} ${styles[statusKey]}`}
                      >
                        <img
                          className={styles.statusImg}
                          src={statusImages[statusKey]}
                          alt={statusKey}
                        />
                        {cv.status}
                      </h5>
                    </div>

                    {cv.links?.map((link, i) => (
                      <div className={styles.vwrapper} key={i}>
                        <p className={styles.sectionLabel}>{link.name}</p>
                        <Link
                          className={styles.labelLink}
                          to={link.url}
                          target="_blank"
                        >
                          <p className={styles.linkHolder}>{link.url}</p>
                          <img
                            className={styles.chevronImg2}
                            src={ChevronImg}
                            alt="/"
                          />
                        </Link>
                      </div>
                    ))}

                    <div className={styles.vwrapper}>
                      <p className={styles.sectionLabel}>Location</p>
                      <p className={styles.headerlabel}>{cv.location}</p>
                    </div>

                    <div className={styles.vwrapper}>
                      <p className={styles.sectionLabel}>Email</p>
                      <Link
                        className={styles.headerlabelLinker}
                        to={"mailto:" + cv.email}
                      >
                        {cv.email}
                      </Link>
                    </div>

                    <div className={styles.vwrapper}>
                      <p className={styles.sectionLabel}>Phone</p>
                      <Link
                        className={styles.headerlabelLinker}
                        to={"tel:" + cv.phone}
                      >
                        {cv.phone}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>Professional Summary</p>
                {cv.professionalSummary?.map((item, index) => (
                  <div className={styles.sectionContentWrapper} key={index}>
                    {item.text.map((sentence, sentenceIndex) => (
                      <h5 key={sentenceIndex} className={styles.summary}>
                        {sentence}
                      </h5>
                    ))}

                    <div className={styles.cvSectionImageWrapper}>
                      <img
                        className={styles.cvSectionImage}
                        src={item?.image.trim()}
                        alt={item.text}
                        onClick={() => {
                          setSelectedImage(item?.image);
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = bigFallbackImg;
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>Education</p>
                {cv.education?.map((edu, i) => (
                  <div className={styles.listWrapper} key={i}>
                    <h5 className={styles.headerlabel}>
                      <span className={styles.spanStar}>• </span>
                      {edu.type}
                    </h5>
                    <p className={styles.label}>{edu.name}</p>
                    <p className={styles.label}>{edu.institute}</p>
                    <p className={styles.label}>{edu.year}</p>
                  </div>
                ))}
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>Experience</p>
                {cv.experience?.map((exp, i) => (
                  <div className={styles.listWrapper} key={i}>
                    <h5 className={styles.headerlabel}>
                      <span className={styles.spanStar}>• </span>
                      {exp.position}
                    </h5>
                    <p className={styles.label}>{exp.company}</p>
                    <p className={styles.label}>
                      {exp.from} - {exp.to}
                    </p>
                    <p className={styles.label}>{exp.location}</p>
                  </div>
                ))}
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>Projects</p>
                {cv.projects?.map((p, i) => (
                  <div className={styles.sectionContentWrapper} key={i}>
                    <h5 className={styles.headerlabel}>
                      <span className={styles.spanStar}>• </span>
                      {p.name}
                    </h5>
                    <p className={styles.label}>{p.type}</p>
                    <div className={styles.cvSectionImageWrapper}>
                      <img
                        className={styles.cvSectionImage}
                        src={p?.image.trim()}
                        alt={p.name}
                        onClick={() => {
                          setSelectedImage(p?.image);
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = bigFallbackImg;
                        }}
                      />
                    </div>
                  </div>
                ))}
                <BtnCTABlackSmall
                  buttonText={"Browse all"}
                  href={"/projects"}
                />
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>Technical Skills</p>
                {cv.technicalSkills?.map((group, i) => (
                  <div className={styles.listWrapper} key={i}>
                    <h5 className={styles.headerlabel}>
                      <span className={styles.spanStar}>• </span>
                      {group.category}
                    </h5>
                    <p className={styles.label}>{group.skills?.join(", ")}</p>
                  </div>
                ))}
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>Soft Skills</p>
                <p className={styles.headerlabelPro}>
                  {cv.softSkills?.join(", ")}
                  <span className={styles.spanStar}>.</span>
                </p>
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>References</p>
                <p className={styles.headerlabel}>
                  {cv.references}
                  <span className={styles.spanStar}>*</span>
                </p>
              </div>

              <div className={styles.wrapper}>
                <p className={styles.sectionLabel}>Document Preview</p>
                <div className={styles.iframeWrapper}>
                  <iframe
                    src={cv?.cvLink ? convertDriveToPreview(cv.cvLink) : ""}
                    className={styles.iframe}
                    title="CV Preview"
                    loading="lazy"
                  />
                </div>
                <div className={styles.ctaButtonsWrapper}>
                  <BtnCTAWhite
                    buttonText="Download CV"
                    onClick={handleDownloadCv}
                  />
                  <BtnCTABlack
                    buttonText="Preview document"
                    onClick={handleOpenCv}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ImagePreviewModal
        src={selectedImage}
        alt={hiMe}
        pageName={hiMe}
        imageDescription={cv?.position}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <ShareSiteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
