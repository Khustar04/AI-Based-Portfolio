import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "./context/ThemeContext";
import { PortfolioDataProvider } from "./context/PortfolioDataContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";

// Code-split secondary routes for instantaneous initial loading
const ResumePage = lazy(() => import("./pages/ResumePage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const CertificateDetailPage = lazy(() => import("./pages/CertificateDetailPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageLoadingFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioDataProvider>
        <ReactLenis
          root
          options={{
            lerp: 0.09,
            duration: 1.1,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
          }}
        >
          <MotionConfig reducedMotion="user">
            <BrowserRouter>
              <ScrollToTop />
              <div className="relative min-h-screen bg-slate-50/80 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
                {/* Hardware-Accelerated Lightweight Background Ambient Glows */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 gpu-layer">
                  <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full ambient-glow-1" />
                  <div className="absolute top-[35%] -left-40 w-[420px] h-[420px] rounded-full ambient-glow-2" />
                  <div className="absolute bottom-20 -right-32 w-[450px] h-[450px] rounded-full ambient-glow-3" />
                </div>

                <Navbar />
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/resume" element={<ResumePage />} />
                    <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                    <Route
                      path="/certifications/:slug"
                      element={<CertificateDetailPage />}
                    />
                    <Route path="/manage-portfolio" element={<AdminPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
                <Footer />
                <AIAssistant />
              </div>
            </BrowserRouter>
          </MotionConfig>
        </ReactLenis>
      </PortfolioDataProvider>
    </ThemeProvider>
  );
}
