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
  const [viewMode, setViewMode] = useState<AppViewMode>('single');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);

  const showAppToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handlePublishStory = (newStoryData: {
    gradient: string;
    imageUrl?: string;
    caption?: string;
    sticker?: string;
    musicTrack?: string;
    locationName?: string;
  }) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.isCurrentUser) {
          return {
            ...s,
            gradient: newStoryData.gradient,
            storyImageUrl: newStoryData.imageUrl,
            storyCaption: newStoryData.caption,
            storySticker: newStoryData.sticker,
            storyTimestamp: 'Just now',
            hasUnseen: true,
          };
        }
        return s;
      })
    );
    showAppToast('New 24-hour story published! ✨');
  };

  const handleNextStory = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex((s) => s.id === activeStory.id);
    if (currentIndex < stories.length - 1) {
      setActiveStory(stories[currentIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrevStory = () => {
    if (!activeStory) return;
    const currentIndex = stories.findIndex((s) => s.id === activeStory.id);
    if (currentIndex > 0) {
      setActiveStory(stories[currentIndex - 1]);
    } else {
      setActiveStory(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E1E4E8] text-[#202024]">
      {/* 1. Global Navigation Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-[#E1E4E9] bg-white/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl p-0.5 shadow-sm flex items-center justify-center shrink-0 border border-[#E1E4E9]"
            style={{
              background: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 40%, #8A2BE2 100%)',
            }}
          >
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
              <span className="font-shadow-script text-xl text-[#202024]">S</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-shadow-script text-2xl text-[#202024] tracking-wide">
                Shadow
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F3F6] text-[#777982] border border-[#E1E4E9] uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                <Sparkles size={10} className="text-[#FF0A78]" />
                Reference Colors
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-[#F1F3F6] border border-[#E1E4E9] rounded-2xl gap-1">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white text-[#202024] shadow-sm border border-[#E1E4E9]'
                : 'text-[#777982] hover:text-[#202024] hover:bg-white/60'
            }`}
          >
            <Columns3 size={14} className={viewMode === 'side-by-side' ? 'text-[#FF0A78]' : ''} />
            <span className="hidden sm:inline">3 App Mockups</span>
            <span className="sm:hidden">3 Phones</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'single'
                ? 'bg-white text-[#202024] shadow-sm border border-[#E1E4E9]'
                : 'text-[#777982] hover:text-[#202024] hover:bg-white/60'
            }`}
          >
            <Smartphone size={14} className={viewMode === 'single' ? 'text-[#FF0A78]' : ''} />
            <span className="hidden sm:inline">Interactive Phone</span>
            <span className="sm:hidden">Single</span>
          </button>

          <button
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'gallery'
                ? 'bg-white text-[#202024] shadow-sm border border-[#E1E4E9]'
                : 'text-[#777982] hover:text-[#202024] hover:bg-white/60'
            }`}
          >
            <LayoutGrid size={14} className={viewMode === 'gallery' ? 'text-[#FF0A78]' : ''} />
            <span className="hidden sm:inline">All 5 Screens Gallery</span>
            <span className="sm:hidden">All 5</span>
          </button>

          <button
            onClick={() => setViewMode('shadow-auth')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'shadow-auth'
                ? 'bg-white text-[#202024] shadow-sm border border-[#E1E4E9]'
                : 'text-[#777982] hover:text-[#202024] hover:bg-white/60'
            }`}
          >
            <Sparkles size={14} className={viewMode === 'shadow-auth' ? 'text-[#FF0A78]' : ''} />
            <span className="hidden sm:inline">Shadow Auth (3 Screens)</span>
            <span className="sm:hidden">Auth UI</span>
          </button>

          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-white text-[#202024] shadow-sm border border-[#E1E4E9]'
                : 'text-[#777982] hover:text-[#202024] hover:bg-white/60'
            }`}
          >
            <Code size={14} />
            <span className="hidden sm:inline">Monorepo Code</span>
            <span className="sm:hidden">Code</span>
          </button>
        </div>

        {/* Global Brand Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#777982] hidden sm:inline">
            Shadow v1.0
          </span>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: SINGLE INTERACTIVE PHONE */}
        {viewMode === 'single' && (
          <div className="relative flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-[#E1E4E8] overflow-hidden">
            <ShadowBackgroundDesign screenType="presentation" />
            <div className="relative z-10 max-w-md w-full mb-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E1E4E9] text-[#202024] text-xs font-semibold shadow-xs">
                <Sparkles size={12} className="text-[#FF0A78]" />
                Live Interactive Shadow Experience
              </span>
              <p className="text-[11px] text-[#777982] mt-1">
                Feed, Stories, Explore, Reels, and Profile in reference light and dark palettes.
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
                        ? 'bg-[#FF0A78] text-white shadow-md scale-105'
                        : 'bg-white/80 text-[#777982] hover:text-[#202024] hover:bg-white border border-[#E1E4E9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <PhoneSimulator
                isDark={isDark}
                onToggleTheme={toggleTheme}
                activeTab={currentTab}
                onTabChange={setCurrentTab}
                onSelectStory={setActiveStory}
                stories={stories}
                onPublishStory={handlePublishStory}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: 3 DEVICES SIDE-BY-SIDE (EXACT MATCH TO REFERENCE IMAGE) */}
        {viewMode === 'side-by-side' && (
          <div className="relative flex-1 overflow-x-auto p-4 sm:p-8 bg-[#E1E4E8] min-h-[calc(100vh-4rem)] flex flex-col justify-center">
            <ShadowBackgroundDesign screenType="presentation" />
            <div className="relative z-10 min-w-fit mx-auto flex items-start justify-center gap-6 sm:gap-10 pb-12">
              {/* Phone 1: Feed / Home (Light Mode - Left Phone in Reference) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E1E4E9] text-[#202024] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#FF0A78] animate-pulse" />
                  Feed / Home (Light)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="home"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
                />
              </div>

              {/* Phone 2: Explore / Populares (Dark Mode - Center Phone in Reference) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#151517]/95 backdrop-blur-md border border-[#38383D] text-[#F7F7F9] text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#FF0A78] animate-pulse" />
                  Explore / Populares (Dark)
                </span>
                <PhoneSimulator
                  isDark={true}
                  onToggleTheme={toggleTheme}
                  activeTab="explore"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
                />
              </div>

              {/* Phone 3: Profile Mauricio Lopez (Light Mode - Right Phone in Reference) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E1E4E9] text-[#202024] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#8A2BE2] animate-pulse" />
                  Profile Mauricio Lopez (Light)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="profile"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ALL 5 SCREENS GALLERY (MATCHING SCREENSHOTS 1, 2, 3) */}
        {viewMode === 'gallery' && (
          <div className="relative flex-1 overflow-x-auto p-4 sm:p-8 bg-[#E1E4E8]">
            <ShadowBackgroundDesign screenType="presentation" />
            <div className="relative z-10 min-w-fit mx-auto flex items-start justify-center gap-6 sm:gap-8 pb-12">
              {/* Screen 1: Feed Light */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E1E4E9] text-[#202024] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#FF0A78]" />
                  Feed / Home (Light)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="home"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
                />
              </div>

              {/* Screen 2: Feed Dark */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#151517]/95 backdrop-blur-md border border-[#38383D] text-[#F7F7F9] text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#FF0A78]" />
                  Feed / Home (Dark)
                </span>
                <PhoneSimulator
                  isDark={true}
                  onToggleTheme={toggleTheme}
                  activeTab="home"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
                />
              </div>

              {/* Screen 3: Explore Dark (Screenshot 2) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#151517]/95 backdrop-blur-md border border-[#38383D] text-[#F7F7F9] text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#FF0A78]" />
                  Explore / Discover (Dark)
                </span>
                <PhoneSimulator
                  isDark={true}
                  onToggleTheme={toggleTheme}
                  activeTab="explore"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
                />
              </div>

              {/* Screen 4: TV Videos Light (Screenshot 3) */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E1E4E9] text-[#202024] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#FF0A78]" />
                  TV / Reels (Light)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="reels"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
                />
              </div>

              {/* Screen 5: Profile Mauricio Lopez Light */}
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E1E4E9] text-[#202024] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#8A2BE2]" />
                  Profile Mauricio Lopez (Light)
                </span>
                <PhoneSimulator
                  isDark={false}
                  onToggleTheme={toggleTheme}
                  activeTab="profile"
                  onSelectStory={setActiveStory}
                  stories={stories}
                  onPublishStory={handlePublishStory}
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
        stories={stories}
        onClose={() => setActiveStory(null)}
        onNext={handleNextStory}
        onPrev={handlePrevStory}
      />
    </div>
  );
}
