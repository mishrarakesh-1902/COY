'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Heart, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { PublicProfile, SwipeAction } from '@/types';
import { ProfileCard } from './ProfileCard';

interface SwipeCardStackProps {
  profiles: PublicProfile[];
  onSwipe: (profile: PublicProfile, action: SwipeAction) => void;
  isLoading?: boolean;
}

export const SwipeCardStack: React.FC<SwipeCardStackProps> = ({
  profiles,
  onSwipe,
  isLoading = false,
}) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  // Motion values for gesture tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic transforms based on drag offset
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  // Programmatic swipe trigger (via buttons or keyboard)
  const triggerSwipe = useCallback(
    (action: SwipeAction) => {
      if (!currentProfile || animatingId) return;

      setAnimatingId(currentProfile.id);
      setSwipeDirection(action === 'like' ? 'right' : 'left');

      setTimeout(() => {
        onSwipe(currentProfile, action);
        setSwipeDirection(null);
        setAnimatingId(null);
        x.set(0);
        y.set(0);
      }, 240);
    },
    [currentProfile, animatingId, onSwipe, x, y]
  );

  // Drag end handler
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      triggerSwipe('like');
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      triggerSwipe('pass');
    }
  };

  // Keyboard navigation (ArrowLeft = Pass, ArrowRight = Like)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        triggerSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        triggerSwipe('like');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSwipe]);

  if (!currentProfile) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-4 pb-2 relative overflow-hidden">
      {/* Card Arena */}
      <div className="relative w-full flex-1 max-h-[580px] min-h-[440px] flex items-center justify-center">
        {/* Next Card preview beneath top card */}
        {nextProfile && (
          <div
            key={nextProfile.id}
            className="absolute inset-0 transition-all duration-300 transform scale-[0.94] translate-y-3 opacity-60 pointer-events-none"
          >
            <ProfileCard profile={nextProfile} isForeground={false} />
          </div>
        )}

        {/* Top Active Interactive Card */}
        <AnimatePresence>
          <motion.div
            key={currentProfile.id}
            style={{
              x,
              y,
              rotate,
              cursor: 'grab',
            }}
            whileTap={{ cursor: 'grabbing' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
            animate={
              swipeDirection === 'right'
                ? { x: 500, rotate: 25, opacity: 0 }
                : swipeDirection === 'left'
                ? { x: -500, rotate: -25, opacity: 0 }
                : { x: 0, y: 0, rotate: 0, opacity: 1 }
            }
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 w-full h-full z-20 touch-none"
          >
            <ProfileCard profile={currentProfile} isForeground={true} />

            {/* LIKE Visual Stamp Overlay */}
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 left-8 -rotate-12 border-4 border-emerald-400 bg-emerald-950/40 backdrop-blur-sm text-emerald-300 font-black text-2xl tracking-widest px-4 py-1.5 rounded-xl uppercase pointer-events-none shadow-lg z-30 flex items-center gap-1.5"
            >
              <Heart className="w-6 h-6 fill-emerald-400 text-emerald-400" />
              LIKE
            </motion.div>

            {/* NOPE Visual Stamp Overlay */}
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-8 right-8 rotate-12 border-4 border-rose-500 bg-rose-950/40 backdrop-blur-sm text-rose-400 font-black text-2xl tracking-widest px-4 py-1.5 rounded-xl uppercase pointer-events-none shadow-lg z-30 flex items-center gap-1.5"
            >
              <X className="w-6 h-6 text-rose-500 stroke-[3]" />
              PASS
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe Feedback Hints for Desktop & Mobile */}
      <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400 font-medium select-none">
        <span className="flex items-center gap-1">
          <ArrowLeft className="w-3 h-3 text-rose-400" /> Swipe Left to Pass
        </span>
        <span className="flex items-center gap-1">
          Swipe Right to Like <ArrowRight className="w-3 h-3 text-emerald-400" />
        </span>
      </div>

      {/* Desktop & Touch Bottom Action Buttons */}
      <div className="flex items-center justify-center gap-6 pt-3 pb-1 z-30">
        {/* Pass Button */}
        <button
          onClick={() => triggerSwipe('pass')}
          disabled={Boolean(animatingId) || isLoading}
          aria-label="Pass profile"
          className="w-14 h-14 rounded-full bg-slate-900/90 border-2 border-rose-500/60 text-rose-400 flex items-center justify-center shadow-lg hover:bg-rose-500/10 hover:border-rose-400 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 group"
        >
          <X className="w-7 h-7 stroke-[2.5] group-hover:rotate-12 transition-transform" />
        </button>

        {/* Superlike / Sparkle Accent Button */}
        <button
          onClick={() => triggerSwipe('like')}
          disabled={Boolean(animatingId) || isLoading}
          aria-label="Superlike profile"
          className="w-11 h-11 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-md hover:bg-amber-500/10 hover:border-amber-400 hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 fill-amber-400/20" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => triggerSwipe('like')}
          disabled={Boolean(animatingId) || isLoading}
          aria-label="Like profile"
          className="w-14 h-14 rounded-full bg-slate-900/90 border-2 border-emerald-500/60 text-emerald-400 flex items-center justify-center shadow-lg hover:bg-emerald-500/10 hover:border-emerald-400 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 group"
        >
          <Heart className="w-7 h-7 fill-emerald-500/20 stroke-[2.5] group-hover:scale-110 group-hover:fill-emerald-400 transition-all" />
        </button>
      </div>
    </div>
  );
};
