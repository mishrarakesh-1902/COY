'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PublicProfile, MatchRecord, SwipeAction, SwipeResponse } from '@/types';
import { Navbar } from '@/components/Navbar';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { SwipeCardStack } from '@/components/SwipeCardStack';
import { MatchModal } from '@/components/MatchModal';
import { MatchesView } from '@/components/MatchesView';
import { EmptyState } from '@/components/EmptyState';
import { HomePlaceholder } from '@/components/HomePlaceholder';
import { Loader2 } from 'lucide-react';

export default function CoyDiscoverApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('discover');
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [newMatch, setNewMatch] = useState<PublicProfile | null>(null);

  // Fetch feed and matches from backend
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [feedRes, matchesRes] = await Promise.all([
        fetch('/api/feed'),
        fetch('/api/matches'),
      ]);

      const feedData = await feedRes.json();
      const matchesData = await matchesRes.json();

      if (feedData.success && Array.isArray(feedData.profiles)) {
        setProfiles(feedData.profiles);
      }
      if (matchesData.success && Array.isArray(matchesData.matches)) {
        setMatches(matchesData.matches);
      }
    } catch (err) {
      console.error('Failed to load Coy data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Swipe Action (Like or Pass)
  const handleSwipe = async (profile: PublicProfile, action: SwipeAction) => {
    // Optimistically remove card from local stack
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          action,
        }),
      });

      const data: SwipeResponse = await res.json();

      if (data.success && data.match && data.matchedProfile) {
        // Trigger celebratory match modal!
        setNewMatch(data.matchedProfile);
        // Refresh matches list
        const matchesRes = await fetch('/api/matches');
        const matchesData = await matchesRes.json();
        if (matchesData.success) {
          setMatches(matchesData.matches);
        }
      }
    } catch (err) {
      console.error('Error posting swipe to server:', err);
    }
  };

  // Reset feed for testing & evaluation
  const handleReset = async () => {
    try {
      setIsResetting(true);
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        setCurrentTab('discover');
      }
    } catch (err) {
      console.error('Error resetting demo feed:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Top Header */}
      <Navbar
        remainingCount={profiles.length}
        onReset={handleReset}
        isResetting={isResetting}
      />

      {/* Main Content Area based on Selected Tab */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <p className="text-xs">Connecting to Coy discovery feed...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePlaceholder onGoToDiscover={() => setCurrentTab('discover')} />
            )}

            {currentTab === 'discover' && (
              profiles.length > 0 ? (
                <SwipeCardStack
                  profiles={profiles}
                  onSwipe={handleSwipe}
                  isLoading={isResetting}
                />
              ) : (
                <EmptyState
                  onReset={handleReset}
                  isResetting={isResetting}
                  onGoToMatches={() => setCurrentTab('matches')}
                  matchesCount={matches.length}
                />
              )
            )}

            {currentTab === 'matches' && (
              <MatchesView
                matches={matches}
                onStartSwiping={() => setCurrentTab('discover')}
              />
            )}
          </>
        )}
      </main>

      {/* Celebratory Match Modal */}
      <MatchModal
        matchedProfile={newMatch}
        onClose={() => setNewMatch(null)}
        onGoToMatches={() => {
          setNewMatch(null);
          setCurrentTab('matches');
        }}
      />

      {/* Bottom Tab Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        matchesCount={matches.length}
      />
    </div>
  );
}
