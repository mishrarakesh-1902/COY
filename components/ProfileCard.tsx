'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Info, Sparkles, GraduationCap } from 'lucide-react';
import { PublicProfile } from '@/types';

interface ProfileCardProps {
  profile: PublicProfile;
  isForeground?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isForeground = false,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-2xl bg-slate-900 border border-slate-800/80 select-none">
      {/* Background Profile Photo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={profile.photo}
          alt={profile.name}
          fill
          priority={isForeground}
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover object-center pointer-events-none"
        />
        {/* Cinematic dark gradients for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c14] via-[#0a0c14]/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Top badges */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md text-slate-200 border border-white/10 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>New on Coy</span>
        </span>
      </div>

      {/* Profile Details Container (Bottom) */}
      <div className="absolute bottom-0 inset-x-0 p-5 pt-8 z-10 flex flex-col pointer-events-auto">
        {/* Name and Age */}
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            {profile.name}
          </h2>
          <span className="text-2xl font-semibold text-slate-300 drop-shadow-md">
            {profile.age}
          </span>
        </div>

        {/* College / City Badge */}
        <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-pink-300 drop-shadow">
          {profile.cityOrCollege.toLowerCase().includes('iit') ||
          profile.cityOrCollege.toLowerCase().includes('college') ||
          profile.cityOrCollege.toLowerCase().includes('university') ||
          profile.cityOrCollege.toLowerCase().includes('bits') ||
          profile.cityOrCollege.toLowerCase().includes('nid') ||
          profile.cityOrCollege.toLowerCase().includes('nit') ? (
            <GraduationCap className="w-4 h-4 text-pink-400 shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
          )}
          <span>{profile.cityOrCollege}</span>
        </div>

        {/* Bio */}
        <div className="mt-2.5">
          <p
            onClick={() => setShowFullBio(!showFullBio)}
            className={`text-xs text-slate-200 leading-relaxed cursor-pointer transition-all ${
              showFullBio ? '' : 'line-clamp-2'
            }`}
          >
            {profile.bio}
          </p>
        </div>

        {/* Interests Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/15 backdrop-blur-md text-white border border-white/10 shadow-sm"
            >
              #{interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
