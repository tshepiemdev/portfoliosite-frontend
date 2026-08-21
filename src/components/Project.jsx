import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Project.module.css";
import nextImg from "../assets/icons/chevron-down.svg";
import starImg from "../assets/icons/logo-white.svg";
import ProjectStatusBadge from "./ProjectStatusBadge";
import smallFallbackImg from "../assets/images/fallback_img_16_9_light.svg";
import BtnCTABlackSmall from "./BtnCTABlackSmall";
import ChevronImg from "../assets/icons/arrow-up-right.svg";

function Project({
  projectOrder,
  projectStatus,
  projectIcon,
  projectName,
  projectSummary,
  projectType,
  projectLink,
  isProjNew,
}) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenShare = () => {
    setIsShareOpen(true);
  };

  const handleCloseShare = () => {
    setIsShareOpen(false);
  };

  const finalStatus =
    "/" +
    projectStatus.charAt(0).toUpperCase() +
    projectStatus.slice(1) +
    " stage";

  return (
    <Link to={projectLink} className={styles.projectBox}>
      <div className={styles.projectIconWrapper}>
        <img
          className={styles.projectIcon}
          src={projectIcon?.trim() ? projectIcon : smallFallbackImg}
          alt={`${projectName || "project"} icon`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = smallFallbackImg;
          }}
          loading="lazy"
          decoding="async"
        />

        <div className={styles.overlaysWrapper}></div>
      </div>

      <div className={styles.metaWrapper}>
        <h2 className={styles.name}>
          {projectName || "Untitled"}
          {isProjNew && <span className={styles.chip}>New</span>}
        </h2>

        <div className={styles.controlsWrapper}>
          <div className={styles.vWrapper}>
            <img src={starImg} className={styles.labelIcon} alt={projectType} />
            <p className={styles.label}>{projectType}</p>
            <p className={styles.label}>{finalStatus}</p>
          </div>

          <div className={styles.chevronBox}>
            <img
              className={styles.chevronIcon}
              src={ChevronImg}
              alt="open project"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(Project);
