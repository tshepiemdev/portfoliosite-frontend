import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Footer.module.css";
import LogoImg from "../assets/images/favicon.svg";
import FooterLinksBox from "./FooterLinks";
import SectionDevider from "./SectionDevider";
import MyLogoImg from "../assets/images/favicon.svg";
import myProfileImage from "../assets/images/tshepang.jpg";
import StarImg from "../assets/icons/spark.svg";
import DiamondImg from "../assets/icons/diamond.svg";
import ShareSiteModal from "./ShareSiteModal";
import nextImg from "../assets/icons/chevron-down.svg";
import contactInfo from "../config/contactInfo";
import SocialIconsWrapper from "./SocialIconsWrapper";
import Logo from "./Logo";
import nextIcon from "../assets/icons/chevron-right.svg";
import phoneImg from "../assets/icons/phone-flip.svg";
import emailImg from "../assets/icons/envelope.svg";

export default function Footer({}) {
  const navigate = useNavigate();
  const footer = contactInfo.footer;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavigate = (href) => {
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    navigate("/");

    setTimeout(() => {
      document.getElementById(href)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const contactOptions = [
    { icon: emailImg, link: `mailto:${contactInfo.personal.email}` },
    { icon: phoneImg, link: `tel:${contactInfo.personal.phone}` },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Logo text="" isClickable={false}/>
        </div>

        <div className={styles.boxWrapper}>
          <div className={styles.wrapper}>
            <p className={styles.wordmarkSubtext}>
              Simply I don't just write code. <br />I build efficient solutions.
              I’m Tshepang <br />
              Mmathebe Kgaphola, a creative and skilled <br />
              developer based in South Africa, PTA.
            </p>

            <ul className={styles.contactOptionsUl}>
              {contactOptions.map((option) => (
                <li key={option.link} className={styles.contactOptionsLi}>
                  <a className={styles.contactOptionsLinkTo} href={option.link}>
                    <img className={styles.icon} src={option.icon} alt="" />
                    {option.link.replace("mailto:", "").replace("tel:", "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.wrapper}>
            <div className={styles.footerLinksWrapper}>
              {footer.sections.map((section) => (
                <FooterLinksBox
                  key={section.title}
                  listHeader={section.title}
                  links={section.links}
                  onItemClick={(label, href) => {
                    if (href === "#download-cv") {
                      return false;
                    }

                    if (href === "#share-site") {
                      setIsShareModalOpen(true);
                      return true;
                    }

                    handleNavigate(href);
                    return true;
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <h2 className={styles.title}>tshepiem.dev</h2>

       

        <div className={styles.lastWrapper}>
          <SocialIconsWrapper
            text="Ask AI"
            only={["Chatgpt", "Gemini", "Claude"]}
          />

          <SocialIconsWrapper
            text="Follow me"
            only={[
              "Twitter",
              "Instagram",
              "LinkedIn",
              "Facebook",
              "YouTube",
              "Threads",
            ]}
          />

          <p className={styles.copyrightText}>
            <span>&copy;</span>
            {new Date().getFullYear()} tshepiem.dev. All rights reserved
          </p>
        </div>

        <ShareSiteModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    </footer>
  );
}
