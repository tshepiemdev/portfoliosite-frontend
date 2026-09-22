import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./components/Layout.jsx", [
    index("./pages/Home.jsx"),

    route("contact", "./pages/Contact.jsx", {
      id: "contact",
    }),

    route("service-request", "./pages/ServiceRequest.jsx", {
      id: "service-request",
    }),

    route("get-in-touch", "./pages/Contact.jsx", {
      id: "get-in-touch",
    }),

    route("hire-me", "./pages/Hire-me.jsx", {
      id: "hire-me",
    }),

    route("services", "./pages/Services.jsx", {
      id: "services",
    }),

    route("services/:slug", "./pages/ServicePage.jsx", {
      id: "service-page",
    }),

    route("projects", "./pages/Projects.jsx", {
      id: "projects",
    }),

    route("projects/:slug", "./pages/ProjectPage.jsx", {
      id: "project-page",
    }),

    route("legal", "./pages/Legal.jsx", {
      id: "legal",
    }),

    route("legal/:slug", "./pages/LegalPage.jsx", {
      id: "legal-page",
    }),

    route("blog", "./pages/Blogs.jsx", {
      id: "blogs",
    }),

    route("blog/:slug", "./pages/BlogPage.jsx", {
      id: "blog-page",
    }),

    route("help-center", "./pages/HelpCenter.jsx", {
      id: "help-center",
    }),

    route("cv", "./pages/CvPage.jsx", {
      id: "cv",
    }),

    route("resume", "./pages/CvPage.jsx", {
      id: "resume",
    }),

    route("pricing", "./pages/Pricing.jsx", {
      id: "pricing",
    }),

    route("subscribe/verify/:token", "./pages/SubscribeVerify.jsx", {
      id: "subscribe-verify",
    }),

    route("subscribe/unsubscribe/:token", "./pages/SubscribeVerify.jsx", {
      id: "subscribe-unsubscribe",
    }),

    route("not-found", "./pages/NotFound.jsx", {
      id: "not-found",
    }),

    route("*", "./pages/NotFound.jsx", {
      id: "catch-all",
    }),
  ]),
] satisfies RouteConfig;
