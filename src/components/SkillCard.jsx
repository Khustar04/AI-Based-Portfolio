import { resolveSkillIcon } from "../utils/iconMap";

export default function SkillCard({ skill }) {
  if (!skill) return null;
  const IconComponent = resolveSkillIcon(skill);

  return (
    <div className="group h-full bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/60 rounded-2xl p-6 transition-all duration-300 shadow-md shadow-slate-200/60 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/15 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1.5 flex flex-col">
      {/* Icon with Frosted Background */}
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 shadow-xs">
        {typeof IconComponent === "function" || (typeof IconComponent === "object" && IconComponent !== null && IconComponent.$$typeof) ? (
          <IconComponent size={24} className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
        ) : (
          <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">#</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
        {skill.title}
      </h3>

      {/* Skill Pills */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {(skill.items || []).map((item) => (
          <span
            key={item}
            className="px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-950/40 rounded-full border border-blue-200/70 dark:border-blue-800/40 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-100/80 transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
