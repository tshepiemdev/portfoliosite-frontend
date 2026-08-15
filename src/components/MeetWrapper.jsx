import { useEffect, useRef, useState } from "react";
import styles from "../styles/Meet.module.css";
import myDefaultProfileImage from "../assets/images/tshepang.jpg";
import bigFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import BentoImg from "../assets/icons/logo-white.svg";
import TechStackImg from "../assets/icons/ball-pile.svg";
import BuildsImg from "../assets/icons/build-alt.svg";
import ShippedImg from "../assets/icons/space-shuttle.svg";
import PapersImg from "../assets/icons/student-alt.svg";
import ExperienceImg from "../assets/icons/construction-helmet.svg";
import ReloadImg from "../assets/icons/refresh.svg";
import ErrorTriangeleImg from "../assets/icons/triangle-warning.svg";
import API_URL from "../config/api";

export default function MeetWrapper() {
  const sliderRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    techStack: 0,
    projects: 0,
    shippedProducts: 0,
    qualifications: 0,
    experienceYears: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`${API_URL}/api/stats`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch stats");
      }

      setStats(data.data);
    } catch (error) {
      console.error("Stats fetch error:", error);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const displayValue = (value) => {
    return value;
  };

  const bentoItems = [
    {
      icon: TechStackImg,
      value: displayValue(stats.techStack),
      label: "+",
      subtext: "Tech Stack",
      summary:
        "Frameworks, languages, cloud services, and tools I use to build modern software.",
    },
    {
      icon: BuildsImg,
      value: displayValue(stats.projects),
      label: "+ Builds",
      subtext: "Build Projects",
      summary:
        "From idea to launch, creating solutions that solve real business problems.",
    },
    {
      icon: ShippedImg,
      value: displayValue(stats.shippedProducts),
      label: " Shipped",
      subtext: "Shipped Products",
      summary:
        "Successfully shipped applications and features into production environments.",
    },
    {
      icon: PapersImg,
      value: displayValue(stats.qualifications),
      label: "+",
      subtext: "Qualifications",
      summary:
        "Formal training, certifications, and ongoing professional development.",
    },
    {
      icon: ExperienceImg,
      value: displayValue(stats.experienceYears),
      label: "+ Years",
      subtext: "Experience",
      summary:
        "Working with teams and organizations to design, build, and improve software.",
    },
  ];

  const totalSlides = bentoItems.length + 1;

  const getCardWidth = () => {
    const slider = sliderRef.current;

    if (!slider || !slider.children.length) return 0;

    const gap = parseFloat(getComputedStyle(slider).gap);

    return slider.children[0].offsetWidth + gap;
  };

  const handleScroll = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    const cardWidth = getCardWidth();

    const index = Math.round(slider.scrollLeft / cardWidth);

    setActiveIndex(index);
  };

  const scrollToSlide = (index) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const cardWidth = getCardWidth();

    slider.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  return (
    <div className={styles.wrapper}>
      <div
        ref={sliderRef}
        className={styles.bentoWrapper}
        onScroll={handleScroll}
      >
        <div className={styles.bento}>
          <div className={styles.developerImageWrapper}>
            <img
              className={styles.developerImage}
              src={myDefaultProfileImage || bigFallbackImg}
              alt="developer"
              onError={(e) => {
                e.target.src = bigFallbackImg;
              }}
            />
          </div>

          <p className={styles.myText}>
            <img className={styles.bentoIcon1} src={BentoImg} alt="that's me" />
            that's me
          </p>
        </div>

        {bentoItems.map((item) => (
          <div key={item.subtext} className={styles.bento}>
            <p className={styles.bentoSubtext}>{item.subtext}</p>

            <h4 className={styles.bentoTitle}>
              <img
                className={styles.bentoIcon}
                src={item.icon}
                alt={item.subtext}
              />

              {loading ? (
                <span className={styles.miniLoaderWrapper}>
                  <div className={styles.miniLoader}></div>
                </span>
              ) : error ? (
                <span className={styles.statError}>
                  <img
                    className={styles.errorImg}
                    src={ErrorTriangeleImg}
                    alt="error"
                  />
                  Error loading stat
                  <button
                    className={styles.refreshButton}
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <img className={styles.reloadImg} src={ReloadImg} />
                  </button>
                </span>
              ) : (
                <span className={styles.statValue}>
                  {item.value}
                  {item.label}
                </span>
              )}
            </h4>

            <p className={styles.bentoSummary}>{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
