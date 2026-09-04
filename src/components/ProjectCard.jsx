import { useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  if (!project) return null;

  const title = project.title || "Project";
  const shortDescription = project.shortDescription || "";
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const features = Array.isArray(project.features) ? project.features : [];
  const slug = project.slug || project.id || "";
  const image = project.image || "";

  const [imgError, setImgError] = useState(false);

  // Reset imgError if image prop changes (e.g. after upload or cloud sync)
  useEffect(() => {
    setImgError(false);
  }, [image]);

  const hasValidImage = Boolean(image && !imgError);

  return (
    <div className="group h-full bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-md shadow-slate-200/60 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1.5 flex flex-col">
      {/* Image Container */}
      <div className="p-3 pb-0">
        <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/40 relative flex items-center justify-center">
          {hasValidImage ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50/50 dark:from-slate-800/90 dark:to-slate-800/60 p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/15 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-2 shadow-inner">
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{title.charAt(0)}</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 text-center">{title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed font-normal">
          {shortDescription}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/40 rounded-full border border-blue-200/80 dark:border-blue-800/40"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 4 && (
            <span className="px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-slate-700/60 rounded-full border border-slate-200 dark:border-slate-600/40">
              +{technologies.length - 4}
            </span>
          )}
        </div>

        {/* Features Preview */}
        <div className="mb-5 space-y-1.5 flex-1">
          {features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                <Check size={11} strokeWidth={3} />
              </span>
              <span className="text-xs text-slate-600 dark:text-gray-300 leading-tight font-medium">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Button */}
        <Link
          to={`/projects/${slug}`}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          View Details
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
