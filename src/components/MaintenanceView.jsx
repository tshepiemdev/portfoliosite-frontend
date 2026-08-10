import styles from "../styles/MaintenanceView.module.css";
import LogoImg from "../assets/icons/logo-white.svg";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";
import SectionDevider from "../components/SectionDevider";

export default function MaintenanceView({ data, pageName }) {
  return (
    <div className={styles.maintenanceWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.contentWrapper}>
          <img className={styles.img} src={LogoImg} alt={data?.title} />
          <h2 className={styles.title}>{data?.title}</h2>
          <h2 className={styles.message}>{data?.message}</h2>

          <div className={styles.card}>
            <h2 className={styles.label}>
              <span className={styles.spanText}>/{pageName}</span> is currently <br />
              undergoing maintenance.
            </h2>

            {data?.ctaText && data?.ctaLink && (
              <BtnCTAWhiteSmall buttonText={data.ctaText} href={data.ctaLink} />
            )}

            <p className={styles.copyrightText}>
              <span>&copy;</span>
              {new Date().getFullYear()} tshepiem.dev. <br />
              All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
