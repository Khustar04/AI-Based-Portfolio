import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { PortfolioDataProvider } from "./context/PortfolioDataContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import ResumePage from "./pages/ResumePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CertificateDetailPage from "./pages/CertificateDetailPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioDataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="relative min-h-screen bg-slate-50/80 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
            {/* Ambient Glassmorphism Luminous Glow Orbs in Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
              {/* Top Right Orb */}
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/25 to-sky-300/20 dark:from-blue-600/15 dark:to-cyan-400/10 rounded-full blur-[100px]" />
              {/* Middle Left Orb */}
              <div className="absolute top-[35%] -left-40 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-400/20 to-blue-300/15 dark:from-indigo-600/10 dark:to-blue-500/10 rounded-full blur-[120px]" />
              {/* Bottom Right Orb */}
              <div className="absolute bottom-20 -right-32 w-[500px] h-[500px] bg-gradient-to-tl from-sky-400/20 to-blue-500/15 dark:from-blue-700/15 dark:to-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <Navbar />
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
            <Footer />
            <AIAssistant />
          </div>
        </BrowserRouter>
      </PortfolioDataProvider>
    </ThemeProvider>
  );
}
