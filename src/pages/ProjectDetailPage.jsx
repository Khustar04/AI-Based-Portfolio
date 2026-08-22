import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "../components/icons";
import { usePortfolioData } from "../context/PortfolioDataContext";
import Button from "../components/Button";
import DecorativeCurves from "../components/DecorativeCurves";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { projects } = usePortfolioData();
  const project = projects.find((p) => p.slug === slug || p.id === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Project Not Found
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
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Project Image */}
        <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-slate-800 mb-8 border border-gray-200 dark:border-slate-700">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                  <span class="text-6xl font-bold text-blue-600/20">${project.title.charAt(0)}</span>
                </div>
              `;
            }}
          />
        </div>

        {/* Title & Tech Tags */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          {project.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {project.duration && (
            <span className="px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              📅 {project.duration}
            </span>
          )}
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Problem Statement
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Solution
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-blue-600 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Implementation */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Technical Implementation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {project.technicalImplementation}
            </p>
          </div>

          {/* Challenges & Learnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Challenges
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.challenges}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Key Learnings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.keyLearnings}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {project.githubUrl && (
              <Button href={project.githubUrl} variant="primary" icon={GithubIcon}>
                GitHub Repository
              </Button>
            )}
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                variant="outline"
                icon={ExternalLink}
              >
                Live Demo
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
