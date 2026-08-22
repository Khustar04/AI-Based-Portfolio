import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function CertificateCard({ certificate }) {
  return (
    <div className="group h-full bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/60 rounded-2xl p-6 transition-all duration-300 shadow-md shadow-slate-200/60 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1.5 flex flex-col">
      {/* Badge Area */}
      <div className="w-full h-36 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/50 flex items-center justify-center mb-5 overflow-hidden p-1 shadow-inner">
        <img
          src={certificate.image}
          alt={certificate.title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <div class="w-16 h-16 rounded-2xl bg-blue-600/15 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-inner">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"></path>
                </svg>
              </div>
            `;
          }}
        />
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
        {certificate.title}
      </h3>
      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
        {certificate.organization}
      </p>
      <p className="text-xs text-slate-500 dark:text-gray-400 mb-5">
        Issued: {certificate.date}
      </p>

      <div className="mt-auto">
        <Link
          to={`/certifications/${certificate.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-slate-800/80 dark:border-blue-500/80 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white border-2 border-blue-600/80 text-sm font-semibold rounded-xl transition-all duration-300 shadow-xs"
        >
          View Certificate
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
