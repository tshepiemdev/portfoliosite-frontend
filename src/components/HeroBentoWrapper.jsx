import { useEffect, useState } from "react";
import styles from "../styles/HeroBentoWrapper.module.css";
import API_URL from "../config/api";
import JavaScriptIcon from "../assets/icons/js.svg";
import TypeScriptIcon from "../assets/icons/ts.svg";
import CSharpIcon from "../assets/icons/csharp.svg";
import ReactIcon from "../assets/icons/react.svg";
import NodeIcon from "../assets/icons/nodejs.svg";
import ExpressIcon from "../assets/icons/express.svg";
import MongoIcon from "../assets/icons/mongo.svg";
import PostgreIcon from "../assets/icons/postgresql.svg";
import MySqlIcon from "../assets/icons/mysql.svg";
import GitIcon from "../assets/icons/git.svg";
import GitHubIcon from "../assets/icons/github-c.svg";
import VsCodeIcon from "../assets/icons/vs.svg";
import FigmaIcon from "../assets/icons/figma.svg";
import LogoImg from "../assets/icons/logo-white.svg";
import AwsImg from "../assets/icons/aws-color.svg";
import DefaultBentoImage from "../assets/images/fallback_img_16_9_light.svg";

export default function HeroBentoWrapper() {
  const fallbackBentoImages = [
    "React",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "PostgreSQL",
    "Express.js",
    "JavaScript",
    "C#",
    "MySQL",
    "Git",
    "Figma",
    "VS Code",
  ].map((name) => ({
    name,
    imageUrl: DefaultBentoImage,
  }));

  const [bentoImages, setBentoImages] = useState(fallbackBentoImages);
  const [activeGroup, setActiveGroup] = useState(0);
  const [animate, setAnimate] = useState(true);

  const CACHE_KEY = "bentoImages";
  const CACHE_TIME = 1000 * 60 * 60 * 24;

  const fetchBentoImages = async () => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);

      if (Date.now() - parsed.time < CACHE_TIME) {
        setBentoImages(parsed.data);
        return;
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/bento-images`);

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Request failed");
      }

      const images = result.data || result;

      setBentoImages(images);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: images,
          time: Date.now(),
        }),
      );
    } catch (err) {
      console.log("Bento images fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBentoImages();
  }, []);

  const loopImages = [...bentoImages, ...bentoImages];

  const bestSkills = {
    languages: [
      { name: "JavaScript", icon: JavaScriptIcon },
      { name: "TypeScript", icon: TypeScriptIcon },
      { name: "C#", icon: CSharpIcon },
    ],
    frameworks: [
      { name: "React", icon: ReactIcon },
      { name: "Node.js", icon: NodeIcon },
      { name: "Express.js", icon: ExpressIcon },
    ],
    databases: [
      { name: "Aws", icon: AwsImg },
      { name: "MongoDB", icon: MongoIcon },
      { name: "PostgreSQL", icon: PostgreIcon },
      { name: "MySQL", icon: MySqlIcon },
    ],
    tools: [
      { name: "Git", icon: GitIcon },
      { name: "GitHub", icon: GitHubIcon },
      { name: "VS Code", icon: VsCodeIcon },
      { name: "Figma", icon: FigmaIcon },
    ],
  };

  const skillGroups = [
    {
      title: "Languages",
      skills: bestSkills.languages,
    },
    {
      title: "Frameworks",
      skills: bestSkills.frameworks,
    },
    {
      title: "Databases",
      skills: bestSkills.databases,
    },
    {
      title: "Tools",
      skills: bestSkills.tools,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setActiveGroup((prev) => (prev + 1) % skillGroups.length);
        setAnimate(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderTrack = (className, prefix) => (
    <div className={className}>
      {loopImages.map((img, index) => (
        <div
          key={`${prefix}-${img.name}-${index}`}
          className={styles.bentoImageWrapper}
        >
          <img
            className={styles.bentoImage}
            src={img.imageUrl || DefaultBentoImage}
            alt={img.name}
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = DefaultBentoImage;
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.bentoWrapper}>
      {renderTrack(styles.sliderTrackLeft, "left")}
      {renderTrack(styles.sliderTrackRight, "right")}
      {renderTrack(styles.sliderTrackLeft2, "left2")}

      <div className={styles.overlay}>
        <div
          className={`${styles.bestSkillsWrapper} ${
            animate ? styles.show : styles.hide
          }`}
        >
          <div className={styles.skillsRow}>
            {skillGroups[activeGroup].skills.map((skill, index) => (
              <div
                className={styles.skillImgWrapper}
                key={skill.name}
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <img
                  className={styles.bestSkillImg}
                  src={skill.icon}
                  alt={skill.name}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        <p className={styles.label}>
          <img className={styles.spanImg} src={LogoImg} alt="Best at these" />
          <span className={styles.labelSpan}>Best</span> at these
        </p>
      </div>
    </div>
  );
}
