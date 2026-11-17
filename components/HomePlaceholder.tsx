'use client';

import React from 'react';
import { Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface HomePlaceholderProps {
  onGoToDiscover: () => void;
}

export const HomePlaceholder: React.FC<HomePlaceholderProps> = ({ onGoToDiscover }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none space-y-4">
      {/* Blank Home indicator required by assignment specification */}
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
        <Sparkles className="w-6 h-6 text-slate-400" />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-200">Home Tab Placeholder</h2>
        <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
          As specified in Part B of the Coy SDE assignment, the Home tab remains blank and all functionality is built in the Discover tab.
        </p>
      </div>

      <button
        onClick={onGoToDiscover}
        className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/25 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
      >
        <Compass className="w-4 h-4" />
        <span>Open Discover Tab</span>
      </button>

      <div className="mt-4 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 max-w-[280px]">
        <ShieldAlert className="w-4 h-4 text-pink-400 shrink-0" />
        <span>Swiping and matching happens exclusively in Discover</span>
      </div>
    </div>
  );
};
