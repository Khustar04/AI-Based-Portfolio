import { Link } from "react-router-dom";
import { Mail, MapPin, Heart, Globe } from "lucide-react";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { GithubIcon, LinkedinIcon } from "./icons";
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
              className="text-2xl font-extrabold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2 mb-3"
            >
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sm font-bold">
                {personalInfo.initials}
              </span>
              <span>{personalInfo.name}</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {personalInfo.shortBio}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { name: "Home", path: "/" },
                { name: "Projects", path: "/#projects" },
                { name: "Resume", path: "/resume" },
                { name: "Contact", path: "/#contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Get In Touch
            </h4>
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                <Mail size={14} />
                {personalInfo.email}
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} />
                {personalInfo.location}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((link) => {
                let IconComponent = Globe;
                if (typeof link.icon === "function" || typeof link.icon === "object") {
                  IconComponent = link.icon;
                } else if (link.platform?.toLowerCase().includes("github") || link.name?.toLowerCase().includes("github")) {
                  IconComponent = GithubIcon;
                } else if (link.platform?.toLowerCase().includes("linkedin") || link.name?.toLowerCase().includes("linkedin")) {
                  IconComponent = LinkedinIcon;
                } else if (link.platform?.toLowerCase().includes("mail") || link.url?.includes("mailto:")) {
                  IconComponent = Mail;
                }

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
