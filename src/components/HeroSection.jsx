import { Download, ArrowRight, Code2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import Button from "./Button";
import DecorativeCurves from "./DecorativeCurves";
import { usePortfolioData } from "../context/PortfolioDataContext";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroSection() {
  const { personalInfo } = usePortfolioData();
  const lenis = useLenis();

  const name = personalInfo?.name || "Khustar Hussain";
  const initials = personalInfo?.initials || name.charAt(0) || "KH";
  const titles = Array.isArray(personalInfo?.titles)
    ? personalInfo.titles
    : personalInfo?.titles
    ? [personalInfo.titles]
    : ["Java Developer", "Backend Developer"];
  const bio = personalInfo?.bio || "";
  const photo = personalInfo?.profilePhoto || "/portfolio image.jpeg";

  return (
    <section
      id="about"
      className="relative min-h-[88vh] flex items-center pt-28 pb-16 md:py-32 overflow-hidden transition-colors duration-300"
    >
      {/* Zero-cost ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full ambient-glow-1" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full ambient-glow-3" />

      {/* Decorative Curves */}
      <div className="absolute inset-0 pointer-events-none">
        <DecorativeCurves variant="hero" className="inset-0 opacity-60" />
        <DecorativeCurves variant="corner" className="top-20 right-0 opacity-40 dark:opacity-20" />
        <DecorativeCurves variant="corner" className="bottom-0 left-0 rotate-180 opacity-30 dark:opacity-15" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — Photo with Glassmorphism Card Effect */}
          <div className="flex justify-center md:justify-start">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="hero-photo relative group"
            >
              {/* Diffused colorful aura */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600/20 via-sky-400/20 to-indigo-500/20 rounded-3xl blur-lg opacity-70 group-hover:opacity-95 transition-opacity" />

              {/* Glass Frame Container */}
              <div className="w-72 h-80 md:w-84 md:h-[430px] rounded-3xl p-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700/60 shadow-2xl shadow-blue-500/10 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-slate-800/80 dark:to-slate-900/80 border border-white/40 dark:border-slate-700/40">
                  <picture>
                    <source srcSet="/portfolio-image.webp" type="image/webp" />
                    <img
                      src={photo}
                      alt={name}
                      width="336"
                      height="430"
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-slate-800/80 dark:to-slate-900/80 p-6 text-center">
                            <div class="w-24 h-24 rounded-2xl bg-blue-600/15 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4 shadow-inner">
                              <span class="text-4xl font-extrabold text-blue-600 dark:text-blue-400">${initials}</span>
                            </div>
                            <span class="text-lg font-bold text-gray-900 dark:text-white">${name}</span>
                            <span class="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">${titles[0] || ""}</span>
                          </div>
                        `;
                      }}
                    />
                  </picture>
                </div>

                {/* Floating Glass Pill Badge on photo */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/75 dark:bg-slate-900/80 backdrop-blur-md border border-white/80 dark:border-slate-700/70 py-2 px-3.5 rounded-2xl shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">Open to opportunities</span>
                  </div>
                  <Code2 size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Introduction */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start"
          >
            {/* Glass Status Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/80 dark:border-slate-700/60 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase shadow-sm mb-4"
            >
              <Sparkles size={13} className="text-blue-500 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Hello, I'm</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-[1.15]"
            >
              <span className="relative inline-block">
                <span className="relative z-10">{name}</span>
                <span className="absolute bottom-1.5 left-0 w-full h-3 md:h-4 bg-blue-200/60 dark:bg-blue-900/60 -z-0 rounded-sm" />
              </span>
            </motion.h1>

            {/* Glass Role Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-5">
              {titles.map((title, index) => (
                <span
                  key={index}
                  className="px-3.5 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-xl text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 shadow-sm"
                >
                  {title}
                </span>
              ))}
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg"
            >
              {bio}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <div>
                <Button
                  href={personalInfo.resumeUrl}
                  download="Khustar_Hussain_Resume.pdf"
                  variant="primary"
                  size="lg"
                  icon={Download}
                >
                  Download Resume
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    const el = document.getElementById("projects");
                    if (el) {
                      if (lenis) {
                        lenis.scrollTo(el, { offset: -80 });
                      } else {
                        el.scrollIntoView();
                      }
                    }
                  }}
                  variant="outline"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  View Projects
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
