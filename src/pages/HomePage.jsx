import { useEffect, useRef, useState } from "react";
import HeroSection from "../components/HeroSection";
import SkillCard from "../components/SkillCard";
import ProjectCard from "../components/ProjectCard";
import CertificateCard from "../components/CertificateCard";
import EducationCard from "../components/EducationCard";
import ContactForm from "../components/ContactForm";
import SectionHeading from "../components/SectionHeading";
import DecorativeCurves from "../components/DecorativeCurves";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { Mail, MapPin, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/icons";
import { gsap, ScrollTrigger } from "../utils/gsapAnimations";

export default function HomePage() {
  const { skills, projects, certifications, education, personalInfo, socialLinks } =
    usePortfolioData();
  const [showAllProjects, setShowAllProjects] = useState(false);

  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const certsRef = useRef(null);
  const educationRef = useRef(null);
  const contactRef = useRef(null);

  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeCerts = Array.isArray(certifications) ? certifications : [];
  const safeEdu = Array.isArray(education) ? education : [];

  const visibleProjects =
    showAllProjects || safeProjects.length <= 4
      ? safeProjects
      : safeProjects.slice(0, 4);

  const emailVal = personalInfo?.email || "";
  const locVal = personalInfo?.location || "";
  const ghVal = personalInfo?.github || "https://github.com/khustar04";
  const liVal = personalInfo?.linkedin || "https://www.linkedin.com/in/khustarhussain04/";

  const contactItems = [
    {
      id: "email",
      label: "Email",
      value: emailVal,
      href: emailVal ? `mailto:${emailVal}` : null,
      icon: Mail,
      isExternal: false,
    },
    {
      id: "location",
      label: "Location",
      value: locVal,
      href: null,
      icon: MapPin,
      isExternal: false,
    },
    {
      id: "github",
      label: "GitHub",
      value: "khustar04",
      href: ghVal,
      icon: GithubIcon,
      isExternal: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "khustarhussain04",
      href: liVal,
      icon: LinkedinIcon,
      isExternal: true,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      // Skills Stagger
      if (skillsRef.current) {
        gsap.from(".skill-card-item", {
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 85%",
            once: true,
          },
          y: 35,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Projects Stagger
      if (projectsRef.current) {
        gsap.from(".project-card-item", {
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 85%",
            once: true,
          },
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
        });
      }

      // Certifications Stagger
      if (certsRef.current) {
        gsap.from(".cert-card-item", {
          scrollTrigger: {
            trigger: certsRef.current,
            start: "top 85%",
            once: true,
          },
          y: 35,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Education Stagger
      if (educationRef.current) {
        gsap.from(".education-item", {
          scrollTrigger: {
            trigger: educationRef.current,
            start: "top 85%",
            once: true,
          },
          x: -25,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
        });
      }

      // Centered Contact Card Animation
      if (contactRef.current) {
        gsap.from(".contact-form-card-container", {
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            once: true,
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    });

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);
    return () => clearTimeout(timer);
  }, [showAllProjects]);

  return (
    <main className="transition-colors duration-300">
      {/* Hero */}
      <HeroSection />

      {/* Skills Section with Glass Ambient Styling */}
      <section
        id="skills"
        ref={skillsRef}
        className="relative py-20 md:py-28 bg-slate-100/60 dark:bg-slate-900/40 backdrop-blur-sm border-y border-slate-200/80 dark:border-slate-800/60 transition-colors duration-300 overflow-hidden"
      >
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <DecorativeCurves variant="section" className="top-0 left-0 w-full opacity-50" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <SectionHeading
            title="My Skills"
            subtitle="Technologies and tools I work with to build robust, scalable applications"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeSkills.map((skill) => (
              <div key={skill.id} className="skill-card-item h-full">
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        ref={projectsRef}
        className="relative py-20 md:py-28 transition-colors duration-300 overflow-hidden"
      >
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-400/10 dark:bg-sky-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <SectionHeading
            title="Featured Projects"
            subtitle="Production-grade full-stack applications & backend architecture systems"
          />

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {visibleProjects.map((project) => (
              <div key={project.id} className="project-card-item h-full">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* See More Projects Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {safeProjects.length > 4 && (
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700/80 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-lg shadow-blue-500/5 cursor-pointer hover:scale-102"
              >
                <span>{showAllProjects ? "Show Less" : `See More Projects (${safeProjects.length - 4} more)`}</span>
                {showAllProjects ? (
                  <ChevronUp size={18} className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <ChevronDown size={18} className="text-blue-600 dark:text-blue-400" />
                )}
              </button>
            )}

            <a
              href={ghVal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <GithubIcon size={16} />
              <span>View all repositories on GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section
        id="certifications"
        ref={certsRef}
        className="relative py-20 md:py-28 bg-slate-100/60 dark:bg-slate-900/40 backdrop-blur-sm border-y border-slate-200/80 dark:border-slate-800/60 transition-colors duration-300 overflow-hidden"
      >
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <DecorativeCurves variant="section" className="top-0 left-0 w-full opacity-50" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <SectionHeading
            title="Certifications"
            subtitle="Verified technical credentials and industry assessments"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeCerts.map((cert) => (
              <div key={cert.id} className="cert-card-item h-full">
                <CertificateCard certificate={cert} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section
        id="education"
        ref={educationRef}
        className="relative py-20 md:py-28 transition-colors duration-300"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeading
            title="Education"
            subtitle="My academic background and computer science qualifications"
          />
          <div className="max-w-2xl mx-auto">
            {safeEdu.map((item, index) => (
              <div key={item.id} className="education-item">
                <EducationCard
                  item={item}
                  isLast={index === safeEdu.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centered Contact Section with Perfectly Symmetrical Badges */}
      <section
        id="contact"
        ref={contactRef}
        className="relative py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-sm border-t border-gray-200/80 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-500/15 to-indigo-500/10 dark:from-blue-600/15 dark:to-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <DecorativeCurves variant="section" className="top-0 left-0 w-full opacity-50" />
        <div className="max-w-[840px] mx-auto px-6 relative z-10">
          <SectionHeading
            title="Get In Touch"
            subtitle="Have a project idea, question, or opportunity? Send me a message below!"
          />

          {/* Symmetrical 2x2 / 4-Col Grid of Contact Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="w-full h-12 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-3 shadow-xs hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 leading-none mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="block hover:-translate-y-0.5 transition-transform"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={item.id}>
                  {content}
                </div>
              );
            })}
          </div>

          {/* Centered Contact Form Container */}
          <div className="contact-form-card-container mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
