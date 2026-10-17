import React from 'react';
import { PhoneSimulator, TabType } from './PhoneSimulator';
import { StoryItem } from '../data/mockData';

interface ConceptOverviewProps {
  onSelectStory: (story: StoryItem) => void;
  onFocusDevice?: (tab: TabType, isDark: boolean) => void;
}

export const ConceptOverview: React.FC<ConceptOverviewProps> = ({
  onSelectStory,
  onFocusDevice,
}) => {
  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-8 flex flex-col items-center justify-center bg-black">
      {/* Title & Concept Header */}
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Shadow — Concept UI
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium max-w-lg mx-auto leading-relaxed">
          Feed, explore, and profile in stealth black and matt black modes. All screens are interactive: tap stories, tabs, follow button, and likes.
        </p>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="w-full max-w-7xl flex flex-col items-center gap-12">
        {/* Row 1: Center Top - Dark Mode Explore */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] font-semibold text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Explore / Discover (Dark Mode)
          </div>
          <div className="transform hover:scale-[1.01] transition-transform duration-300">
            <PhoneSimulator
              isDark={true}
              onToggleTheme={() => {}}
              activeTab="explore"
              onSelectStory={onSelectStory}
              standalone={false}
            />
          </div>
        </div>

        {/* Row 2: Side-by-Side arrangement */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center items-start">
          {/* Left Column: Light Mode Feed */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] font-semibold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              Feed / Home (Matt Black Mode)
            </div>
            <div className="transform hover:scale-[1.01] transition-transform duration-300">
              <PhoneSimulator
                isDark={false}
                onToggleTheme={() => {}}
                activeTab="home"
                onSelectStory={onSelectStory}
                standalone={false}
              />
            </div>
          </div>

          {/* Center Column: Dark Mode Feed */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] font-semibold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-white" />
              Feed / Home (Pure Black Mode)
            </div>
            <div className="transform hover:scale-[1.01] transition-transform duration-300">
              <PhoneSimulator
                isDark={true}
                onToggleTheme={() => {}}
                activeTab="home"
                onSelectStory={onSelectStory}
                standalone={false}
              />
            </div>
          </div>

          {/* Right Column: Light Mode Profile */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] font-semibold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              Profile Mauricio Lopez
            </div>
            <div className="transform hover:scale-[1.01] transition-transform duration-300">
              <PhoneSimulator
                isDark={false}
                onToggleTheme={() => {}}
                activeTab="profile"
                onSelectStory={onSelectStory}
                standalone={false}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Reels UI */}
        <div className="flex flex-col items-center mt-6">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] font-semibold text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-white" />
            Reels Section (Eliott Johnson & Christian Lue)
          </div>
          <div className="transform hover:scale-[1.01] transition-transform duration-300">
            <PhoneSimulator
              isDark={false}
              onToggleTheme={() => {}}
              activeTab="reels"
              onSelectStory={onSelectStory}
              standalone={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
