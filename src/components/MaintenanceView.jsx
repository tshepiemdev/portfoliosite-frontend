import styles from "../styles/MaintenanceView.module.css";
import LogoImg from "../assets/icons/logo-white.svg";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import SectionDevider from "../components/SectionDevider";

export default function MaintenanceView({ data, pageName }) {
  return (
    <div className={styles.maintenanceWrapper}>
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <img className={styles.img} src={LogoImg} alt={data?.title} />
          <h2 className={styles.title}>{data?.title || "Maintenance"}</h2>
          {data?.message && <h2 className={styles.message}>{data?.message}</h2>}
          <h2 className={styles.message}>Please check back later.</h2>
        </div>

        <div className={styles.wrapper}>
          <h2 className={styles.label}>
            Note that <span className={styles.spanText}>{pageName}</span>{" "}
            service is currently <br />
            down for maintenance.
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
