import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { usePortfolioData } from "../context/PortfolioDataContext";

const navLinks = [
  { name: "Home", path: "/", type: "route" },
  { name: "Resume", path: "/resume", type: "route" },
  { name: "Projects", path: "/#projects", type: "hash" },
  { name: "Contact", path: "/#contact", type: "hash" },
];

const hamburgerLinks = [
  { name: "About", path: "/#about", type: "hash" },
  { name: "Skills", path: "/#skills", type: "hash" },
  { name: "Projects", path: "/#projects", type: "hash" },
  { name: "Certifications", path: "/#certifications", type: "hash" },
  { name: "Education", path: "/#education", type: "hash" },
  { name: "Resume", path: "/resume", type: "route" },
  { name: "Contact", path: "/#contact", type: "hash" },
];

export default function Navbar() {
  const { personalInfo } = usePortfolioData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleNavClick = (link) => {
    if (link.type === "hash") {
      const id = link.path.replace("/#", "");
      if (location.pathname === "/") {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate({ pathname: "/", hash: id });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 shadow-md shadow-blue-500/5 border-b border-white/40 dark:border-slate-800/80"
          : "bg-white/65 dark:bg-slate-900/65 border-b border-white/20 dark:border-slate-800/40"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-600/20 dark:border-blue-400/30 flex items-center justify-center text-sm font-bold">
              {personalInfo.initials}
            </span>
            <span>{personalInfo.name}</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 dark:border-slate-700/60 shadow-sm">
            {navLinks.map((link) =>
              link.type === "route" ? (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    location.pathname === link.path
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
                >
                  {link.name}
                </button>
              )
            )}
          </div>

          {/* Right Side: Theme Toggle + Hamburger */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/60 dark:border-slate-700/60 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 shadow-sm transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/60 dark:border-slate-700/60 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 shadow-sm transition-all cursor-pointer md:block"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Hamburger Menu with Frosted Glass */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-t border-white/30 dark:border-slate-800/60 px-6 py-4 shadow-xl">
          <div className="flex flex-col gap-1.5">
            {hamburgerLinks.map((link) =>
              link.type === "route" ? (
                <Link
                  key={link.name}
                  to={link.path}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/40"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-left cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-blue-900/40"
                >
                  {link.name}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
