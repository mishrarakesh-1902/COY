'use client';

import React from 'react';
import { Home, Compass, MessageCircleHeart } from 'lucide-react';

export type NavTab = 'home' | 'discover' | 'matches';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  matchesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  matchesCount,
}) => {
  return (
    <nav className="h-16 px-6 flex items-center justify-around z-30 glass-nav">
      {/* Home Tab (Placeholder as per assignment spec) */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          currentTab === 'home'
            ? 'text-pink-500 scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px] font-semibold tracking-wide">Home</span>
      </button>

      {/* Discover Tab (Core swipe experience) */}
      <button
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
          currentTab === 'discover'
            ? 'text-pink-500 scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Compass className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        </div>
        <span className="text-[11px] font-semibold tracking-wide">Discover</span>
      </button>

      {/* Matches Tab (Mutual matches list) */}
      <button
        onClick={() => onSelectTab('matches')}
        className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
          currentTab === 'matches'
            ? 'text-pink-500 scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <MessageCircleHeart className="w-5 h-5" />
          {matchesCount > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 text-[10px] font-bold rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md animate-bounce">
              {matchesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-semibold tracking-wide">Matches</span>
      </button>
    </nav>
  );
};
