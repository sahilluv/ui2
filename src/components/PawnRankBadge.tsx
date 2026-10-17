import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export type ShadowRankType = 'PAWN' | 'KNIGHT' | 'BISHOP' | 'ROOK' | 'QUEEN' | 'KING';

/**
 * Pleasant Web Audio harmonic chime for rank promotion
 */
export const playRankElevationChime = (isUpgrade = true) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    // Harmonic frequencies: rising joyful chords on elevation, pleasant resolving chime on revert
    const freqs = isUpgrade
      ? [523.25, 659.25, 783.99, 1046.5] // C5 -> E5 -> G5 -> C6
      : [783.99, 659.25, 523.25]; // G5 -> E5 -> C5
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.35);
    });
  } catch {
    // Non-blocking fallback
  }
};

/**
 * Multi-stage canvas confetti burst customized per Shadow Rank
 */
export const triggerRankConfetti = (
  rank: ShadowRankType = 'KNIGHT',
  originCoords?: { x: number; y: number }
) => {
  try {
    const paletteMap: Record<ShadowRankType, string[]> = {
      KING: ['#FFFFFF', '#E0E0E0', '#A0A0A0', '#404040', '#121212'],
      QUEEN: ['#FFFFFF', '#D0D0D0', '#888888', '#333333', '#121212'],
      ROOK: ['#FFFFFF', '#C0C0C0', '#777777', '#2A2A2A', '#121212'],
      BISHOP: ['#FFFFFF', '#B0B0B0', '#666666', '#222222', '#121212'],
      KNIGHT: ['#FFFFFF', '#A0A0A0', '#555555', '#1A1A1A', '#000000'],
      PAWN: ['#FFFFFF', '#909090', '#444444', '#161616', '#000000'],
    };

    const colors = paletteMap[rank] || paletteMap.KNIGHT;
    const origin = originCoords || { x: 0.5, y: 0.4 };

    // Initial immediate high-velocity burst
    confetti({
      particleCount: 50,
      spread: 70,
      startVelocity: 36,
      origin,
      colors,
      ticks: 200,
      gravity: 1.1,
      scalar: 0.95,
      zIndex: 9999,
      disableForReducedMotion: true,
    });

    // Secondary dual-angle festive bursts
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        startVelocity: 30,
        origin: { x: Math.max(0.15, origin.x - 0.15), y: origin.y },
        colors,
        ticks: 180,
        gravity: 0.95,
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        startVelocity: 30,
        origin: { x: Math.min(0.85, origin.x + 0.15), y: origin.y },
        colors,
        ticks: 180,
        gravity: 0.95,
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
    }, 140);
  } catch {
    // Non-blocking fallback
  }
};

export interface PawnRankBadgeProps {
  rank?: ShadowRankType;
  variant?: 'profile' | 'compact' | 'coin' | 'badge' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isDark?: boolean;
  onClick?: (e?: any) => void;
  className?: string;
  showSubtitle?: boolean;
  isPromoting?: boolean;
  periodicSheen?: boolean;
  enableConfetti?: boolean;
}

export const getRankMeta = (rank: ShadowRankType = 'PAWN') => {
  switch (rank) {
    case 'KING':
      return {
        level: 'RANK VI',
        status: 'Apex Status',
        tier: 'Tier 06',
        symbol: '♔',
        glowColor: 'rgba(255, 255, 255, 0.4)',
        glowColorSecondary: 'rgba(0, 0, 0, 0.6)',
        borderGrad: 'from-neutral-400 via-neutral-600 to-neutral-800',
        textGrad: 'from-white via-neutral-200 to-neutral-400',
        bgTint: 'rgba(255, 255, 255, 0.08)',
        badgeBg: 'bg-neutral-800 text-white border-neutral-600',
      };
    case 'QUEEN':
      return {
        level: 'RANK V',
        status: 'Sovereign Status',
        tier: 'Tier 05',
        symbol: '♕',
        glowColor: 'rgba(255, 255, 255, 0.35)',
        glowColorSecondary: 'rgba(0, 0, 0, 0.55)',
        borderGrad: 'from-neutral-500 via-neutral-700 to-neutral-900',
        textGrad: 'from-white via-neutral-200 to-neutral-400',
        bgTint: 'rgba(255, 255, 255, 0.06)',
        badgeBg: 'bg-neutral-800 text-white border-neutral-600',
      };
    case 'ROOK':
      return {
        level: 'RANK IV',
        status: 'Fortress Status',
        tier: 'Tier 04',
        symbol: '♖',
        glowColor: 'rgba(255, 255, 255, 0.3)',
        glowColorSecondary: 'rgba(0, 0, 0, 0.5)',
        borderGrad: 'from-neutral-500 via-neutral-700 to-neutral-900',
        textGrad: 'from-white via-neutral-200 to-neutral-400',
        bgTint: 'rgba(255, 255, 255, 0.06)',
        badgeBg: 'bg-neutral-800 text-white border-neutral-600',
      };
    case 'BISHOP':
      return {
        level: 'RANK III',
        status: 'Strategic Status',
        tier: 'Tier 03',
        symbol: '♗',
        glowColor: 'rgba(255, 255, 255, 0.3)',
        glowColorSecondary: 'rgba(0, 0, 0, 0.5)',
        borderGrad: 'from-neutral-500 via-neutral-700 to-neutral-900',
        textGrad: 'from-white via-neutral-200 to-neutral-400',
        bgTint: 'rgba(255, 255, 255, 0.06)',
        badgeBg: 'bg-neutral-800 text-white border-neutral-600',
      };
    case 'KNIGHT':
      return {
        level: 'RANK II',
        status: 'Vanguard Status',
        tier: 'Tier 02',
        symbol: '♘',
        glowColor: 'rgba(255, 255, 255, 0.3)',
        glowColorSecondary: 'rgba(0, 0, 0, 0.5)',
        borderGrad: 'from-neutral-500 via-neutral-700 to-neutral-900',
        textGrad: 'from-white via-neutral-200 to-neutral-400',
        bgTint: 'rgba(255, 255, 255, 0.06)',
        badgeBg: 'bg-neutral-800 text-white border-neutral-600',
      };
    case 'PAWN':
    default:
      return {
        level: 'RANK I',
        status: 'Foundation Status',
        tier: 'Tier 01',
        symbol: '♙',
        glowColor: 'rgba(255, 255, 255, 0.25)',
        glowColorSecondary: 'rgba(0, 0, 0, 0.5)',
        borderGrad: 'from-neutral-600 via-neutral-800 to-neutral-950',
        textGrad: 'from-white via-neutral-300 to-neutral-400',
        bgTint: 'rgba(255, 255, 255, 0.05)',
        badgeBg: 'bg-neutral-900 text-neutral-300 border-neutral-700',
      };
  }
};

/**
 * Classic Chess Coin (Shadow verification coin badge)
 * Supports all shadow ranks with smooth scale & glow transition
 */
export const ChessCoin: React.FC<{
  rank?: ShadowRankType;
  size?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  isElevating?: boolean;
}> = ({
  rank = 'PAWN',
  size = 15,
  className = '',
  onClick,
  title,
  isElevating = false,
}) => {
  const uniqueId = React.useId().replace(/:/g, '');
  const coinGradId = `chessCoinGrad_${uniqueId}`;
  const rimGradId = `chessCoinRim_${uniqueId}`;
  const meta = getRankMeta(rank);
  const defaultTitle = `Shadow Rank: ${rank} (${meta.level} · ${meta.status})`;

  return (
    <span
      onClick={onClick}
      title={title || defaultTitle}
      className={`inline-flex items-center justify-center shrink-0 align-middle select-none transition-all duration-500 ${
        isElevating ? 'scale-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]' : ''
      } ${onClick ? 'cursor-pointer hover:scale-125 active:scale-90' : 'cursor-default'} ${className}`}
      style={{ width: size, height: size }}
      role={onClick ? 'button' : undefined}
      aria-label={title || defaultTitle}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-[0_1.5px_4px_rgba(225,48,108,0.4)]"
      >
        <defs>
          <linearGradient id={coinGradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="50%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </linearGradient>

          <linearGradient id={rimGradId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0E0E0" />
            <stop offset="50%" stopColor="#888888" />
            <stop offset="100%" stopColor="#444444" />
          </linearGradient>
        </defs>

        {/* 8-lobed Verified Rosette Coin Shape */}
        <path
          d="M19.965 8.521C19.988 8.347 20 8.173 20 8C20 5.621 17.857 3.712 15.479 4.035C14.786 2.802 13.466 2 12 2C10.534 2 9.214 2.802 8.521 4.035C6.143 3.712 4 5.621 4 8C4 8.173 4.012 8.347 4.035 8.521C2.802 9.214 2 10.534 2 12C2 13.466 2.802 14.786 4.035 15.479C4.012 15.653 4 15.827 4 16C4 18.379 6.143 20.288 8.521 19.965C9.214 21.198 10.534 22 12 22C13.466 22 14.786 21.198 15.479 19.965C17.857 20.288 20 18.379 20 16C20 15.827 19.988 15.653 19.965 15.479C21.198 14.786 22 13.466 22 12C22 10.534 21.198 9.214 19.965 8.521Z"
          fill={`url(#${coinGradId})`}
          stroke={`url(#${rimGradId})`}
          strokeWidth="0.5"
        />

        {/* Delicate inner coin bevel ring */}
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.5"
          strokeDasharray="1.2 1.2"
        />

        {rank === 'KING' ? (
          <path d="M7 16H17V14.5L15.5 12L13.5 14L12 9L10.5 14L8.5 12L7 14.5V16Z" fill="#FFFFFF" />
        ) : rank === 'QUEEN' ? (
          <path d="M7 16H17V14.5L16 11.5L14 13L12 9.5L10 13L8 11.5L7 14.5V16Z" fill="#FFFFFF" />
        ) : rank === 'ROOK' ? (
          <path d="M8 16H16V13.5H14.5V11.5H15.5V9.5H14V10.5H13V9.5H11V10.5H10V9.5H8.5V11.5H9.5V13.5H8V16Z" fill="#FFFFFF" />
        ) : rank === 'BISHOP' ? (
          <path d="M12 7C10.5 7 9.5 8.5 9.5 10.5C9.5 12 10.5 13.5 10.5 14.5H13.5C13.5 13.5 14.5 12 14.5 10.5C14.5 8.5 13.5 7 12 7ZM10.5 15.5H13.5V16.5H10.5V15.5Z" fill="#FFFFFF" />
        ) : rank === 'KNIGHT' ? (
          <path
            d="M9 16.5H15V15H14.2C14.2 13.8 14.6 13 15.2 12C15.6 11.3 15.4 10.1 14.6 9.4L13.8 8.7C13.8 8.1 13.5 7.6 13.1 7.2L12.5 6.5C12.3 6.3 12 6.4 12 6.7V7.5C11.5 7.4 10.8 7.6 10.3 8.1L9.2 9.2C8.7 9.7 8.6 10.5 9 11.1L9.7 12.1C9.4 12.7 9.2 13.4 9 14.2V16.5Z"
            fill="#FFFFFF"
          />
        ) : (
          <>
            <circle cx="12" cy="7.2" r="2.2" fill="#FFFFFF" />
            <ellipse cx="12" cy="10.4" rx="2.5" ry="0.7" fill="#FFFFFF" />
            <path
              d="M10.1 14.3C10.4 12.6 11 11.6 11.3 10.8H12.7C13 11.6 13.6 12.6 13.9 14.3H10.1Z"
              fill="#FFFFFF"
            />
            <path
              d="M8.8 15.2C8.8 14.75 9.15 14.4 9.6 14.4H14.4C14.85 14.4 15.2 14.75 15.2 15.2V16.4C15.2 16.7 14.95 16.9 14.65 16.9H9.35C9.05 16.9 8.8 16.7 8.8 16.4V15.2Z"
              fill="#FFFFFF"
            />
          </>
        )}
      </svg>
    </span>
  );
};

/**
 * Premium Sculpted Pawn Emblem SVG
 */
export const PremiumPawnInsignia: React.FC<{
  size?: number;
  className?: string;
  glow?: boolean;
}> = ({ size = 28, className = '', glow = true }) => {
  const uniqueId = React.useId().replace(/:/g, '');
  const gradId = `pawnGrad_${uniqueId}`;
  const rimGradId = `rimGrad_${uniqueId}`;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-50 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(124,58,237,0.35) 60%, transparent 100%)',
          }}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
      >
        <defs>
          <linearGradient id={gradId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CCCCCC" />
            <stop offset="100%" stopColor="#888888" />
          </linearGradient>

          <linearGradient id={rimGradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0E0E0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#AAAAAA" />
          </linearGradient>
        </defs>

        <circle cx="24" cy="24" r="21" fill="#121212" stroke={`url(#${rimGradId})`} strokeWidth="1.5" />
        <circle cx="24" cy="24" r="17" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 3" />
        <circle cx="24" cy="14" r="5" fill={`url(#${gradId})`} />
        <ellipse cx="24" cy="20.5" rx="5.5" ry="1.6" fill={`url(#${gradId})`} />
        <path d="M20 28C20.5 24.5 21.5 22.5 22.2 21H25.8C26.5 22.5 27.5 24.5 28 28H20Z" fill={`url(#${gradId})`} />
        <path d="M17 30C17 29 17.8 28.5 19 28.5H29C30.2 28.5 31 29 31 30V32H17V30Z" fill={`url(#${gradId})`} />
        <path d="M15 33C15 32.2 15.8 31.8 17 31.8H31C32.2 31.8 33 32.2 33 33V35C33 35.6 32.5 36 32 36H16C15.5 36 15 35.6 15 35V33Z" fill={`url(#${gradId})`} />
      </svg>
    </div>
  );
};

/**
 * Premium Sculpted Knight Emblem SVG
 */
export const PremiumKnightInsignia: React.FC<{
  size?: number;
  className?: string;
  glow?: boolean;
}> = ({ size = 28, className = '', glow = true }) => {
  const uniqueId = React.useId().replace(/:/g, '');
  const gradId = `knightGrad_${uniqueId}`;
  const rimGradId = `knightRim_${uniqueId}`;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,200,200,0.1) 60%, transparent 100%)',
          }}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <linearGradient id={gradId} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#CCCCCC" />
            <stop offset="40%" stopColor="#888888" />
            <stop offset="80%" stopColor="#888888" />
            <stop offset="100%" stopColor="#666666" />
          </linearGradient>

          <linearGradient id={rimGradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EAEAEA" />
            <stop offset="30%" stopColor="#AAAAAA" />
            <stop offset="70%" stopColor="#CCCCCC" />
            <stop offset="100%" stopColor="#AAAAAA" />
          </linearGradient>
        </defs>

        <path
          d="M24 2.5L39.5 9L46 24.5L39.5 40L24 46.5L8.5 40L2 24.5L8.5 9L24 2.5Z"
          fill="#121212"
          stroke={`url(#${rimGradId})`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24.5" r="16" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 3" />
        <path d="M13 38C13 37.17 13.67 36.5 14.5 36.5H33.5C34.33 36.5 35 37.17 35 38H13Z" fill={`url(#${gradId})`} />
        <path d="M16 34C16 33.45 16.45 33 17 33H31C31.55 33 32 33.45 32 34V36H16V34Z" fill={`url(#${gradId})`} />
        <path
          d="M17.5 32.5C17.5 32.5 17 28 19 25C19.5 24.2 20.5 23.5 21 22.5C21.5 21.5 21.2 20 20 18.5L18.5 16.5C18 15.8 18.2 14.8 19 14.2L21 12.8C21.8 12.2 22.8 12.4 23.5 13.1L24.5 14.1C25.2 13 26.5 11.5 27.5 10C28.2 8.8 29.8 8.5 30.8 9.5L31.5 10.2C32.2 10.9 32.3 12 31.8 12.8C31 14.2 30.2 16 30.5 17.5C30.8 19 32 20.2 32.5 21.8C33.2 24.5 32.5 28.5 30.5 32.5H17.5Z"
          fill={`url(#${gradId})`}
        />
        <circle cx="23" cy="16.5" r="1.3" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const PawnRankBadge: React.FC<PawnRankBadgeProps> = ({
  rank = 'PAWN',
  variant = 'profile',
  size = 'md',
  isDark = true,
  onClick,
  className = '',
  showSubtitle = true,
  isPromoting = false,
  periodicSheen = true,
  enableConfetti = true,
}) => {
  const [internalTransitioning, setInternalTransitioning] = useState(false);
  const [isPawnToKnightBloom, setIsPawnToKnightBloom] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [showParticleBurst, setShowParticleBurst] = useState(false);
  const prevRankRef = useRef(rank);
  const isFirstMount = useRef(true);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Helper to trigger confetti from badge location
  const fireBadgeConfetti = (targetRank: ShadowRankType) => {
    let originCoords: { x: number; y: number } | undefined;
    if (badgeRef.current && typeof window !== 'undefined') {
      const rect = badgeRef.current.getBoundingClientRect();
      originCoords = {
        x: Math.min(Math.max((rect.left + rect.width / 2) / window.innerWidth, 0.1), 0.9),
        y: Math.min(Math.max((rect.top + rect.height / 2) / window.innerHeight, 0.1), 0.9),
      };
    }
    triggerRankConfetti(targetRank, originCoords);
  };

  // Trigger rich visual and audio effects when rank changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevRankRef.current = rank;
      return;
    }

    if (prevRankRef.current !== rank) {
      const isElevatingToKnight = rank === 'KNIGHT' || rank === 'KING' || rank === 'QUEEN';
      setShowShockwave(true);
      setShowParticleBurst(true);
      setInternalTransitioning(true);

      // Play harmonious Web Audio chime
      playRankElevationChime(isElevatingToKnight);

      // Fire festive canvas confetti
      if (enableConfetti) {
        fireBadgeConfetti(rank);
      }

      if (prevRankRef.current === 'PAWN' && rank === 'KNIGHT') {
        setIsPawnToKnightBloom(true);
      }

      const timer = setTimeout(() => {
        setInternalTransitioning(false);
        setShowShockwave(false);
        setIsPawnToKnightBloom(false);
      }, 1300);

      const particleTimer = setTimeout(() => {
        setShowParticleBurst(false);
      }, 1600);

      prevRankRef.current = rank;
      return () => {
        clearTimeout(timer);
        clearTimeout(particleTimer);
      };
    }
  }, [rank, enableConfetti]);

  // Handle external isPromoting prop
  useEffect(() => {
    if (isPromoting) {
      setShowShockwave(true);
      setShowParticleBurst(true);
      playRankElevationChime(true);
      if (enableConfetti) {
        fireBadgeConfetti(rank);
      }
      const t = setTimeout(() => {
        setShowShockwave(false);
        setShowParticleBurst(false);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [isPromoting, enableConfetti, rank]);

  const showPawnToKnightBloom = isPawnToKnightBloom || (isPromoting && rank === 'KNIGHT' && prevRankRef.current === 'PAWN');
  const isElevating = isPromoting || internalTransitioning || showPawnToKnightBloom;
  const meta = getRankMeta(rank);

  // Pure Chess Coin Variant
  if (variant === 'compact' || variant === 'coin' || variant === 'icon') {
    const coinSizes = { sm: 13, md: 15, lg: 18 };
    return (
      <ChessCoin
        rank={rank}
        size={coinSizes[size]}
        onClick={(e) => {
          if (onClick) onClick(e);
        }}
        className={className}
        isElevating={isElevating}
      />
    );
  }

  // DOM Confetti / Sparkle particle definitions (16 multi-directional particles)
  const particles = [
    { glyph: '✦', angle: 0, dist: 52, delay: 0, color: '#FFFFFF', size: '13px' },
    { glyph: '★', angle: 25, dist: 68, delay: 60, color: '#FFFFFF', size: '12px' },
    { glyph: '✧', angle: 50, dist: 48, delay: 120, color: '#FFFFFF', size: '11px' },
    { glyph: '●', angle: 75, dist: 60, delay: 40, color: '#FFFFFF', size: '7px' },
    { glyph: '✦', angle: 100, dist: 50, delay: 90, color: '#FFFFFF', size: '13px' },
    { glyph: '◆', angle: 130, dist: 70, delay: 140, color: '#FFFFFF', size: '9px' },
    { glyph: '✧', angle: 155, dist: 46, delay: 30, color: '#FFFFFF', size: '11px' },
    { glyph: '★', angle: 180, dist: 58, delay: 80, color: '#FFFFFF', size: '12px' },
    { glyph: '●', angle: 205, dist: 64, delay: 110, color: '#FFFFFF', size: '8px' },
    { glyph: '✦', angle: 230, dist: 52, delay: 50, color: '#FFFFFF', size: '13px' },
    { glyph: '✧', angle: 255, dist: 48, delay: 100, color: '#FFFFFF', size: '11px' },
    { glyph: '◆', angle: 280, dist: 66, delay: 70, color: '#FFFFFF', size: '9px' },
    { glyph: '★', angle: 305, dist: 54, delay: 130, color: '#FFFFFF', size: '12px' },
    { glyph: '✦', angle: 330, dist: 62, delay: 40, color: '#FFFFFF', size: '13px' },
    { glyph: '●', angle: 350, dist: 44, delay: 90, color: '#FFFFFF', size: '7px' },
  ];

  // Simple Badge Variant with smooth scale & glow
  if (variant === 'badge') {
    return (
      <div className="relative inline-flex">
        {/* rankGlowBloom overlay specifically when transitioning from PAWN to KNIGHT */}
        {showPawnToKnightBloom && (
          <div
            aria-hidden="true"
            className="absolute -inset-1.5 rounded-2xl pointer-events-none z-30 animate-rank-glow-bloom"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(180, 180, 180, 0.2) 50%, transparent 80%)',
              filter: 'blur(8px)',
            }}
          />
        )}

        <div
          onClick={onClick}
          className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-500 overflow-hidden ${
            onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''
          } ${isElevating ? 'animate-rank-elevation ring-2 ring-white/60 shadow-[0_0_28px_rgba(255,255,255,0.3)]' : ''} ${className}`}
          style={{
            background: isDark ? 'rgba(24, 26, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isElevating ? meta.glowColor : isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            boxShadow: isElevating
              ? `0 0 24px ${meta.glowColor}, 0 4px 16px rgba(0,0,0,0.2)`
              : '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Glow sheen sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
            <div
              className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent ${
                isElevating
                  ? 'animate-rank-sheen'
                  : periodicSheen
                  ? 'animate-rank-sheen-periodic'
                  : ''
              }`}
            />
          </div>

          <div className={`transition-transform duration-500 ${isElevating ? 'scale-115 rotate-6' : ''}`}>
            {rank === 'KNIGHT' ? (
              <PremiumKnightInsignia size={22} glow={true} />
            ) : rank === 'PAWN' ? (
              <PremiumPawnInsignia size={22} glow={true} />
            ) : (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: meta.bgTint, color: meta.glowColor }}>
                {meta.symbol}
              </div>
            )}
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${meta.textGrad}`}>
                {rank}
              </span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${meta.badgeBg}`}>
                {meta.level}
              </span>
            </div>
            {showSubtitle && (
              <span className="text-[9px] text-gray-400 font-medium tracking-tight">
                {meta.status}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Profile Flagship Variant with smooth scale, blooming radial aura & specular sheen
  return (
    <div ref={badgeRef} className="relative flex-1">
      {/* 1. Ambient Expanding Shockwave Pulse on Elevation */}
      {showShockwave && (
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-3xl pointer-events-none z-10 animate-rank-shockwave"
          style={{
            border: `2px solid ${meta.glowColor}`,
            boxShadow: `0 0 35px ${meta.glowColor}, inset 0 0 20px ${meta.glowColorSecondary}`,
            borderRadius: '24px',
          }}
        />
      )}

      {/* 1b. Ambient Radial Glow Aura Blooming Outward on Elevation */}
      <div
        aria-hidden="true"
        className={`absolute -inset-2 rounded-3xl blur-xl pointer-events-none transition-all duration-700 ${
          isElevating
            ? 'opacity-95 scale-110 animate-rank-glow-bloom'
            : 'opacity-0 scale-95'
        }`}
        style={{
          background: `radial-gradient(circle, ${meta.glowColor} 0%, ${meta.glowColorSecondary} 50%, transparent 75%)`,
        }}
      />

      {/* 1c. Dedicated rankGlowBloom overlay triggering specifically on PAWN to KNIGHT transition */}
      {showPawnToKnightBloom && (
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-3xl pointer-events-none z-30 animate-rank-glow-bloom"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.95) 0%, rgba(6, 182, 212, 0.6) 45%, rgba(192, 38, 211, 0.3) 70%, transparent 85%)',
            filter: 'blur(12px)',
          }}
        />
      )}

      {/* 1d. Floating DOM Confetti & Starburst Particle Explosion */}
      {showParticleBurst && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-40 overflow-visible">
          {particles.map((p, idx) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.dist;
            const ty = Math.sin(rad) * p.dist;
            return (
              <span
                key={idx}
                className="absolute left-1/2 top-1/2 select-none font-bold inline-block"
                style={{
                  color: p.color,
                  fontSize: p.size,
                  textShadow: `0 0 8px ${p.color}, 0 0 16px ${p.color}`,
                  transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.15)`,
                  opacity: 1,
                  transition: `all 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}ms`,
                  animation: `miniHeartPop 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}ms forwards`,
                }}
              >
                {p.glyph}
              </span>
            );
          })}
        </div>
      )}

      {/* 2. Main Badge Container with Smooth Scale & Dynamic Elevation Box Shadow */}
      <div
        onClick={onClick}
        className={`group relative flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-500 select-none overflow-hidden ${
          isElevating ? 'animate-rank-elevation animate-rank-glory' : ''
        } ${
          onClick ? 'cursor-pointer hover:scale-[1.015] active:scale-[0.985]' : ''
        } ${className}`}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(28, 30, 42, 0.98) 0%, rgba(18, 20, 30, 0.98) 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
          borderColor: isElevating
            ? meta.glowColor
            : isDark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.08)',
          boxShadow: isElevating
            ? `0 0 35px ${meta.glowColor}, 0 8px 30px rgba(0,0,0,0.35), inset 0 0 16px ${meta.glowColorSecondary}`
            : isDark
            ? '0 4px 18px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
            : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
        title={`Shadow Rank: ${rank} (${meta.level} · ${meta.status})`}
      >
        {/* 2b. Inner rankGlowBloom overlay specifically for PAWN to KNIGHT */}
        {showPawnToKnightBloom && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl pointer-events-none z-20 animate-rank-glow-bloom"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.45) 0%, rgba(6, 182, 212, 0.25) 50%, transparent 80%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* 3. Luminous Shimmer Sheen Wave Sweeping Across Periodically and on Elevation */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div
            className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent ${
              isElevating
                ? 'animate-rank-sheen'
                : periodicSheen
                ? 'animate-rank-sheen-periodic'
                : '-translate-x-full group-hover:translate-x-full transition-transform duration-1000'
            }`}
          />
        </div>

        {/* 4. Floating Micro-Glints during Elevation */}
        {isElevating && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping [animation-delay:0.1s]" />
            <span className="w-2 h-2 rounded-full bg-white animate-ping [animation-delay:0.25s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-ping [animation-delay:0.35s]" />
            <span className="w-1 h-1 rounded-full bg-neutral-500 animate-ping [animation-delay:0.45s]" />
          </div>
        )}

        {/* 5. Left side: Emblem & Status Details */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Sculpted Emblem with Smooth Spring Scale and Insignia Pop */}
          <div
            className={`transition-all duration-700 ${
              isElevating
                ? 'animate-rank-insignia-pop'
                : 'group-hover:scale-105'
            }`}
          >
            {rank === 'KNIGHT' ? (
              <PremiumKnightInsignia size={36} glow={true} />
            ) : rank === 'PAWN' ? (
              <PremiumPawnInsignia size={36} glow={true} />
            ) : (
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md border border-white/20"
                style={{ backgroundColor: meta.bgTint, color: meta.glowColor }}
              >
                {meta.symbol}
              </div>
            )}
          </div>

          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${meta.textGrad} transition-all duration-500`}
              >
                {rank}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border transition-all duration-500 ${meta.badgeBg} tracking-wider ${
                  isElevating ? 'scale-110 shadow-md ring-1 ring-white/40' : ''
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {meta.level}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-0.5 text-gray-500 dark:text-gray-400">
              <span className="text-[10px] font-semibold truncate">
                {meta.status}
              </span>
              <span className="text-[8px] font-mono opacity-60">✦</span>
              <span className="text-[9px] font-mono truncate">
                {meta.tier}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Right side: Level Pill */}
        <div className="flex flex-col items-end shrink-0 pl-1">
          <div
            className={`px-2 py-0.5 rounded-md border text-[8.5px] font-mono font-bold tracking-wider transition-all duration-500 ${
              isElevating
                ? 'scale-110 shadow-sm ring-1 ring-white/30'
                : ''
            } ${meta.badgeBg}`}
          >
            {meta.tier}
          </div>
        </div>
      </div>
    </div>
  );
};
