import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import App from "./App.jsx";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>,
);

const loader = document.getElementById("initialLoader");

if (loader) {
  loader.style.transition = "opacity 0.1s ease";
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.remove();
  }, 1000);
}
