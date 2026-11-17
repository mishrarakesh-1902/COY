'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Sparkles, MapPin, Search } from 'lucide-react';
import { MatchRecord } from '@/types';

interface MatchesViewProps {
  matches: MatchRecord[];
  onStartSwiping: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onStartSwiping,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatMatch, setSelectedChatMatch] = useState<MatchRecord | null>(null);

  const filteredMatches = matches.filter((m) =>
    m.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.profile.cityOrCollege.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>Matches</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-pink-600/30 text-pink-400 border border-pink-500/30">
              {matches.length}
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Mutual likes only. Nobody else can see these connections.
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        /* Empty Matches State */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center">
            <Heart className="w-8 h-8 text-pink-400" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">No matches yet</h3>
            <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
              When someone you like on Coy also likes you back, your mutual match will appear here in complete confidence.
            </p>
          </div>
          <button
            onClick={onStartSwiping}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/25 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Profiles Now</span>
          </button>
        </div>
      ) : (
        /* Matches List & Grid */
        <div className="flex-1 flex flex-col pt-3 space-y-4">
          {/* Quick Search */}
          {matches.length > 3 && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search matches or colleges..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          )}

          {/* New Connections Horizontal Scroller */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recent Connections
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {matches.slice(0, 8).map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedChatMatch(match)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
                >
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-amber-400 group-hover:scale-105 transition-transform shadow-md">
                    <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-[#0d101a]">
                      <Image
                        src={match.profile.photo}
                        alt={match.profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 max-w-[64px] truncate text-center">
                    {match.profile.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Matches Cards */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              All Mutual Matches ({filteredMatches.length})
            </h4>

            <div className="space-y-2">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedChatMatch(match)}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-pink-500/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative border border-slate-700 shrink-0">
                      <Image
                        src={match.profile.photo}
                        alt={match.profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-pink-400 transition-colors">
                          {match.profile.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {match.profile.age}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-pink-300/80 mt-0.5">
                        <MapPin className="w-3 h-3 text-pink-400" />
                        <span>{match.profile.cityOrCollege}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                        {match.profile.bio}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChatMatch(match);
                    }}
                    className="w-9 h-9 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shrink-0 ml-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mock Chat Modal when clicking a match */}
      {selectedChatMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-pink-500">
                  <Image
                    src={selectedChatMatch.profile.photo}
                    alt={selectedChatMatch.profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedChatMatch.profile.name}</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Mutual Match • Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChatMatch(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-pink-300">🤫 Confidential Coy Match</p>
              <p className="text-[11px] text-slate-400">
                You both mutually approved each other! Start the conversation naturally.
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedChatMatch.profile.interests.map((interest, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                    #{interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder={`Send a confidential hello to ${selectedChatMatch.profile.name.split(' ')[0]}...`}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => {
                  alert(`Message sent to ${selectedChatMatch.profile.name}!`);
                  setSelectedChatMatch(null);
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md hover:opacity-95 transition-opacity"
              >
                Send Secret Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
