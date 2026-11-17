'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { PublicProfile } from '@/types';

interface MatchModalProps {
  matchedProfile: PublicProfile | null;
  onClose: () => void;
  onGoToMatches: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  matchedProfile,
  onClose,
  onGoToMatches,
}) => {
  useEffect(() => {
    if (matchedProfile) {
      // Trigger festive confetti explosion
      const end = Date.now() + 1500;
      const colors = ['#FF3366', '#FF4D80', '#00E096', '#FFD700', '#A855F7'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-[#1b172a] via-[#121422] to-[#0c0d18] border border-pink-500/30 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Glowing ambient background orbs */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          {/* Sparkle badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Mutual Connection</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            It&apos;s a Match!
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-[240px]">
            You and <span className="text-white font-semibold">{matchedProfile.name}</span> secretly liked each other on Coy!
          </p>

          {/* Interlocking Avatars with Heart Pulse */}
          <div className="relative flex items-center justify-center my-6">
            {/* Logged in User Avatar */}
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-purple-600 shadow-xl relative z-10 -mr-4">
              <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-slate-900 bg-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
                  alt="You"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Matched User Avatar */}
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-400 to-pink-500 shadow-xl relative z-0">
              <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-slate-900 bg-slate-800">
                <Image
                  src={matchedProfile.photo}
                  alt={matchedProfile.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Pulsing Center Heart */}
            <div className="absolute z-20 w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
          </div>

          {/* Profile snippet */}
          <div className="text-xs text-slate-400 mb-6">
            <span className="text-slate-200 font-medium">{matchedProfile.name}, {matchedProfile.age}</span> • {matchedProfile.cityOrCollege}
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2.5">
            <button
              onClick={onGoToMatches}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-95 text-white shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Say Hello in Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
