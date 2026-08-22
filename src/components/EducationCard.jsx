import { GraduationCap, Calendar } from "lucide-react";

export default function EducationCard({ item, isLast }) {
  return (
    <div className="relative flex gap-6">
      {/* Timeline Node with Glow */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-500/30 border border-white/40 dark:border-blue-400/40 flex items-center justify-center shrink-0 z-10">
          <GraduationCap size={20} className="text-white" />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-300 via-blue-200 to-slate-200 dark:from-blue-600 dark:via-slate-700 dark:to-slate-800 my-2" />
        )}
      </div>

      {/* Glass Card */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/60 rounded-2xl p-6 flex-1 mb-8 border-l-4 border-l-blue-600 dark:border-l-blue-500 shadow-md shadow-slate-200/60 dark:shadow-none hover:shadow-xl transition-all">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {item.degree}
          </h3>
          <span
            className={`px-3 py-0.5 text-xs font-semibold rounded-full backdrop-blur-md ${
              item.status === "Completed"
                ? "bg-green-50/90 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800/40"
                : "bg-blue-50/90 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40"
            }`}
          >
            {item.status}
          </span>
        </div>

        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
          {item.field}
        </p>
        <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">
          {item.institution}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-500 mb-3">
          <Calendar size={13} />
          <span>{item.duration}</span>
        </div>

        {item.description && (
          <p className="text-sm text-slate-600 dark:text-gray-300 mb-3 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Subject Tags */}
        {item.subjects && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.subjects.map((subject) => (
              <span
                key={subject}
                className="px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/40 rounded-full border border-blue-200/70 dark:border-blue-800/40"
              >
                {subject}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
