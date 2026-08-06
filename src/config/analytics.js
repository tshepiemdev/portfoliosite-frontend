import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (!GA_ID) return;

  ReactGA.initialize(GA_ID);
};

export const trackPageView = (path) => {
  if (!GA_ID) return;

  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};
