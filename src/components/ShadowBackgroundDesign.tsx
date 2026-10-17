import React from 'react';

export interface ShadowBackgroundDesignProps {
  screenType?: 'presentation' | 'welcome' | 'signup' | 'login' | string;
  className?: string;
  density?: 'low' | 'medium' | 'high';
}

/**
 * Soft, cool-toned presentation background transferred directly from the reference image:
 * - Main background: pale cool grey (#E1E4E8)
 * - Large geometric background shapes: muted grey-lavender (#9295A6)
 * - Secondary background tones: #D5D9E0 and #E8EBEF
 * - Soft tonal transitions between background areas, preserving the distinction
 *   between pale outer background and darker central geometric region.
 */
export const ShadowBackgroundDesign: React.FC<ShadowBackgroundDesignProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Large geometric background shape: muted grey-lavender (#9295A6) sweeping across top & center */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft upper-to-center organic curving wave in #9295A6 */}
        <path
          d="M 0,0 L 1440,0 L 1440,380 C 1300,420 1140,430 980,360 C 820,290 680,240 500,280 C 340,315 180,410 0,360 Z"
          fill="#9295A6"
          opacity="0.88"
        />

        {/* Secondary wave layer in #D5D9E0 for soft tonal transition */}
        <path
          d="M 0,340 C 220,410 380,330 560,290 C 740,250 900,310 1060,370 C 1220,430 1340,410 1440,360 L 1440,540 C 1300,600 1120,580 960,520 C 800,460 620,490 440,550 C 260,610 120,570 0,510 Z"
          fill="#D5D9E0"
          opacity="0.55"
        />

        {/* Secondary smooth curving region in #E8EBEF */}
        <path
          d="M 0,490 C 160,550 320,590 480,540 C 640,490 800,440 980,490 C 1160,540 1300,580 1440,520 L 1440,900 L 0,900 Z"
          fill="#E8EBEF"
          opacity="0.45"
        />
      </svg>

      {/* 2. Soft atmospheric blur overlay ensuring smooth tonal gradients between shapes */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, rgba(232, 235, 239, 0.3) 0%, transparent 60%)',
        }}
      />
    </div>
  );
};
