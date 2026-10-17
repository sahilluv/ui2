import React from 'react';

export interface ShadowBackgroundDesignProps {
  screenType?: 'presentation' | 'welcome' | 'signup' | 'login' | string;
  className?: string;
  density?: 'low' | 'medium' | 'high';
}

/**
 * Atmospheric celestial & cosmic presentation backdrop for Shadow experience.
 * Features deep indigo/purple radial nebulae, orbital celestial geometry,
 * subtle twinkling stars, and atmospheric stardust overlays.
 */
export const ShadowBackgroundDesign: React.FC<ShadowBackgroundDesignProps> = ({
  screenType = 'presentation',
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Primary Matt Black Ambient Vignette */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[120px] opacity-20 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(20, 20, 20, 0.4) 50%, transparent 75%)',
        }}
      />

      {/* 2. Secondary Ambient Glows (Lower flank accents) */}
      <div
        className="absolute bottom-[-15%] left-[-10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(30, 30, 30, 0.5) 0%, rgba(10, 10, 10, 0.3) 60%, transparent 80%)',
        }}
      />
      <div
        className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[130px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(40, 40, 40, 0.4) 0%, rgba(15, 15, 15, 0.2) 55%, transparent 75%)',
        }}
      />

      {/* 3. Celestial Orbital Circles / Concentric Rings SVG */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-10"
        viewBox="0 0 1200 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="600" cy="600" r="280" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="600" cy="600" r="420" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <circle cx="600" cy="600" r="560" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="4 8" />

        {/* Diagonal Astrological Alignment Vectors */}
        <line x1="200" y1="200" x2="1000" y2="1000" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="6 10" />
        <line x1="1000" y1="200" x2="200" y2="1000" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="6 10" />

        {/* Orbital Marker Nodes */}
        <circle cx="600" cy="320" r="3" fill="#FFFFFF" />
        <circle cx="880" cy="600" r="2.5" fill="#888888" />
        <circle cx="600" cy="880" r="3" fill="#FFFFFF" />
        <circle cx="320" cy="600" r="2.5" fill="#888888" />
      </svg>

      {/* 4. Fine Grain Twinkling Stardust Field */}
      <div className="absolute inset-0">
        {/* Fixed constellations / twinkling stars */}
        <span className="absolute top-[8%] left-[14%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
        <span className="absolute top-[18%] right-[18%] w-1 h-1 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-ping [animation-duration:3.2s]" />
        <span className="absolute top-[28%] left-[24%] w-2 h-2 rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
        <span className="absolute top-[42%] left-[8%] w-1 h-1 rounded-full bg-white/50" />
        <span className="absolute top-[62%] left-[18%] w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse [animation-duration:2.4s]" />
        <span className="absolute top-[75%] left-[28%] w-1 h-1 rounded-full bg-white/60" />

        <span className="absolute top-[12%] right-[28%] w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse [animation-duration:2.8s]" />
        <span className="absolute top-[34%] right-[12%] w-2 h-2 rounded-full bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        <span className="absolute top-[52%] right-[22%] w-1 h-1 rounded-full bg-white/40" />
        <span className="absolute top-[68%] right-[8%] w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse [animation-duration:3.5s]" />
        <span className="absolute top-[84%] right-[25%] w-1 h-1 rounded-full bg-white/40" />
        <span className="absolute top-[88%] left-[45%] w-1.5 h-1.5 rounded-full bg-white/60 animate-ping [animation-duration:4s]" />
      </div>

      {/* 5. Subtle Vignette Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.6) 75%, rgba(0, 0, 0, 0.95) 100%)',
        }}
      />
    </div>
  );
};
