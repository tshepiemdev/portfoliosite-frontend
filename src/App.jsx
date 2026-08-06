import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ToastContext";
import Layout from "./components/Layout";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import HireMe from "./pages/Hire-me";
import Services from "./pages/Services";
import ServicePage from "./pages/ServicePage";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import LegalPage from "./pages/LegalPage";
import HelpCenter from "./pages/HelpCenter";
import Blogs from "./pages/Blogs";
import BlogPage from "./pages/BlogPage";
import CvPage from "./pages/CvPage";
import Pricing from "./pages/Pricing";
import ServiceRequest from "./pages/ServiceRequest";
import SubscribeVerify from "./pages/SubscribeVerify";

export default function App() {
  return (
    <ToastProvider>
      <AnalyticsTracker />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service-request" element={<ServiceRequest />} />
          <Route path="/get-in-touch" element={<Contact />} />
          <Route path="/hire-me" element={<HireMe />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/cv" element={<CvPage />} />
          <Route path="/resume" element={<CvPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/subscribe/verify/:token"
            element={<SubscribeVerify />}
          />
          <Route
            path="/subscribe/unsubscribe/:token"
            element={<SubscribeVerify />}
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
