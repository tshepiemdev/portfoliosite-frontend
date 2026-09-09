import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "./components/ToastContext";
import { routes } from "./routes.jsx";

const router = createBrowserRouter(routes, {
  hydrationData: window.__STATIC_ROUTER_HYDRATION_DATA__,
});

hydrateRoot(
  document.getElementById("root"),
  <StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </HelmetProvider>
  </StrictMode>,
);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const loader = document.getElementById("initial-loader");

    if (loader) {
      loader.classList.add("is-hidden");

      setTimeout(() => {
        loader.remove();
      }, 250);
    }
  });
});
