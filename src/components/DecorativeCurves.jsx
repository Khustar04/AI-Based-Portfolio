export default function DecorativeCurves({ variant = "hero", className = "" }) {
  const variants = {
    hero: (
      <svg
        className={`absolute pointer-events-none ${className}`}
        width="100%"
        height="100%"
        viewBox="0 0 1200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Top-right flowing curve */}
        <path
          d="M900 0 C950 80, 1100 120, 1200 100"
          stroke="rgba(37, 99, 235, 0.08)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M850 0 C920 100, 1080 150, 1200 120"
          stroke="rgba(14, 165, 233, 0.06)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Bottom-left flowing curve */}
        <path
          d="M0 450 C100 400, 250 480, 350 500 C450 520, 500 470, 400 600"
          stroke="rgba(37, 99, 235, 0.07)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0 500 C80 460, 200 510, 300 530"
          stroke="rgba(14, 165, 233, 0.05)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Subtle dot accents */}
        <circle cx="1150" cy="80" r="3" fill="rgba(37, 99, 235, 0.1)" />
        <circle cx="1120" cy="130" r="2" fill="rgba(14, 165, 233, 0.08)" />
        <circle cx="50" cy="480" r="3" fill="rgba(37, 99, 235, 0.1)" />
        <circle cx="80" cy="520" r="2" fill="rgba(14, 165, 233, 0.08)" />
      </svg>
    ),

    section: (
      <svg
        className={`absolute pointer-events-none ${className}`}
        width="100%"
        height="120"
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 C200 20, 400 100, 600 60 C800 20, 1000 100, 1200 60"
          stroke="rgba(37, 99, 235, 0.06)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0 80 C300 40, 600 100, 900 60 C1050 40, 1150 70, 1200 80"
          stroke="rgba(14, 165, 233, 0.04)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    ),

    footer: (
      <svg
        className={`absolute top-0 left-0 pointer-events-none ${className}`}
        width="100%"
        height="80"
        viewBox="0 0 1200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 C200 10, 400 70, 600 40 C800 10, 1000 70, 1200 40"
          stroke="rgba(59, 130, 246, 0.15)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0 55 C300 25, 600 75, 900 45 C1050 30, 1150 55, 1200 55"
          stroke="rgba(14, 165, 233, 0.1)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    ),

    corner: (
      <svg
        className={`absolute pointer-events-none ${className}`}
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 200 C0 100, 100 0, 200 0"
          stroke="rgba(37, 99, 235, 0.08)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0 180 C20 90, 90 20, 180 0"
          stroke="rgba(14, 165, 233, 0.06)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    ),
  };

  return variants[variant] || null;
}
