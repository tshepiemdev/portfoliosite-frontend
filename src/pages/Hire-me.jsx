import { useState } from "react";
import styles from "../styles/Hire-me.module.css";
import ArrowUpImg from "../assets/icons/chevron-up.svg";
import LogoImg from "../assets/images/favicon.svg";
import StarImg from "../assets/icons/logo-black.svg";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import workImg from "../assets/icons/objects-column (1).svg";
import servicesImg from "../assets/icons/terminal (1).svg";
import blogImg from "../assets/icons/book-alt.svg";
import homeImg from "../assets/icons/logo-black.svg";
import phoneImg from "../assets/icons/phone-flip.svg";
import emailImg from "../assets/icons/envelope.svg";
import messageImg from "../assets/icons/beacon-light.svg";
import speakImg from "../assets/icons/user-speaking.svg";
import commentImg from "../assets/icons/beacon.svg";
import folderImg from "../assets/icons/folder-open.svg";
import SectionDevider from "../components/SectionDevider";
import BtnCTAWhite from "../components/BtnCTAWhite";
import BtnCTABlack from "../components/BtnCTABlack";
import PageHelmet from "../components/PageHelmet";
import HiremeOptionBox from "../components/HiremeOptionBox";
import PageTopHeading from "../components/PageTopHeading";
import contactInfo from "../config/contactInfo";
import ogImages from "../config/ogImages";

const linkedInLink = contactInfo.social.find(
  (social) => social.name === "LinkedIn",
)?.url;

const phoneLink = contactInfo.personal.phone.replace(/\s/g, "");

const emailLink = contactInfo.personal.email;

const hireOptions = [
  {
    icon: commentImg,
    type: "single",
    name: (
      <>
        Submit a form, <br />
        people love my forms
      </>
    ),
    description: "",
    url: "/contact?reason=job_opportunity",
    bg: "",
    color: "",
    isFeatured: true,
    isPopular: true,
    optionCTAText: "Open form",
  },
  {
    icon: speakImg,
    type: "group",
    name: (
      <>
        Prefer talking? <br />
        Call or email me
      </>
    ),
    description: "",
    bg: "",
    color: "",
    isFeatured: false,
    options: [
      {
        name: "Call",
        url: `tel:${phoneLink}`,
        icon: phoneImg,
      },
      {
        name: "Send Email",
        url: `mailto:${emailLink}`,
        icon: emailImg,
      },
    ],
  },
  {
    icon: linkedInImg,
    type: "single",
    name: (
      <>
        Connect with me <br />
        on LinkedIn
      </>
    ),
    description: "",
    url: linkedInLink,
    bg: "",
    color: "",
    isFeatured: true,
    optionCTAText: "Open LinkedIn",
  },
  {
    icon: folderImg,
    type: "single",
    name: (
      <>
        You might be <br />
        looking for this doc
      </>
    ),
    description: "",
    bg: "",
    color: "",
    url: "/resume",
    isFeatured: true,
    optionCTAText: "View CV",
  },
];

const whileStillHere = [
  {
    icon: workImg,
    type: "single",
    name: (
      <>
        Explore my <br />
        projects
      </>
    ),
    description: "",
    bg: "",
    color: "",
    url: "/projects",
    isFeatured: false,
    optionCTAText: "See my work",
  },
  {
    icon: servicesImg,
    type: "single",
    name: (
      <>
        See what I can <br />
        build for you
      </>
    ),
    description: "",
    bg: "",
    color: "",
    url: "/services",
    isFeatured: false,
    optionCTAText: "View services",
  },
  {
    icon: blogImg,
    type: "single",
    name: (
      <>
        Read my latest <br />
        articles
      </>
    ),
    description: "",
    bg: "",
    color: "",
    url: "/blog",
    isFeatured: false,
    optionCTAText: "Read blog",
  },
  {
    icon: homeImg,
    type: "single",
    name: (
      <>
        New here? Learn <br />
        more about me
      </>
    ),
    description: "",
    bg: "",
    color: "",
    url: "/",
    isFeatured: false,
    optionCTAText: "Get started",
  },
];

export default function HireMe() {
  return (
    <div className={styles.hireMe}>
      <PageHelmet
        title="Creative & Skilled Software Developer"
        description="Creative, skilled and qualified developer ready for workspace experience."
        image=""
        url={window.location.hireMe}
        keywords="hire developer, software developer, web developer, React, Node.js, JavaScript, TypeScript, C#, South Africa"
        siteName="Hire Me"
      />

      <div className={styles.boxWrapper}>
        <PageTopHeading
          title={
            <>
              Hire me. Get me <br />
              me on your team
            </>
          }
          subtext={
            <>
              Creative, skilled and qualified developer <br />
              ready for workspace experience.
            </>
          }
        />

        <div className={styles.hireThruOptions}>
          {hireOptions.map((option, index) => (
            <HiremeOptionBox
              key={index}
              icon={option.icon}
              name={option.name}
              description={option.description}
              bg={option.bg}
              color={option.color}
              optionCTALink={option.url}
              optionCTAText={option.optionCTAText}
              isFeatured={option.isFeatured}
              isPopular={option.isPopular}
              options={option.options}
              type={option.type}
            />
          ))}
        </div>

        <h1 className={styles.minititle}>
          Recommended. What to <br />
          explore while you're here
        </h1>
        <div className={styles.whileHereOptions}>
          {whileStillHere.map((option, index) => (
            <HiremeOptionBox
              key={index}
              icon={option.icon}
              name={option.name}
              description={option.description}
              bg={option.bg}
              color={option.color}
              optionCTALink={option.url}
              optionCTAText={option.optionCTAText}
              isFeatured={option.isFeatured}
              options={option.options}
              type={option.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
