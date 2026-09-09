import Layout, {
  loader as layoutLoader,
  shouldRevalidate as layoutShouldRevalidate,
} from "./components/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import HireMe from "./pages/Hire-me";
import Services, { loader as servicesLoader } from "./pages/Services";
import ServicePage, { loader as servicePageLoader } from "./pages/ServicePage";
import Projects from "./pages/Projects";
import ProjectPage, { loader as projectPageLoader } from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";
import Legal, { loader as legalLoader } from "./pages/Legal";
import LegalPage, { loader as legalPageLoader } from "./pages/LegalPage";
import HelpCenter, { loader as helpCenterLoader } from "./pages/HelpCenter";
import Blogs, { loader as blogsLoader } from "./pages/Blogs";
import BlogPage, { loader as blogPageLoader } from "./pages/BlogPage";
import CvPage, { loader as cvLoader } from "./pages/CvPage";
import Pricing, { loader as pricingLoader } from "./pages/Pricing";
import ServiceRequest, {
  loader as serviceRequestLoader,
} from "./pages/ServiceRequest";
import SubscribeVerify from "./pages/SubscribeVerify";

export const routes = [
  {
    element: <Layout />,
    loader: layoutLoader,
    shouldRevalidate: layoutShouldRevalidate,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/service-request",
        element: <ServiceRequest />,
        loader: serviceRequestLoader,
      },
      {
        path: "/get-in-touch",
        element: <Contact />,
      },
      {
        path: "/hire-me",
        element: <HireMe />,
      },
      {
        path: "/services",
        element: <Services />,
        loader: servicesLoader,
      },
      {
        path: "/services/:slug",
        element: <ServicePage />,
        loader: servicePageLoader,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/:slug",
        element: <ProjectPage />,
        loader: projectPageLoader,
      },
      {
        path: "/legal",
        element: <Legal />,
        loader: legalLoader,
      },
      {
        path: "/legal/:slug",
        element: <LegalPage />,
        loader: legalPageLoader,
      },
      {
        path: "/blog",
        element: <Blogs />,
        loader: blogsLoader,
      },
      {
        path: "/blog/:slug",
        element: <BlogPage />,
        loader: blogPageLoader,
      },
      {
        path: "/help-center",
        element: <HelpCenter />,
        loader: helpCenterLoader,
      },
      {
        path: "/cv",
        element: <CvPage />,
        loader: cvLoader,
      },
      {
        path: "/resume",
        element: <CvPage />,
        loader: cvLoader,
      },
      {
        path: "/pricing",
        element: <Pricing />,
        loader: pricingLoader,
      },
      {
        path: "/subscribe/verify/:token",
        element: <SubscribeVerify />,
      },
      {
        path: "/subscribe/unsubscribe/:token",
        element: <SubscribeVerify />,
      },
      {
        path: "/not-found",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
