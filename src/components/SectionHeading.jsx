import { motion } from "motion/react";

export default function SectionHeading({ title, subtitle, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`text-center mb-16 ${className}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
        {title}
      </h2>
      <div className="w-16 h-1 bg-blue-600 dark:bg-blue-500 rounded-full mx-auto mb-4" />
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
