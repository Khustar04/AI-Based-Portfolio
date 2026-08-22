import { useEffect, useRef } from "react";
import { Download, ArrowRight, Code2, Sparkles } from "lucide-react";
import Button from "./Button";
import DecorativeCurves from "./DecorativeCurves";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { gsap } from "../utils/gsapAnimations";

export default function HeroSection() {
  const { personalInfo } = usePortfolioData();
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-photo", {
        opacity: 0,
        x: -40,
        duration: 0.9,
      })
        .from(
          ".hero-badge",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          "-=0.6"
        )
        .from(
          ".hero-name",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ".hero-roles",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          "-=0.4"
        )
        .from(
          ".hero-bio",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          "-=0.4"
        )
        .from(
          ".hero-btn",
          {
            opacity: 0,
            y: 15,
            stagger: 0.1,
            duration: 0.5,
          },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

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
      ref={heroRef}
      className="relative min-h-[88vh] flex items-center pt-28 pb-16 md:py-32 overflow-hidden transition-colors duration-300"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/15 dark:bg-blue-600/15 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-sky-300/20 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

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
            <div className="hero-photo relative group">
              {/* Diffused colorful aura */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600/20 via-sky-400/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Glass Frame Container */}
              <div className="w-72 h-80 md:w-84 md:h-[430px] rounded-3xl p-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-2xl shadow-blue-500/10 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-slate-800/80 dark:to-slate-900/80 border border-white/40 dark:border-slate-700/40">
                  <img
                    src={photo}
                    alt={name}
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
            </div>
          </div>

          {/* Right — Introduction */}
          <div className="flex flex-col items-start">
            {/* Glass Status Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/80 dark:border-slate-700/60 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase shadow-sm mb-4">
              <Sparkles size={13} className="text-blue-500 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Hello, I'm</span>
            </div>

            <h1 className="hero-name text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-[1.15]">
              <span className="relative inline-block">
                <span className="relative z-10">{name}</span>
                <span className="absolute bottom-1.5 left-0 w-full h-3 md:h-4 bg-blue-200/60 dark:bg-blue-900/60 -z-0 rounded-sm" />
              </span>
            </h1>

            {/* Glass Role Badges */}
            <div className="hero-roles flex flex-wrap gap-2 mb-5">
              {titles.map((title, index) => (
                <span
                  key={index}
                  className="px-3.5 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-xl text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 shadow-sm"
                >
                  {title}
                </span>
              ))}
            </div>

            <p className="hero-bio text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              {bio}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="hero-btn">
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
              <div className="hero-btn">
                <Button
                  onClick={() => {
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  View Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
