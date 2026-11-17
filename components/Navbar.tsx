'use client';

import React from 'react';
import { Flame, RotateCcw, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  remainingCount: number;
  onReset: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ remainingCount, onReset, isResetting }) => {
  return (
    <header className="h-14 px-4 flex items-center justify-between z-20 border-b border-slate-800/80 bg-[#0d101a]/90 backdrop-blur-md">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Flame className="w-5 h-5 text-white fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-amber-200 bg-clip-text text-transparent">
            coy
          </span>
        </div>
      </div>

      {/* Privacy guarantee badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-[11px] font-medium text-slate-300">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>100% Confidential</span>
      </div>

      {/* Demo Reset Button */}
      <button
        onClick={onReset}
        disabled={isResetting}
        title="Reset demo feed to initial 32 profiles"
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800/80 transition-colors disabled:opacity-50"
      >
        <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
        <span className="hidden xs:inline">Reset</span>
      </button>
    </header>
  );
};
