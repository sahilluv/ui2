import React from 'react';
import { ChevronLeft, ChevronRight, Check, Compass, User } from 'lucide-react';

interface ReelSwipeIndicatorProps {
  /** Whether reel swiping is currently active */
  isSwiping: boolean;
  /** Horizontal drag delta in pixels */
  deltaX: number;
  /** Threshold at which navigation commits on release (defaults to 50) */
  threshold?: number;
  /** Target creator username or label (e.g. 'eliott.j') */
  authorUsername?: string;
  /** Custom additional styling class */
  className?: string;
  /** Fixed positioning vs absolute inside card container */
  positionMode?: 'absolute' | 'fixed';
}

/**
 * Enhanced Reel Swipe Gesture Feedback Indicator
 * Provides subtle visual feedback (including directional icon shift, threshold meter,
 * neon state transformation, and peripheral edge glow) when approaching and crossing
 * the 50px swipe threshold.
 */
export const ReelSwipeIndicator: React.FC<ReelSwipeIndicatorProps> = ({
  isSwiping,
  deltaX,
  threshold = 50,
  authorUsername = 'Creator',
  className = '',
  positionMode = 'absolute',
}) => {
  const absDelta = Math.abs(deltaX);

  // Only render visual cues once the user begins dragging noticeably horizontally (> 12px)
  if (!isSwiping || absDelta < 12) {
    return null;
  }

  const isSwipingRight = deltaX > 0; // Return to feed
  const isSwipingLeft = deltaX < 0;  // View creator profile
  const isPastThreshold = absDelta >= threshold;

  // Progress from initial trigger (12px) to threshold (50px)
  const progressRatio = Math.min(1, Math.max(0, (absDelta - 12) / (threshold - 12)));
  const progressPercent = Math.round(progressRatio * 100);

  // Calculate subtle icon shift offset:
  // Under 50px: shifts 0px to 3.5px smoothly in gesture direction
  // Crossing 50px: shifts decisively to 7.5px (or -7.5px) with spring scale bump
  const baseShift = progressRatio * 3.5;
  const extraThresholdShift = isPastThreshold ? 4.5 : 0;
  const iconShiftX = (baseShift + extraThresholdShift) * (isSwipingRight ? -1 : 1);

  // SVG circular arc for 50px threshold completion
  const ringRadius = 9;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (progressRatio * circumference);

  const containerPosition = positionMode === 'fixed' ? 'fixed' : 'absolute';

  return (
    <>
      {/* Peripheral Edge Glow Bar: visual confirmation of threshold crossing */}
      <div
        className={`${containerPosition} top-0 bottom-0 pointer-events-none z-30 transition-all duration-200 ease-out ${
          isSwipingRight ? 'left-0' : 'right-0'
        } ${
          isPastThreshold
            ? isSwipingRight
              ? 'w-3 bg-gradient-to-r from-white/40 via-white/15 to-transparent shadow-[0_0_24px_rgba(255,255,255,0.4)]'
              : 'w-3 bg-gradient-to-l from-white/40 via-white/15 to-transparent shadow-[0_0_24px_rgba(255,255,255,0.4)]'
            : isSwipingRight
            ? 'w-1 bg-gradient-to-r from-white/20 to-transparent'
            : 'w-1 bg-gradient-to-l from-white/20 to-transparent'
        }`}
      />

      {/* Main Floating Cue Pill */}
      <div
        className={`${containerPosition} top-1/2 -translate-y-1/2 z-40 pointer-events-none select-none transition-all duration-150 ease-out ${
          isSwipingRight ? 'left-3 sm:left-5' : 'right-3 sm:right-5'
        } ${className}`}
        style={{
          transform: `translateY(-50%) translateX(${
            isSwipingRight
              ? isPastThreshold ? Math.min(10, (absDelta - threshold) * 0.25) : 0
              : isPastThreshold ? -Math.min(10, (absDelta - threshold) * 0.25) : 0
          }px)`,
        }}
      >
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] backdrop-blur-xl transition-all duration-200 ease-out shadow-2xl border ${
            isPastThreshold
              ? 'bg-black/92 border-white/50 shadow-[0_0_25px_rgba(255,255,255,0.25),0_10px_25px_rgba(0,0,0,0.7)] scale-[1.04]'
              : 'bg-black/82 border-white/20 text-white/90 shadow-xl scale-100'
          }`}
        >
          {/* LEFT ICON (When swiping right to Feed) */}
          {isSwipingRight && (
            <div className="relative flex items-center justify-center">
              {/* Threshold Met Ring / Shockwave */}
              {isPastThreshold && (
                <span className="absolute -inset-1 rounded-full bg-white/20 animate-ping pointer-events-none" />
              )}
              
              {/* The Shifting Icon with Spring Transition */}
              <div
                className="relative flex items-center justify-center transition-transform duration-200 ease-out"
                style={{
                  transform: `translateX(${iconShiftX}px) scale(${isPastThreshold ? 1.25 : 1})`,
                }}
              >
                <ChevronLeft
                  size={18}
                  className={`transition-colors duration-200 ${
                    isPastThreshold
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'text-white/80'
                  }`}
                />
                {/* Subtle double-chevron echo when crossed 50px */}
                {isPastThreshold && (
                  <ChevronLeft
                    size={14}
                    className="absolute -left-2 text-white/70 animate-in fade-in zoom-in-75 duration-150"
                  />
                )}
              </div>
            </div>
          )}

          {/* Central Content & Threshold Status */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              {isSwipingRight ? (
                <>
                  <Compass size={13} className={isPastThreshold ? 'text-white' : 'text-zinc-400'} />
                  <span className={`text-xs font-bold tracking-tight transition-colors duration-150 ${
                    isPastThreshold ? 'text-white' : 'text-zinc-200'
                  }`}>
                    {isPastThreshold ? 'Release for Feed' : 'Pull to Return'}
                  </span>
                </>
              ) : (
                <>
                  <User size={13} className={isPastThreshold ? 'text-white' : 'text-zinc-400'} />
                  <span className={`text-xs font-bold tracking-tight transition-colors duration-150 ${
                    isPastThreshold ? 'text-white' : 'text-zinc-200'
                  }`}>
                    {isPastThreshold ? `Release for @${authorUsername}` : `@${authorUsername}`}
                  </span>
                </>
              )}

              {/* Threshold Met State Chip */}
              {isPastThreshold ? (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider animate-in zoom-in-90 duration-150 bg-neutral-800 text-white border border-neutral-600"
                >
                  <Check size={10} strokeWidth={3} />
                  <span>Ready</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-zinc-400">
                  {Math.round(absDelta)}/50px
                </span>
              )}
            </div>

            {/* Threshold Navigation Cue Subtitle */}
            <span className="text-[10px] text-zinc-400/90 leading-tight">
              {isPastThreshold
                ? 'Navigation committed on release'
                : `Pull ${Math.max(0, 50 - Math.round(absDelta))}px further to switch`}
            </span>
          </div>

          {/* Mini Circular Threshold Meter Gauge */}
          <div className="relative w-5 h-5 flex items-center justify-center ml-0.5">
            <svg className="w-5 h-5 -rotate-90 transform" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r={ringRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-white/15"
              />
              <circle
                cx="12"
                cy="12"
                r={ringRadius}
                fill="none"
                stroke={isPastThreshold ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-100 ease-out"
              />
            </svg>
            {isPastThreshold && (
              <span
                className="absolute w-1.5 h-1.5 rounded-full bg-white animate-ping"
              />
            )}
          </div>

          {/* RIGHT ICON (When swiping left to Profile) */}
          {isSwipingLeft && (
            <div className="relative flex items-center justify-center">
              {/* Threshold Met Ring / Shockwave */}
              {isPastThreshold && (
                <span className="absolute -inset-1 rounded-full bg-white/20 animate-ping pointer-events-none" />
              )}
              
              {/* The Shifting Icon with Spring Transition */}
              <div
                className="relative flex items-center justify-center transition-transform duration-200 ease-out"
                style={{
                  transform: `translateX(${iconShiftX}px) scale(${isPastThreshold ? 1.25 : 1})`,
                }}
              >
                <ChevronRight
                  size={18}
                  className={`transition-colors duration-200 ${
                    isPastThreshold
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'text-white/80'
                  }`}
                />
                {/* Subtle double-chevron echo when crossed 50px */}
                {isPastThreshold && (
                  <ChevronRight
                    size={14}
                    className="absolute -right-2 text-white/70 animate-in fade-in zoom-in-75 duration-150"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
