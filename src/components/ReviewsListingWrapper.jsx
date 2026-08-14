import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../styles/ReviewsListingWrapper.module.css";
import ReviewBentoBox from "./ReviewBentoBox";
import API_URL from "../config/api";
import LoaderView from "./Loader";
import ErrorView from "./ErrorView";

export default function ReviewsListingWrapper() {
  const { settings } = useOutletContext();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const reviewsUnderMaintenance =
    import.meta.env.PROD && settings?.maintenancePages?.reviews === true;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setErrorType(null);

      const res = await fetch(`${API_URL}/api/reviews`);

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch reviews");
      }

      const filtered = (data.data || []).filter((r) => r.isActive === true);

      setReviews(filtered);
    } catch (err) {
      console.log("Fetch error:", err);

      if (!navigator.onLine) {
        setErrorType("network");
      } else if (err instanceof TypeError) {
        setErrorType("server");
      } else {
        setErrorType("default");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className={styles.wrapAll}>
      <div className={styles.ListingWrapper}>
        {reviewsUnderMaintenance && (
          <div className={styles.fullSpan}>
            <ErrorView
              errType="default"
              errorText={
                <>
                  Under maintenace. <br />
                  Please check back later.
                </>
              }
            />
          </div>
        )}

        {!reviewsUnderMaintenance && loading && (
          <div className={styles.fullSpan}>
            <LoaderView />
          </div>
        )}

        {!reviewsUnderMaintenance && !loading && errorType && (
          <div className={styles.fullSpan}>
            <ErrorView errType={errorType} onRetry={fetchReviews} />
          </div>
        )}

        {!reviewsUnderMaintenance &&
          !loading &&
          !errorType &&
          reviews.length === 0 && (
            <div className={styles.fullSpan}>
              <ErrorView
                errType="default"
                errorText="Couldn't find any listed reviews here"
                onRetry={fetchReviews}
              />
            </div>
          )}

        {!reviewsUnderMaintenance &&
          !loading &&
          !errorType &&
          reviews.length > 0 && (
            <div className={styles.reviewsList}>
              {reviews.map((review, index) => (
                <ReviewBentoBox
                  key={review._id || index}
                  profileImg={review.profileImg}
                  name={review.name}
                  position={review.position}
                  company={review.company}
                  testimony={review.testimony}
                  isActive={review.isActive}
                  order={review.order}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
