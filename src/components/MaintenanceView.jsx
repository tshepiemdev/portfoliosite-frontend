import styles from "../styles/MaintenanceView.module.css";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import SectionDevider from "../components/SectionDevider";
import PageTopHeading from "../components/PageTopHeading";
import LogoImg from "../assets/icons/logo-black.svg";

export default function MaintenanceView({ data, pageName }) {
  return (
    <div className={styles.maintenanceWrapper}>
      <div className={styles.contentWrapper}>
        <PageTopHeading
          icon={LogoImg}
          title={
            data?.title || (
              <>
                Maintenance
                <br />
                underway
              </>
            )
          }
          subtext={data?.message || "Please check back later."}
          textAlign="start"
          centerContent="start"
        />

        <div className={styles.wrapper}>
          <h2 className={styles.label}>
            Please be aware that <span className={styles.spanText}>{pageName}</span>{" "}
            service is <br />
            currently down for maintenance.
          </h2>

          {data?.ctaText && data?.ctaLink && (
            <BtnCTAWhiteSmall buttonText={data?.ctaText} href={data?.ctaLink} />
          )}

          <p className={styles.copyrightText}>
            <span>&copy;</span>
            {new Date().getFullYear()} tshepiem.dev. <br />
            All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
