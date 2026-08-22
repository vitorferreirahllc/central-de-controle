export function WaveBackground() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 800 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wave1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d7c0f" />
          <stop offset="100%" stopColor="#1a2e05" />
        </linearGradient>
        <linearGradient id="wave2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#14210a" />
        </linearGradient>
      </defs>
      <rect width="800" height="900" fill="url(#glow)" />
      <path
        d="M0,520 C150,460 250,580 400,540 C550,500 650,600 800,540 L800,900 L0,900 Z"
        fill="url(#wave1)"
        opacity="0.55"
      />
      <path
        d="M0,600 C180,560 300,660 450,620 C600,580 680,660 800,610 L800,900 L0,900 Z"
        fill="url(#wave2)"
        opacity="0.75"
      />
      <path
        d="M0,700 C200,650 320,730 480,700 C620,675 700,740 800,700 L800,900 L0,900 Z"
        fill="#365314"
        opacity="0.9"
      />
    </svg>
  );
}
