import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Award, Calendar, Building2 } from "lucide-react";
import { usePortfolioData } from "../context/PortfolioDataContext";
import Button from "../components/Button";
import DecorativeCurves from "../components/DecorativeCurves";

export default function CertificateDetailPage() {
  const { slug } = useParams();
  const { certifications } = usePortfolioData();
  const certificate = certifications.find(
    (c) => c.slug === slug || c.id === slug
  );

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Certificate Not Found
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-20 relative">
      <DecorativeCurves variant="corner" className="top-20 right-0 opacity-40" />

      <div className="max-w-[900px] mx-auto px-6">
        {/* Back Link */}
        <Link
          to="/#certifications"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Certifications
        </Link>

        {/* Certificate Preview */}
        <div className="w-full min-h-64 md:min-h-80 max-h-[520px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-slate-800 mb-8 border border-gray-200 dark:border-slate-700 flex items-center justify-center p-4">
          <img
            src={certificate.image}
            alt={certificate.title}
            className="max-w-full max-h-[480px] w-auto h-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                  <div class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                  </div>
                </div>
              `;
            }}
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          {certificate.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Building2 size={18} className="text-blue-600" />
            <span className="text-sm font-medium">{certificate.organization}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar size={18} className="text-blue-600" />
            <span className="text-sm font-medium">{certificate.date}</span>
          </div>
          {certificate.credentialId && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Award size={18} className="text-blue-600" />
              <span className="text-sm font-medium">
                ID: {certificate.credentialId}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {certificate.fullDescription}
            </p>
          </div>

          {/* Skills Covered */}
          {certificate.skillsCovered && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Skills & Topics Covered
              </h2>
              <div className="flex flex-wrap gap-2">
                {certificate.skillsCovered.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verification */}
          {certificate.verificationUrl && (
            <div className="pt-4">
              <Button
                href={certificate.verificationUrl}
                variant="primary"
                icon={ExternalLink}
              >
                Verify Certificate
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
