import { Link } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { resolveSocialIcon } from "../utils/iconMap";
import DecorativeCurves from "./DecorativeCurves";

export default function Footer() {
  const { personalInfo, socialLinks } = usePortfolioData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-2xl text-white border-t border-white/10 dark:border-slate-800/80 overflow-hidden">
      <DecorativeCurves variant="footer" className="w-full opacity-60" />

      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-xl font-extrabold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 mb-3"
            >
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sm font-bold text-white">
                {personalInfo.initials}
              </span>
              <span>{personalInfo.name}</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              {personalInfo.shortBio}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">
              Quick Links
            </p>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Resume", path: "/resume" },
                { name: "Projects", path: "/#projects" },
                { name: "Contact", path: "/#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white text-xs transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info & Socials */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">
              Connect
            </p>
            <div className="space-y-2 text-xs text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                {personalInfo.location}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((link) => {
                const IconComponent = resolveSocialIcon(link);

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-white/20 hover:border-blue-400/50 transition-all shadow-sm"
                    aria-label={link.name || link.platform}
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 dark:border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            Built with <Heart size={12} className="text-red-400 fill-red-400" /> & React
          </p>
        </div>
      </div>
    </footer>
  );
}
