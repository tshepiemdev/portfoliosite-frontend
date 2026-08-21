import { useEffect, useRef, useState } from "react";

export default function LazySection({
  children,
  minHeight = "300px",
  rootMargin = "700px 0px",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={ref}
      style={{
        minHeight: isVisible ? undefined : minHeight,
        width: "100%",
      }}
    >
      {isVisible ? children : null}
    </div>
  );
}
