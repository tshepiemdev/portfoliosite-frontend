import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const SCROLL_STORAGE_KEY = "scroll-positions";

const getScrollPositions = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveScrollPosition = (key) => {
  if (!key) return;

  try {
    const positions = getScrollPositions();

    positions[key] = {
      x: window.scrollX,
      y: window.scrollY,
    };

    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
  } catch {
    return;
  }
};

const getSavedScrollPosition = (key) => {
  if (!key) return null;

  try {
    const positions = getScrollPositions();
    return positions[key] || null;
  } catch {
    return null;
  }
};

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    let frameId = null;

    const handleScroll = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        saveScrollPosition(location.key);
        frameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      saveScrollPosition(location.key);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    if (navigationType === "POP") {
      const savedPosition = getSavedScrollPosition(location.key);

      if (savedPosition) {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: "auto",
        });
      } else {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: "auto",
        });
      }

      return;
    }

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "auto",
    });
  }, [location.key, navigationType]);

  return null;
}
