import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  X,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  shhGirlReading,
  shhCharacterPointing,
  shhGirlGlassesBun,
} from '../assets/images';
import { MangaArtwork } from './MangaArtwork';

export type ShadowAuthStep = 'welcome' | 'signup' | 'login';
export type ShhAuthStep = ShadowAuthStep;

export interface ShadowAuthScreenProps {
  /** Current step to display: 'welcome', 'signup', or 'login' */
  initialStep?: ShadowAuthStep;
  /** Callback when authentication completes successfully */
  onAuthSuccess?: (userData: { name: string; username: string; email: string }) => void;
  /** Callback to close or go back to main app */
  onClose?: () => void;
  /** Toast callback for status messages */
  onToast?: (msg: string, icon?: 'sparkles' | 'bookmark') => void;
  /** If true, locks the screen to the specified initialStep without internal step navigation */
  lockedStep?: ShadowAuthStep;
  /** Custom outer container classes */
  className?: string;
  /** Show phone status bar (9:30 AM, signal, battery) */
  showStatusBar?: boolean;
  /** Brand display name (e.g. 'Shadow') */
  brandName?: string;
}

export type ShhAuthScreenProps = ShadowAuthScreenProps;

// Google Official 4-color 'G' Logo SVG
export const GoogleLogoIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Cellular Signal, WiFi & Battery Status Icons matching exact screenshot
export const ShadowStatusBar: React.FC = () => (
  <div className="w-full pt-2.5 pb-2 px-6 flex items-center justify-between text-black text-[11px] font-bold tracking-tight select-none z-30">
    <span>9:30 AM</span>
    <div className="flex items-center gap-1.5">
      {/* Cellular bars */}
      <div className="flex items-end gap-[1.5px] h-3">
        <span className="w-[2.5px] h-1.5 bg-black rounded-[0.5px]" />
        <span className="w-[2.5px] h-2 bg-black rounded-[0.5px]" />
        <span className="w-[2.5px] h-2.5 bg-black rounded-[0.5px]" />
        <span className="w-[2.5px] h-3 bg-black rounded-[0.5px]" />
      </div>
      {/* Battery icon */}
      <div className="w-5 h-2.5 rounded-[3px] border border-black p-[1px] flex items-center">
        <div className="w-full h-full bg-black rounded-[1.5px]" />
      </div>
    </div>
  </div>
);

export const ShhStatusBar = ShadowStatusBar;

export const ShadowAuthScreen: React.FC<ShadowAuthScreenProps> = ({
  initialStep = 'welcome',
  onAuthSuccess,
  onClose,
  onToast,
  lockedStep,
  className = '',
  showStatusBar = true,
  brandName = 'Shadow',
}) => {
  const [step, setStep] = useState<ShadowAuthStep>(lockedStep || initialStep);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const activeStep = lockedStep || step;

  const handleGoogleAuth = () => {
    setIsLoading(true);
    onToast?.('Signing in with Google...', 'sparkles');
    setTimeout(() => {
      setIsLoading(false);
      const googleUser = {
        name: 'Alex Rivera',
        username: 'alex_rivera',
        email: 'alex.rivera@gmail.com',
      };
      onToast?.('Welcome to Shadow! Signed in with Google 🎉', 'sparkles');
      onAuthSuccess?.(googleUser);
    }, 900);
  };

  const handleSignUp = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!agreeTerms) {
      onToast?.('Please agree to the Terms of Service & Privacy Policy');
      return;
    }
    if (!email || !password) {
      onToast?.('Please fill in your email and password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        name: name || 'Shadow User',
        username: username || 'shadow_user',
        email: email,
      };
      onToast?.('Account created! Welcome to Shadow! ✨', 'sparkles');
      onAuthSuccess?.(newUser);
    }, 800);
  };

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!username && !email) {
      onToast?.('Please enter your Username or Email');
      return;
    }
    if (!password) {
      onToast?.('Please enter your password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const loggedUser = {
        name: username || 'Shadow User',
        username: username || 'shadow_user',
        email: email || `${username}@shadow.network`,
      };
      onToast?.(`Welcome back, @${loggedUser.username}! 🚀`, 'sparkles');
      onAuthSuccess?.(loggedUser);
    }, 800);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setForgotSent(true);
    onToast?.('Password reset instructions sent to your email ✉️');
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[720px] max-h-[844px] overflow-hidden flex flex-col justify-between select-none ${className}`}
      style={{
        backgroundColor: '#121212', // Matt black stealth background
      }}
    >
      {/* Optional Close / Back button for interactive simulator */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-10 right-4 z-40 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Dismiss Auth"
        >
          <X size={16} />
        </button>
      )}

      {/* Screen step breadcrumb for single interactive device */}
      {!lockedStep && (
        <div className="absolute top-10 left-4 z-40 flex items-center gap-1">
          {activeStep !== 'welcome' && (
            <button
              onClick={() => setStep('welcome')}
              className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer mr-1"
              title="Back to Welcome"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>
      )}

      {/* Top Phone Status Bar */}
      {showStatusBar && <ShhStatusBar />}

      {/* ========================================================= */}
      {/* SCREEN 1: WELCOME TO SHH!                                */}
      {/* ========================================================= */}
      {activeStep === 'welcome' && (
        <div className="relative flex-1 flex flex-col justify-between px-7 pt-4 pb-0 animate-in fade-in duration-300">
          {/* Subtle Organic Background Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Left Cloud */}
            <div
              className="absolute -left-12 top-24 w-44 h-24 rounded-full opacity-40 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />
            <div
              className="absolute -left-6 top-32 w-32 h-20 rounded-full opacity-40 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />

            {/* Right Cloud */}
            <div
              className="absolute -right-14 top-40 w-52 h-28 rounded-full opacity-35 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />
            <div
              className="absolute -right-6 top-48 w-40 h-24 rounded-full opacity-35 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />
          </div>

          {/* Top Heading Content */}
          <div className="relative z-10 pt-2">
            <h1 className="text-white text-[32px] sm:text-[34px] font-black tracking-tight leading-[1.12]">
              Welcome To
              <br />
              <span className="font-shadow-script font-normal text-[40px] sm:text-[44px] tracking-normal inline-block text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.45)]">
                Shadow
              </span>
            </h1>
            <p className="text-[#1F1F2E] text-[13px] sm:text-[14px] font-extrabold leading-snug mt-3.5 max-w-[260px]">
              another you
            </p>
          </div>

          {/* Middle Action: Sign Up button + Login prompt */}
          <div className="relative z-20 my-auto pt-6 flex flex-col items-start gap-3">
            <button
              onClick={() => {
                if (lockedStep) {
                  onToast?.('Navigating to Sign up');
                } else {
                  setStep('signup');
                }
              }}
              className="bg-black hover:bg-neutral-900 active:scale-95 text-white font-extrabold text-sm py-3 px-10 rounded-full shadow-xl transition-all cursor-pointer"
            >
              Sign up
            </button>

            <div className="text-[12px] font-medium text-[#1F1F2E] flex items-center gap-1.5 pl-1">
              <span>Already have an account?</span>
              <button
                onClick={() => {
                  if (lockedStep) {
                    onToast?.('Navigating to Login');
                  } else {
                    setStep('login');
                  }
                }}
                className="font-extrabold text-[#1F1F2E] hover:underline cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>

          {/* Bottom Illustration: Girl reading in armchair with "NEW BEGINNING" book */}
          <div className="relative z-10 w-full flex justify-center -mb-2 mt-auto">
            <MangaArtwork
              src={shhGirlReading}
              alt="Girl sitting in armchair reading New Beginning manga"
              className="w-[285px] sm:w-[310px] max-h-[290px] drop-shadow-md"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 2: SIGN UP TO SHADOW!                             */}
      {/* ========================================================= */}
      {activeStep === 'signup' && (
        <div className="relative flex-1 flex flex-col justify-between px-6 pt-3 pb-0 animate-in fade-in duration-300">
          {/* Subtle Organic Background Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div
              className="absolute -left-12 top-20 w-44 h-24 rounded-full opacity-25 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />
            <div
              className="absolute -right-14 top-36 w-52 h-28 rounded-full opacity-20 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />
          </div>

          <div className="relative z-20 flex flex-col gap-3.5">
            {/* Header Title */}
            <h2 className="text-white text-2xl font-black text-center tracking-tight drop-shadow-sm pt-1">
              Sign up to{' '}
              <span className="font-shadow-script text-[30px] font-normal inline-block text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
                Shadow
              </span>
              !
            </h2>

            {/* Google Social Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-900 active:scale-[0.98] text-white font-bold text-xs py-3 px-5 rounded-full shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <GoogleLogoIcon size={18} />
              <span>{isLoading ? 'Connecting...' : 'Sign up with Google'}</span>
            </button>

            {/* Divider: Or continue with Email */}
            <div className="flex items-center gap-2.5 px-2 my-0.5">
              <div className="flex-1 h-[1px] bg-black/35" />
              <span className="text-[#1F1F2E] text-[11px] font-bold tracking-tight">
                Or continue with Email
              </span>
              <div className="flex-1 h-[1px] bg-black/35" />
            </div>

            {/* Form Fields: 4 stacked rounded-full inputs */}
            <form onSubmit={handleSignUp} className="flex flex-col gap-2.5">
              <div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-6 rounded-full bg-white text-[#1F1F2E] text-xs font-semibold placeholder:text-neutral-400 placeholder:font-medium shadow-[0_3px_10px_rgba(0,0,0,0.12)] border-0 outline-none focus:ring-2 focus:ring-black/40 transition-all"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 px-6 rounded-full bg-white text-[#1F1F2E] text-xs font-semibold placeholder:text-neutral-400 placeholder:font-medium shadow-[0_3px_10px_rgba(0,0,0,0.12)] border-0 outline-none focus:ring-2 focus:ring-black/40 transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-6 rounded-full bg-white text-[#1F1F2E] text-xs font-semibold placeholder:text-neutral-400 placeholder:font-medium shadow-[0_3px_10px_rgba(0,0,0,0.12)] border-0 outline-none focus:ring-2 focus:ring-black/40 transition-all"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-6 pr-12 rounded-full bg-white text-[#1F1F2E] text-xs font-semibold placeholder:text-neutral-400 placeholder:font-medium shadow-[0_3px_10px_rgba(0,0,0,0.12)] border-0 outline-none focus:ring-2 focus:ring-black/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 px-2 mt-1 cursor-pointer select-none">
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4 h-4 rounded-[4px] mt-0.5 border flex items-center justify-center transition-colors ${
                    agreeTerms
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-neutral-400'
                  }`}
                >
                  {agreeTerms && <Check size={11} strokeWidth={3} />}
                </div>
                <span className="text-white text-[10px] sm:text-[11px] font-semibold leading-tight">
                  I agree with the Terms of Service and Privacy policy
                </span>
              </label>

              {/* Right-aligned Create Account Button & Login link */}
              <div className="flex flex-col items-end gap-2 mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-black hover:bg-neutral-900 active:scale-95 text-white font-extrabold text-xs py-3 px-7 rounded-full shadow-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>

                <div className="text-[11px] font-medium text-white/95 flex items-center gap-1 pr-1">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (lockedStep) {
                        onToast?.('Navigating to Login');
                      } else {
                        setStep('login');
                      }
                    }}
                    className="font-extrabold text-white underline hover:text-white/80 cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom-Left Illustration: Manga character in jacket leaning & pointing */}
          <div className="relative z-10 w-full flex justify-start -ml-3 -mb-1 mt-auto pointer-events-none">
            <MangaArtwork
              src={shhCharacterPointing}
              alt="Manga character leaning in jacket pointing right"
              className="w-[205px] sm:w-[225px] max-h-[220px] drop-shadow-md"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 3: LOG IN TO SHADOW!                              */}
      {/* ========================================================= */}
      {activeStep === 'login' && (
        <div className="relative flex-1 flex flex-col justify-between px-6 pt-3 pb-0 animate-in fade-in duration-300">
          {/* Subtle Organic Background Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div
              className="absolute -left-12 top-20 w-44 h-24 rounded-full opacity-25 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />
            <div
              className="absolute -right-14 top-36 w-52 h-28 rounded-full opacity-20 blur-[1px]"
              style={{ backgroundColor: '#222222' }}
            />
          </div>

          <div className="relative z-20 flex flex-col gap-3.5">
            {/* Header Title */}
            <h2 className="text-white text-2xl font-black text-center tracking-tight drop-shadow-sm pt-1">
              Log in to{' '}
              <span className="font-shadow-script text-[30px] font-normal inline-block text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
                Shadow
              </span>
              !
            </h2>

            {/* Google Social Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-900 active:scale-[0.98] text-white font-bold text-xs py-3 px-5 rounded-full shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <GoogleLogoIcon size={18} />
              <span>{isLoading ? 'Connecting...' : 'Log in with Google'}</span>
            </button>

            {/* Divider: Or log in with Email */}
            <div className="flex items-center gap-2.5 px-2 my-0.5">
              <div className="flex-1 h-[1px] bg-black/35" />
              <span className="text-[#1F1F2E] text-[11px] font-bold tracking-tight">
                Or log in with Email
              </span>
              <div className="flex-1 h-[1px] bg-black/35" />
            </div>

            {/* Form Fields: Username/Email & Password with labels */}
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div>
                <label className="block text-[#1F1F2E] text-[11.5px] font-bold mb-1.5 pl-3">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=""
                  className="w-full h-11 px-6 rounded-full bg-white text-[#1F1F2E] text-xs font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.12)] border-0 outline-none focus:ring-2 focus:ring-black/40 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 px-3">
                  <label className="text-[#1F1F2E] text-[11.5px] font-bold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[#1F1F2E] text-[11px] font-bold hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full h-11 px-6 pr-12 rounded-full bg-white text-neutral-900 text-xs font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.12)] border-0 outline-none focus:ring-2 focus:ring-black/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button & Sign Up switch */}
              <div className="flex flex-col items-start gap-2.5 mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-black hover:bg-neutral-900 active:scale-95 text-white font-extrabold text-xs py-3 px-8 rounded-full shadow-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                  <ArrowRight size={13} />
                </button>

                <div className="text-[11px] font-medium text-white/95 flex flex-col items-start gap-0.5 pl-1">
                  <div className="flex items-center gap-1">
                    <span>Don't have an account?</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (lockedStep) {
                          onToast?.('Navigating to Sign up');
                        } else {
                          setStep('signup');
                        }
                      }}
                      className="font-extrabold text-white underline hover:text-white/80 cursor-pointer"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom-Right Illustration: Girl with round glasses and bun in cozy smiley sweater */}
          <div className="relative z-10 w-full flex justify-end -mr-2 -mb-2 mt-auto pointer-events-none">
            <MangaArtwork
              src={shhGirlGlassesBun}
              alt="Manga girl with glasses and bun leaning in sweater"
              className="w-[225px] sm:w-[245px] max-h-[250px] drop-shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const ShhAuthScreen = ShadowAuthScreen;
