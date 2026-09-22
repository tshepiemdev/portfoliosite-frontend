import styles from "../styles/NotFound.module.css";
import PageTopHeading from "../components/PageTopHeading";
import BtnCTAWhiteSmall from "../components/BtnCTAWhiteSmall";
import LogoImg from "../assets/icons/logo-black.svg";
import ogImages from "../config/ogImages";
import createMeta from "../config/seo";

export function meta() {
  return createMeta({
    title: "Page not found",
    description:
      "The page you were looking for might not exist or has been temporarly removed.",
    image: ogImages.notFound,
    url: "/not-found",
    keywords: "page not found",
    robots: "noindex, nofollow",
  });
}

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.errorContentWrapper}>
        <PageTopHeading
          icon={LogoImg}
          title={
            <>
              Not found: <br />
              error 404
            </>
          }
          textAlign="start"
          centerContent="start"
        />

        <div className={styles.card}>
          <p
            className={styles.label}
            style={{
              color: "#ff8d8d",
            }}
          >
            The page you were looking for might not <br />
            exist or has been temporarly removed.
          </p>

          <BtnCTAWhiteSmall buttonText={"Back to home"} href={"/"} />
        </div>
      </div>
    </div>
  );
}
