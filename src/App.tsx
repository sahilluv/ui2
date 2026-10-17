/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Columns3,
  LayoutGrid,
  Code,
  Moon,
  Sun,
  Sparkles,
  LogIn,
} from 'lucide-react';
import { PhoneSimulator, TabType } from './components/PhoneSimulator';
import { StoryViewerModal } from './components/StoryViewerModal';
import { ExpoCodeViewer } from './components/ExpoCodeViewer';
import { ShadowAuthScreen } from './components/ShadowAuthScreen';
import { ShadowBackgroundDesign } from './components/ShadowBackgroundDesign';
import { StoryItem, INITIAL_STORIES } from './data/mockData';

type AppViewMode = 'single' | 'side-by-side' | 'gallery' | 'code' | 'shadow-auth';

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('shadow-auth');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  const showAppToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleNextStory = () => {
    if (!activeStory) return;
    const currentIndex = INITIAL_STORIES.findIndex((s) => s.id === activeStory.id);
    if (currentIndex < INITIAL_STORIES.length - 1) {
      setActiveStory(INITIAL_STORIES[currentIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrevStory = () => {
    if (!activeStory) return;
    const currentIndex = INITIAL_STORIES.findIndex((s) => s.id === activeStory.id);
    if (currentIndex > 0) {
      setActiveStory(INITIAL_STORIES[currentIndex - 1]);
    } else {
      setActiveStory(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      {/* 1. Global Navigation Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl p-0.5 shadow-md shadow-black/80 flex items-center justify-center shrink-0 bg-neutral-800 border border-neutral-700"
          >
            <div className="w-full h-full rounded-[14px] bg-[#121212] flex items-center justify-center">
              <span className="font-shadow-script text-xl text-white">S</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-shadow-script text-2xl text-white tracking-wide drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
                Shadow
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700 uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                <Sparkles size={10} />
                Stealth Edition
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-neutral-950 border border-white/10 rounded-2xl gap-1">
          <button
            onClick={() => setViewMode('shadow-auth')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'shadow-auth'
                ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Sparkles size={14} className={viewMode === 'shadow-auth' ? 'text-white' : 'text-neutral-400'} />
            <span className="hidden sm:inline">Shadow Auth (3 Screens)</span>
            <span className="sm:hidden">Auth UI</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'single'
                ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Interactive Phone</span>
            <span className="sm:hidden">Single</span>
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Columns3 size={14} />
            <span className="hidden sm:inline">3 App Mockups</span>
            <span className="sm:hidden">3 Phones</span>
          </button>

          <button
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'gallery'
                ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">All 5 Screens Gallery</span>
            <span className="sm:hidden">All 5</span>
          </button>

          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Code size={14} />
            <span className="hidden sm:inline">Monorepo Code</span>
            <span className="sm:hidden">Code</span>
          </button>
        </div>

        {/* Global Brand Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-400 hidden sm:inline">
            Shadow v1.0
          </span>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: SINGLE INTERACTIVE PHONE */}
        {viewMode === 'single' && (
          <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-[#000000]">
            <div className="max-w-md w-full mb-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-semibold">
                <Sparkles size={12} />
                Live Interactive Shadow Experience
              </span>
              <p className="text-[11px] text-neutral-400 mt-1">
                Feed, Stories, Explore, Reels, and Profile in pure Black & Matt Black monochrome stealth.
              </p>

              {/* Quick Tab Jump Chips */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'home', label: 'Feed' },
                  { id: 'explore', label: 'Explore' },
                  { id: 'reels', label: '🎬 Reels' },
                  { id: 'chat', label: 'Messages' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'auth', label: '🔐 Shadow Login' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      currentTab === tab.id
                        ? 'bg-neutral-800 text-white shadow-lg border border-neutral-700 scale-105'
                        : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <PhoneSimulator
              isDark={isDark}
              onToggleTheme={toggleTheme}
              activeTab={currentTab}
              onTabChange={setCurrentTab}
              onSelectStory={setActiveStory}
            />
          </div>
        )}

        {/* VIEW 2: 3 DEVICES SIDE-BY-SIDE (MATCHING SCREENSHOT 1) */}
        {viewMode === 'side-by-side' && (
          <div className="flex-1 overflow-x-auto p-4 sm:p-8 bg-gradient-to-b from-[#000000] via-[#0D0D0D] to-[#000000]">
            <div className="min-w-fit mx-auto flex items-start justify-center gap-6 sm:gap-10 pb-12">
              {/* Phone 1: Feed / Home (Light Mode) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Feed / Home (Matt Black)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="home"
                  onSelectStory={setActiveStory}
                />
              </div>

              {/* Phone 2: Feed / Home (Dark Mode) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Feed / Home (Pure Black)
                </span>
                <PhoneSimulator
                  isDark={true}
                  onToggleTheme={toggleTheme}
                  activeTab="home"
                  onSelectStory={setActiveStory}
                />
              </div>

              {/* Phone 3: Profile Mauricio Lopez (Light Mode) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
                  Profile Mauricio Lopez (Stealth)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="profile"
                  onSelectStory={setActiveStory}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ALL 5 SCREENS GALLERY (MATCHING SCREENSHOTS 1, 2, 3) */}
        {viewMode === 'gallery' && (
          <div className="flex-1 overflow-x-auto p-4 sm:p-8 bg-gradient-to-b from-[#000000] via-[#0D0D0D] to-[#000000]">
            <div className="min-w-fit mx-auto flex items-start justify-center gap-6 sm:gap-8 pb-12">
              {/* Screen 1: Feed Light */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  Feed / Home (Matt Black)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="home"
                  onSelectStory={setActiveStory}
                />
              </div>

              {/* Screen 2: Feed Dark */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  Feed / Home (Pure Black)
                </span>
                <PhoneSimulator
                  isDark={true}
                  onToggleTheme={toggleTheme}
                  activeTab="home"
                  onSelectStory={setActiveStory}
                />
              </div>

              {/* Screen 3: Explore Dark (Screenshot 2) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  Explore / Discover (Stealth)
                </span>
                <PhoneSimulator
                  isDark={true}
                  onToggleTheme={toggleTheme}
                  activeTab="explore"
                  onSelectStory={setActiveStory}
                />
              </div>

              {/* Screen 4: TV Videos Light (Screenshot 3) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  TV / Videos (Stealth)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="reels"
                  onSelectStory={setActiveStory}
                />
              </div>

              {/* Screen 5: Profile Mauricio Lopez Light */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  Profile Mauricio Lopez (Stealth)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="profile"
                  onSelectStory={setActiveStory}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: MONOREPO & EXPO CODE EXPLORER */}
        {viewMode === 'code' && (
          <div className="flex-1 p-4 sm:p-8 bg-black">
            <ExpoCodeViewer />
          </div>
        )}

        {/* VIEW 5: SHADOW AUTH EXPERIENCE (EXACT 3 SCREENS MATCHING REFERENCE IMAGE) */}
        {viewMode === 'shadow-auth' && (
          <div
            className="relative flex-1 overflow-x-auto p-4 sm:p-8 min-h-[calc(100vh-4rem)] flex flex-col justify-start"
            style={{
              background: 'linear-gradient(180deg, #000000 0%, #0D0D0D 100%)',
            }}
          >
            {/* Atmospheric Celestial Presentation Backdrop in monochrome */}
            <ShadowBackgroundDesign screenType="presentation" />

            <div className="relative z-10 max-w-4xl mx-auto mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-white text-xs font-bold shadow-lg">
                <Sparkles size={13} className="text-neutral-300" />
                Shadow Authentication Experience • 3 Side-by-Side Screens
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight drop-shadow-md">
                Welcome, Sign Up, and Log In Screens
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-lg mx-auto font-medium drop-shadow-sm">
                Monochrome Black & Matt Black canvas, handwritten cursive Shadow wordmark, stealth input surfaces, and pen-and-ink manga illustrations.
              </p>

              {/* Controls bar: Navigation and simulator links */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => {
                    setViewMode('single');
                    setCurrentTab('auth');
                    showAppToast('Switched to Single Interactive Phone');
                  }}
                  className="px-4 py-1.5 rounded-full bg-black hover:bg-neutral-900 active:scale-95 text-white text-xs font-black shadow-xl flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
                >
                  <Smartphone size={13} />
                  <span>Test Single Interactive Phone</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('single');
                    setCurrentTab('home');
                    showAppToast('Opening Shadow Feed');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span>Explore Shadow App →</span>
                </button>
              </div>
            </div>

            <div className="relative z-10 min-w-fit mx-auto flex items-start justify-center gap-6 sm:gap-8 pb-12">
              {/* Screen 1: Welcome To Shadow */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-bold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                  Screen 1: Welcome to Shadow
                </span>
                <div className="w-[360px] h-[740px] rounded-[46px] border-[8px] border-[#181818] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col bg-[#000000] relative">
                  <ShadowAuthScreen
                    lockedStep="welcome"
                    showStatusBar={true}
                    brandName="Shadow"
                    onToast={showAppToast}
                    onAuthSuccess={(user) => {
                      showAppToast(`Welcome to Shadow! Signed in as @${user.username} 🎉`);
                    }}
                  />
                </div>
              </div>

              {/* Screen 2: Sign up to Shadow */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-bold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                  Screen 2: Sign up to Shadow!
                </span>
                <div className="w-[360px] h-[740px] rounded-[46px] border-[8px] border-[#181818] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col bg-[#000000] relative">
                  <ShadowAuthScreen
                    lockedStep="signup"
                    showStatusBar={true}
                    brandName="Shadow"
                    onToast={showAppToast}
                    onAuthSuccess={(user) => {
                      showAppToast(`Account created! Welcome to Shadow, @${user.username} ✨`);
                    }}
                  />
                </div>
              </div>

              {/* Screen 3: Log in to Shadow */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-bold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-neutral-300" />
                  Screen 3: Log in to Shadow!
                </span>
                <div className="w-[360px] h-[740px] rounded-[46px] border-[8px] border-[#181818] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col bg-[#000000] relative">
                  <ShadowAuthScreen
                    lockedStep="login"
                    showStatusBar={true}
                    brandName="Shadow"
                    onToast={showAppToast}
                    onAuthSuccess={(user) => {
                      showAppToast(`Welcome back to Shadow, @${user.username} 🚀`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-black/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={14} className="text-white animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Interactive Fullscreen Story Viewer Modal */}
      <StoryViewerModal
        story={activeStory}
        stories={INITIAL_STORIES}
        onClose={() => setActiveStory(null)}
        onNext={handleNextStory}
        onPrev={handlePrevStory}
      />
    </div>
  );
}
