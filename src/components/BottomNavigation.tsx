import React from 'react';
import { Search, Tv, MessageCircle, Home, Bell, Plus } from 'lucide-react';
import { TabType } from './PhoneSimulator';

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isDark: boolean;
  isShrunk?: boolean;
  unreadCount?: number;
  unreadNotificationsCount?: number;
  userAvatarGradient?: string;
}

interface TabItem {
  id: TabType;
  label: string;
  icon: (active: boolean, isShrunk: boolean) => React.ReactNode;
  badge?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  isDark,
  isShrunk = false,
  unreadCount = 2,
  unreadNotificationsCount = 2,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (active, shrunk) => (
        <svg
          viewBox="0 0 24 24"
          className={`${shrunk ? 'w-4 h-4' : 'w-5 h-5'} fill-current transition-transform duration-300`}
        >
          <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        </svg>
      ),
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: (active, shrunk) => (
        <Search
          size={shrunk ? 17 : 21}
          strokeWidth={active ? 2.5 : 2}
          className="transition-transform duration-300"
        />
      ),
    },
    {
      id: 'reels',
      label: 'Reels',
      icon: (active, shrunk) => (
        <div
          className={`${
            shrunk ? 'w-8 h-8' : 'w-10 h-10'
          } rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-300 border border-white/20 ${
            active ? 'scale-110 shadow-[0_4px_16px_rgba(0,0,0,0.8)]' : 'shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:scale-105'
          }`}
          style={{
            background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 50%, #0A0A0A 100%)',
          }}
        >
          <div className="w-5 h-5 rounded-[6px] border-2 border-white flex items-center justify-center p-0.5">
            <div className="w-2 h-2 rounded-full border border-white" />
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      badge: unreadNotificationsCount,
      icon: (active, shrunk) => (
        <div className="relative flex items-center justify-center">
          <Bell
            size={shrunk ? 18 : 22}
            strokeWidth={active ? 2.5 : 2}
            className={`transition-all duration-300 ${
              active
                ? isDark
                  ? 'fill-current text-white'
                  : 'fill-current text-[#111827]'
                : isDark
                ? 'text-[#8E92A4]'
                : 'text-[#8A909E]'
            }`}
          />
        </div>
      ),
    },
    {
      id: 'chat',
      label: 'Chat',
      badge: unreadCount,
      icon: (active, shrunk) => (
        <div className="relative flex items-center justify-center">
          <MessageCircle
            size={shrunk ? 18 : 22}
            strokeWidth={active ? 2.5 : 2}
            className={`transition-all duration-300 ${
              active
                ? isDark
                  ? 'fill-current text-white'
                  : 'fill-current text-[#111827]'
                : isDark
                ? 'text-[#8E92A4]'
                : 'text-[#8A909E]'
            }`}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className={`absolute left-0 right-0 z-30 flex justify-center pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isShrunk ? 'bottom-2 px-5' : 'bottom-3 px-4'
      }`}
    >
      <nav
        className={`pointer-events-auto relative rounded-full flex items-center justify-between p-1.5 transition-all duration-300 select-none backdrop-blur-2xl backdrop-saturate-200 ${
          isShrunk
            ? 'h-11 px-2 w-full max-w-[300px] shadow-xl'
            : 'h-14 px-2.5 w-full max-w-[350px] shadow-2xl'
        } ${
          isDark
            ? 'bg-[#08080C]/95 border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white'
            : 'bg-white/95 border border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] text-[#111827]'
        }`}
      >
        {/* Top Rim Specular Glare */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rounded-full"
        />

        {/* ======================================================== */}
        {/* TAB BUTTONS                                              */}
        {/* ======================================================== */}
        {tabs.map((tab) => {
          const isActive = tab.id === currentTab;
          const isCenterTab = tab.id === 'reels';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 relative flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-[0.88] select-none ${
                isShrunk ? 'h-8 rounded-full' : 'h-11 rounded-[20px]'
              } ${
                isCenterTab
                  ? 'bg-transparent'
                  : isActive
                  ? isDark
                    ? 'text-white'
                    : 'text-[#111827]'
                  : isDark
                  ? 'hover:text-white text-[#8E92A4]'
                  : 'hover:text-[#111827] text-[#8A909E]'
              }`}
              title={tab.label}
              aria-label={tab.label}
              aria-selected={isActive}
            >
              {/* Icon Container */}
              <div
                className={`relative flex items-center justify-center transition-transform duration-200 ${
                  isActive ? 'scale-105' : 'group-hover:scale-105'
                }`}
              >
                {tab.icon(isActive, isShrunk)}

                {/* Badge (Brand purple badge with white text) */}
                {tab.badge && tab.badge > 0 && (
                  <span
                    className={`absolute ${
                      isShrunk
                        ? '-top-1 -right-1 min-w-3.5 h-3.5 px-0.5 text-[8px]'
                        : '-top-1 -right-2 min-w-4 h-4 px-1 text-[9px]'
                    } rounded-full bg-[#1A1A1A] text-white font-black flex items-center justify-center shadow-md leading-none border ${
                      isDark ? 'border-white/20' : 'border-neutral-400'
                    } transition-transform duration-300 ${
                      isActive ? 'scale-90' : 'animate-pulse'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
