import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <BrowserRouter>
          <ScrollToTop />
          <div className="relative min-h-screen bg-slate-50/80 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
            {/* GPU-Accelerated Background Luminous Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 gpu-layer">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-sky-300/15 dark:from-blue-600/10 dark:to-cyan-400/10 rounded-full blur-[80px] transform-gpu" />
              <div className="absolute top-[35%] -left-40 w-[420px] h-[420px] bg-gradient-to-tr from-indigo-400/15 to-blue-300/10 dark:from-indigo-600/10 dark:to-blue-500/10 rounded-full blur-[90px] transform-gpu" />
              <div className="absolute bottom-20 -right-32 w-[450px] h-[450px] bg-gradient-to-tl from-sky-400/15 to-blue-500/10 dark:from-blue-700/10 dark:to-indigo-600/10 rounded-full blur-[90px] transform-gpu" />
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
      </PortfolioDataProvider>
    </ThemeProvider>
  );
}
