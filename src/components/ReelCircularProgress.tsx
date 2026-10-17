import React, { useState, useEffect, useRef, useId } from 'react';
import { Play, Pause, RotateCcw, ChevronUp } from 'lucide-react';

interface ReelCircularProgressProps {
  /** Whether the reel card is currently the active focused card in view */
  isActive: boolean;
  /** Whether the video is currently playing */
  isPlaying: boolean;
  /** Callback to toggle play/pause from the indicator */
  onTogglePlayPause?: () => void;
  /** Duration of the reel in seconds (defaults to 15s) */
  duration?: number;
  /** Whether the bottom nav bar is shrunk (adjusts bottom offset) */
  isNavShrunk?: boolean;
  /** Optional custom class name */
  className?: string;
  /** Optional toast notification callback */
  onToast?: (msg: string, icon?: 'sparkles' | 'bookmark') => void;
  /** Optional reel ID for distinct gradient IDs */
  reelId?: string;
}

export const ReelCircularProgress: React.FC<ReelCircularProgressProps> = ({
  isActive,
  isPlaying,
  onTogglePlayPause,
  duration = 15,
  isNavShrunk = false,
  className = '',
  onToast,
  reelId = 'reel',
}) => {
  const gradientId = useId();
  const [currentTime, setCurrentTime] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasLooped, setHasLooped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lastClickTimeRef = useRef<number>(0);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset or run video progression timer
  useEffect(() => {
    if (!isActive) {
      setCurrentTime(0);
      return;
    }

    if (!isPlaying) {
      return;
    }

    const intervalMs = 50;
    const increment = intervalMs / 1000;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + increment;
        if (next >= duration) {
          // Trigger loop pulse feedback
          setHasLooped(true);
          setTimeout(() => setHasLooped(false), 600);
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isActive, isPlaying, duration]);

  // Geometric calculations for SVG circular ring
  const size = 46;
  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2; // 20
  const circumference = 2 * Math.PI * radius; // ~125.66
  const progressRatio = Math.min(1, Math.max(0, currentTime / duration));
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Position of glowing pinhead dot at the leading tip of the progress arc
  const angle = -Math.PI / 2 + 2 * Math.PI * progressRatio;
  const dotCx = size / 2 + radius * Math.cos(angle);
  const dotCy = size / 2 + radius * Math.sin(angle);

  // Formatted seconds
  const currentSeconds = Math.floor(currentTime);
  const formattedCurrent = `0:${currentSeconds.toString().padStart(2, '0')}`;
  const formattedTotal = `0:${Math.floor(duration).toString().padStart(2, '0')}`;
  const percentComplete = Math.round(progressRatio * 100);
  const isNearEnd = progressRatio >= 0.85;

  const handleIndicatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();

    if (now - lastClickTimeRef.current < 300) {
      // Double tap: Restart playback from 0:00
      setCurrentTime(0);
      onToast?.('Restarting Reel playback ↺', 'sparkles');
    } else {
      // Single tap: Toggle play/pause
      if (onTogglePlayPause) {
        onTogglePlayPause();
      }
      onToast?.(isPlaying ? `Paused at ${formattedCurrent}` : `Playing from ${formattedCurrent}`);
    }
    lastClickTimeRef.current = now;

    // Show quick status tooltip
    setShowTooltip(true);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 1600);
  };

  return (
    <div
      className={`absolute right-4.5 ${
        isNavShrunk ? 'bottom-16' : 'bottom-22'
      } z-30 transition-all duration-300 select-none ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
    >
      {/* Floating Status / Time Tooltip */}
      {(showTooltip || isHovered) && (
        <div className="absolute bottom-full right-0 mb-2 pointer-events-none z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 rounded-[10px] bg-black/90 backdrop-blur-md border border-white/20 shadow-2xl text-[10px] font-bold text-white whitespace-nowrap flex items-center gap-1.5">
            <span className="text-[#D4C4EB] font-black">{formattedCurrent}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/70">{formattedTotal}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[#D4C4EB]">{percentComplete}%</span>
          </div>
        </div>
      )}

      {/* Near End Swipe Prompt Pill */}
      {isActive && isNearEnd && isPlaying && !isHovered && (
        <div className="absolute bottom-full right-0 mb-2 pointer-events-none z-30 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="px-2 py-0.5 rounded-[8px] bg-black/90 backdrop-blur-md text-[9px] font-black text-white shadow-lg flex items-center gap-1 border border-[#D4C4EB]/40 whitespace-nowrap">
            <ChevronUp size={11} className="animate-bounce text-[#D4C4EB]" />
            <span>Next Reel</span>
          </div>
        </div>
      )}

      {/* Main Interactive Circular Progress Button */}
      <button
        onClick={handleIndicatorClick}
        title={`Video playback: ${formattedCurrent} / ${formattedTotal} (${percentComplete}%) • Click to ${
          isPlaying ? 'pause' : 'play'
        }, double-click to restart`}
        aria-label="Reel video playback progress"
        role="progressbar"
        aria-valuenow={percentComplete}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative group p-0 m-0 bg-transparent border-0 cursor-pointer outline-none active:scale-95 transition-transform"
      >
        {/* Glow halo on loop or near end */}
        {hasLooped && (
          <div className="absolute inset-0 rounded-full bg-[#7B52B9]/40 animate-ping pointer-events-none" />
        )}

        {/* Circular Card Container */}
        <div
          className={`w-[46px] h-[46px] rounded-full bg-black/85 backdrop-blur-md border border-white/20 flex items-center justify-center relative shadow-[0_4px_16px_rgba(0,0,0,0.55)] transition-all ${
            isNearEnd ? 'shadow-[0_0_16px_rgba(123,82,185,0.65)] border-[#D4C4EB]/60' : ''
          }`}
        >
          {/* SVG Progress Ring */}
          <svg
            width={size}
            height={size}
            className="absolute inset-0 pointer-events-none"
            viewBox={`0 0 ${size} ${size}`}
          >
            <defs>
              <linearGradient id={`grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B52B9" />
                <stop offset="60%" stopColor="#9C6FE4" />
                <stop offset="100%" stopColor="#D4C4EB" />
              </linearGradient>
              <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#7B52B9" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Inactive Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth={strokeWidth}
            />

            {/* Dynamic Active Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`url(#grad-${gradientId})`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{
                transition: 'stroke-dashoffset 0.1s linear',
              }}
            />

            {/* Glowing Leading Dot at tip of arc */}
            {progressRatio > 0.02 && (
              <circle
                cx={dotCx}
                cy={dotCy}
                r={2.5}
                fill="#FFFFFF"
                filter={`url(#glow-${gradientId})`}
                className="transition-all duration-75"
              />
            )}
          </svg>

          {/* Center Dynamic Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white pointer-events-none">
            {!isPlaying ? (
              // Paused state: Show Play icon
              <Play size={15} className="ml-0.5 fill-white text-white drop-shadow-md animate-pulse" />
            ) : isHovered ? (
              // Hovered state: Show Pause icon
              <Pause size={14} className="fill-white text-white drop-shadow-md" />
            ) : (
              // Playing state: Show live elapsed seconds or mini audio waveform
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-black tracking-tight text-white/95 leading-none drop-shadow-sm font-mono">
                  {currentSeconds}s
                </span>
                <div className="flex items-center gap-[1.5px] mt-0.5 h-[5px]">
                  <span
                    className="w-[1.5px] bg-[#D4C4EB] rounded-full animate-pulse"
                    style={{ height: `${3 + (currentSeconds % 3) * 2}px` }}
                  />
                  <span
                    className="w-[1.5px] bg-[#9C6FE4] rounded-full animate-pulse delay-75"
                    style={{ height: `${2 + ((currentSeconds + 1) % 4) * 2}px` }}
                  />
                  <span
                    className="w-[1.5px] bg-[#D4C4EB] rounded-full animate-pulse delay-150"
                    style={{ height: `${4 + (currentSeconds % 2) * 2}px` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
