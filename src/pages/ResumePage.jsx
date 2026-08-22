import { Download, Mail, Phone, MapPin, Award, ExternalLink } from "lucide-react";
import Button from "../components/Button";
import DecorativeCurves from "../components/DecorativeCurves";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { GithubIcon, LinkedinIcon } from "../components/icons";

export default function ResumePage() {
  const { personalInfo, skills, projects, certifications, education } = usePortfolioData();

  const name = personalInfo?.name || "Khustar Hussain";
  const titles = Array.isArray(personalInfo?.titles)
    ? personalInfo.titles
    : personalInfo?.titles
    ? [personalInfo.titles]
    : ["Java Developer", "Backend Developer"];
  const location = personalInfo?.location || "";
  const phone = personalInfo?.phone || "";
  const email = personalInfo?.email || "";
  const github = personalInfo?.github || "https://github.com/khustar04";
  const linkedin = personalInfo?.linkedin || "https://www.linkedin.com/in/khustarhussain04/";
  const resumeUrl = personalInfo?.resumeUrl || "/Khustar_Hussain_Resume.pdf";
  const bio = personalInfo?.bio || "";

  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeCerts = Array.isArray(certifications) ? certifications : [];
  const safeEdu = Array.isArray(education) ? education : [];

  return (
    <main className="pt-28 pb-24 relative overflow-hidden transition-colors duration-300">
      <DecorativeCurves variant="corner" className="top-20 right-0 opacity-40" />

      <div className="max-w-[920px] mx-auto px-6 relative z-10">
        {/* Resume Header Card */}
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/80 dark:border-slate-700/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-500/5 mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            {name}
          </h1>
          <p className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-6">
            {titles.join(" | ")}
          </p>

          {/* Contact Details Pill Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs md:text-sm text-gray-700 dark:text-gray-300">
            {location && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-slate-700">
                <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                <span>{location}</span>
              </span>
            )}

            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <Phone size={14} className="text-blue-600 dark:text-blue-400" />
                <span>{phone}</span>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                <span>{email}</span>
              </a>
            )}

            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <GithubIcon size={14} className="text-blue-600 dark:text-blue-400" />
                <span>GitHub</span>
              </a>
            )}

            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <LinkedinIcon size={14} className="text-blue-600 dark:text-blue-400" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              href={resumeUrl}
              download="Khustar_Hussain_Resume.pdf"
              variant="primary"
              size="lg"
              icon={Download}
            >
              Download Resume
            </Button>
          </div>
        </div>

        {/* Professional Summary */}
        {bio && (
          <section className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 pb-2 border-b border-gray-200/80 dark:border-slate-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              SUMMARY
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
              {bio}
            </p>
          </section>
        )}

        {/* Technical Skills */}
        {safeSkills.length > 0 && (
          <section className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2 pb-2 border-b border-gray-200/80 dark:border-slate-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              SKILLS
            </h2>
            <div className="space-y-4">
              {safeSkills.map((category) => (
                <div key={category.id} className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                  <span className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 sm:min-w-[170px]">
                    {category.title}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(category.items || []).map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-slate-700/60 shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {safeProjects.length > 0 && (
          <section className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-200/80 dark:border-slate-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              PROJECTS
            </h2>
            <div className="space-y-6">
              {safeProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/80 dark:bg-slate-900/60 border border-gray-200/90 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      {project.duration && (
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                          {project.duration}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md"
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:underline bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                        >
                          <span>GitHub</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.technologies || []).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/50 rounded-full border border-blue-100 dark:border-blue-800/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    {(project.features || []).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-none mt-0.5">•</span>
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {safeCerts.length > 0 && (
          <section className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2 pb-2 border-b border-gray-200/80 dark:border-slate-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              CERTIFICATIONS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-start gap-3.5 bg-white/80 dark:bg-slate-900/60 border border-gray-200/90 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center shrink-0">
                    <Award size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {cert.organization} — {cert.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {safeEdu.length > 0 && (
          <section className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-lg mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2 pb-2 border-b border-gray-200/80 dark:border-slate-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              EDUCATION
            </h2>
            <div className="space-y-4">
              {safeEdu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 dark:bg-slate-900/60 border border-gray-200/90 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between gap-2"
                >
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {item.institution}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                      {item.degree} {item.field ? `| ${item.field}` : ""}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.location}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-xs rounded-full border border-blue-100 dark:border-blue-800/50">
                      {item.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Download Full Resume Bottom Action */}
        <div className="text-center">
          <Button
            href={resumeUrl}
            download="Khustar_Hussain_Resume.pdf"
            variant="primary"
            size="lg"
            icon={Download}
          >
            Download Resume
          </Button>
        </div>
      </div>
    </main>
  );
}
