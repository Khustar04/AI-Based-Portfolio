import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsapAnimations";

export default function SectionHeading({ title, subtitle, className = "" }) {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 88%",
          once: true,
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={headingRef}
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
    </div>
  );
}
