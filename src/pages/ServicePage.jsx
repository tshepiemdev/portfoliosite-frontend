import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { slugify } from "../utils/slugify";
import styles from "../styles/ServicePage.module.css";
import ServicePageTopTitlesView from "../components/ServicePageTopTitles";
import BtnDial from "../components/BtnDial";
import LoaderMaxView from "../components/LoaderMax";
import NotFound from "./NotFound";
import shareImg from "../assets/icons/share.svg";
import copyLinkImg from "../assets/icons/link.svg";
import linkedInImg from "../assets/icons/linkedin (2).svg";
import xImg from "../assets/icons/twitter-alt.svg";
import threadsImg from "../assets/icons/threads.svg";
import phoneImg from "../assets/icons/phone-flip.svg";
import emailImg from "../assets/icons/envelope.svg";
import logoImg from "../assets/icons/logo.svg";
import noticeIcon from "../assets/icons/exclamation3.svg";
import PageHelmet from "../components/PageHelmet";
import API_URL from "../config/api";
import contactInfo from "../config/contactInfo";
import fileIcon from "../assets/icons/folder.svg";
import nextIcon from "../assets/icons/arrow-up-right.svg";
import SectionDevider from "../components/SectionDevider";
import smallFallbackImg from "../assets/images/fallback_img_16_9.svg";
import ShareSiteModal from "../components/ShareSiteModal";
import BtnCTAWhite from "../components/BtnCTAWhite";
import BtnCTABlackSmall from "../components/BtnCTABlackSmall";
import BadgeImg from "../assets/icons/spark.svg";
import NoticeLbl from "../components/NoticeLbl";
import ImagePreviewModal from "../components/ImagePreviewModal";
import { getShareOptions } from "../utils/shareOptions";
import { useToast } from "../components/ToastContext";
import ogImages from "../config/ogImages";

export default function ServicePage() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { personal } = contactInfo;
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const fetchService = async () => {
    try {
      setLoading(true);
      setNotFound(false);

      const [servicesRes, pricingRes] = await Promise.all([
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/pricings`),
      ]);

      const servicesData = await servicesRes.json();
      const pricingData = await pricingRes.json();

      const services = Array.isArray(servicesData)
        ? servicesData
        : servicesData?.data || [];

      const prices = Array.isArray(pricingData)
        ? pricingData
        : pricingData?.data || [];

      const found = services.find(
        (item) => item.slug === slug || slugify(item.name) === slug,
      );

      if (!found) {
        setNotFound(true);
        return;
      }

      const matchedPricing = prices.find(
        (item) => item.type === found.pricingAlias,
      );

      setService(found);
      setPricing(matchedPricing);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const siteUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    fetchService();
  }, [slug]);

  const handleCopyLink = async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand("copy");

        document.body.removeChild(textarea);
      }

      showToast(
        "success",
        "Link copied",
        "Service page link copied and ready to share",
      );
    } catch (err) {
      console.error("Copy failed:", err);

      showToast("error", "Copy failed", "Unable to copy service page link");
    }
  };

  if (loading) return <LoaderMaxView />;
  if (notFound) return <NotFound />;

  const starterPackage = pricing?.packages?.find(
    (item) => item.package === "Starter" && item.isActive,
  );

  const startingPrice = starterPackage?.nowPrice;
  const pricingUnit = starterPackage?.per;

  const shareOptions = getShareOptions({
    siteUrl,
    siteName: service?.name,
    handleCopyLink,
    icons: {
      threads: threadsImg,
      x: xImg,
      linkedIn: linkedInImg,
    },
  });

  return (
    <div className={styles.servicePage}>
      <PageHelmet
        title={`${service.name}`}
        description={service.shortDescription}
        image={ogImages.services}
        url={siteUrl}
        keywords={`${service.name}, ${service.category}, hire developer, software development, custom solutions`}
        siteName="Service"
      />

      <div className={styles.serviceWrapper}>
        <ServicePageTopTitlesView
          icon={service.icon}
          category={service.category || "Unspecified"}
          name={service.name}
          shortDescription={service.shortDescription}
          buttonText={service.cta?.text || "Request Service"}
          shareButtonText={"Share service"}
          linkTo={`/pricing?service=${service.pricingAlias}`}
          isFeatured={service.isFeatured}
          shareOptions={shareOptions}
          onShareClick={() => setIsShareModalOpen(true)}
        />

        <div className={styles.metaWrapper}>
          <p className={styles.miniHeader}>
            <img
              className={styles.badgeImg}
              src={BadgeImg}
              alt={"Service overview specifications"}
            />
            Overview specifications
          </p>

          <ul className={styles.serviceSpecsUl}>
            {startingPrice && (
              <li className={styles.serviceSpecLi}>
                <p className={styles.label}>Pricing</p>

                <p className={styles.startingFromLbl}>
                  <img className={styles.textIcon} src={logoImg} alt="" />
                  Starting from
                </p>

                <p className={styles.currency}>R</p>

                <p className={styles.rate}>
                  {new Intl.NumberFormat("en-ZA").format(startingPrice)}
                </p>

                {pricingUnit && <p className={styles.unit}>/{pricingUnit}</p>}
              </li>
            )}

            {service.availability?.operatingDays?.length > 0 && (
              <li className={styles.serviceSpecLi}>
                <p className={styles.label}>Operational days</p>
                <p className={styles.rate}>
                  {service.availability.operatingDays.join(", ")}
                </p>
              </li>
            )}

            {service.availability?.hours && (
              <li className={styles.serviceSpecLi}>
                <p className={styles.label}>Operational hours</p>
                <p className={styles.rate}>{service.availability.hours}</p>

                {service.availability.timezone && (
                  <p className={styles.unit}>{service.availability.timezone}</p>
                )}
              </li>
            )}

            {service.timeline && (
              <li className={styles.serviceSpecLi}>
                <p className={styles.label}>Timeline</p>
                <p className={styles.rate}>{service.timeline}</p>
              </li>
            )}
          </ul>
        </div>

        <section className={styles.detailedSection}>
          <div className={styles.sectionBlock}>
            <h3 className={styles.miniHeader}>
              <img
                className={styles.badgeImg}
                src={BadgeImg}
                alt={"Service overview specifications"}
              />
              Detailed specifications
            </h3>
            <p className={styles.descriptionlabel}>
              {service?.longDescription}
            </p>
          </div>

          <div className={styles.sectionBentoWrapper}>
            {service.technologies?.length > 0 && (
              <div className={styles.sectionBentoBox}>
                <h3 className={styles.bentoHeader}>
                  <img
                    className={styles.badgeImg}
                    src={BadgeImg}
                    alt="Technologies"
                  />
                  Technologies
                </h3>
                <ul className={styles.serviceSpecsUlmini}>
                  <li className={styles.serviceSpecLimini}>
                    {service.technologies.join(", ")}.
                  </li>
                </ul>
              </div>
            )}

            {service.subjects?.length > 0 && (
              <div className={styles.sectionBentoBox}>
                <h3 className={styles.bentoHeader}>
                  <img
                    className={styles.badgeImg}
                    src={BadgeImg}
                    alt="Subjects"
                  />
                  Subjects
                </h3>
                <ul className={styles.serviceSpecsUlmini}>
                  {service.subjects?.map((item, index) => (
                    <li className={styles.serviceSpecLiminiSubject} key={index}>
                      <span className={styles.spanBullet}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.features?.length > 0 && (
              <div className={styles.sectionBentoBox}>
                <h3 className={styles.bentoHeader}>
                  <img
                    className={styles.badgeImg}
                    src={BadgeImg}
                    alt={"Service overview specifications"}
                  />
                  Features
                </h3>
                <ul className={styles.serviceSpecsUlmini}>
                  <li className={styles.serviceSpecLimini}>
                    {service.features.join(", ")}.
                  </li>
                </ul>
              </div>
            )}

            {service.deliverables?.length > 0 && (
              <div className={styles.sectionBentoBox}>
                <h3 className={styles.bentoHeader}>
                  <img
                    className={styles.badgeImg}
                    src={BadgeImg}
                    alt={"Service overview specifications"}
                  />
                  Deliverables
                </h3>
                <ul className={styles.serviceSpecsUlmini}>
                  <li className={styles.serviceSpecLimini}>
                    {service.deliverables.join(", ")}.
                  </li>
                </ul>
              </div>
            )}

            {service.legal && (
              <div className={styles.sectionBentoBox}>
                <h3 className={styles.bentoHeader}>
                  <img
                    className={styles.badgeImg}
                    src={BadgeImg}
                    alt={"Legal"}
                  />
                  Legal
                </h3>

                <li className={styles.serviceSpecLimini}>
                  Service binding legal guidelines & regulations
                </li>

                {service.legal && (
                  <ul className={styles.serviceSpecsUlmini}>
                    {service.legal?.map((item, index) => (
                      <Link
                        key={index}
                        className={styles.serviceSpecLimini}
                        to={item.link}
                      >
                        <img
                          className={styles.folderIcon}
                          src={fileIcon}
                          alt={item.name}
                        />
                        {item.name}
                        <img
                          className={styles.nextIcon}
                          src={nextIcon}
                          alt={item.name}
                        />
                      </Link>
                    ))}
                  </ul>
                )}

                {service.legal.length === 0 && (
                  <div className={styles.sectionBlockNotice}>
                    <NoticeLbl
                      text={
                        "Couln't find any listed legal guidelines & regulations. You may contact the developer."
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <ShareSiteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
