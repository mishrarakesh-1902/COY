'use client';

import React from 'react';
import { Compass, RotateCcw, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  isResetting: boolean;
  onGoToMatches: () => void;
  matchesCount: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onReset,
  isResetting,
  onGoToMatches,
  matchesCount,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-slate-800 border border-pink-500/30 flex items-center justify-center shadow-inner">
          <Compass className="w-10 h-10 text-pink-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">
        You&apos;re All Caught Up!
      </h3>
      <p className="text-xs text-slate-400 mt-2 max-w-[280px] leading-relaxed">
        You have swiped through all available discovery profiles in your area. As new members join, they will appear here.
      </p>

      {matchesCount > 0 && (
        <div className="mt-4 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 w-full max-w-[280px]">
          <p className="text-xs text-pink-300 font-semibold">
            🎉 You made {matchesCount} mutual {matchesCount === 1 ? 'match' : 'matches'}!
          </p>
          <button
            onClick={onGoToMatches}
            className="mt-2 text-xs font-medium text-white underline hover:text-pink-300 transition-colors"
          >
            Open Matches Tab →
          </button>
        </div>
      )}

      {/* Demo helper */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 w-full max-w-[280px] space-y-2">
        <p className="text-[11px] text-slate-400 font-medium">
          Testing or reviewing the assignment?
        </p>
        <button
          onClick={onReset}
          disabled={isResetting}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo Profiles (32 Cards)</span>
        </button>
      </div>
    </div>
  );
};
