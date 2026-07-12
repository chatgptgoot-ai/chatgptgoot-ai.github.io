import React from 'react';
import { Sparkles, Trophy, CheckCircle, Flame, MapPin } from 'lucide-react';
import { CampusProfile } from '../types';

interface ProfileCardProps {
  profile: CampusProfile;
  onSelect: (profile: CampusProfile) => void;
  onOpenVoteModal: (profile: CampusProfile) => void;
  rankPosition?: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSelect,
  onOpenVoteModal,
  rankPosition
}) => {
  const categories: { key: keyof CampusProfile['ratings']; label: string }[] = [
    { key: 'style', label: 'Style' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'creativity', label: 'Creativity' },
    { key: 'humor', label: 'Humor' },
    { key: 'kindness', label: 'Kindness' },
    { key: 'charisma', label: 'Charisma' },
  ];

  return (
    <div className="group glass-panel rounded-3xl p-5 glass-panel-hover flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      
      {/* Background ambient gradient glow on hover */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5B7FFF]/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#8A5BFF]/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Top Header Section with Image & Rank Badge */}
        <div className="relative mb-4 cursor-pointer" onClick={() => onSelect(profile)}>
          <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />

            {/* Rank Position Pill */}
            {typeof rankPosition === 'number' && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505]/80 backdrop-blur-md border border-white/15 text-xs font-black tracking-wide text-white shadow-lg">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>#{rankPosition}</span>
              </div>
            )}

            {/* Trending / Verified Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
              {profile.isTrending && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold shadow-md backdrop-blur-md animate-pulse">
                  <Flame className="w-3 h-3 text-amber-400" /> Trending
                </span>
              )}
              {profile.isVerified && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5B7FFF]/20 border border-[#5B7FFF]/40 text-[#A5B4FC] text-[11px] font-bold shadow-md backdrop-blur-md">
                  <CheckCircle className="w-3 h-3 text-[#5B7FFF]" /> Verified
                </span>
              )}
            </div>

            {/* Bottom Avatar Overlay Info */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  {profile.name}
                </h3>
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#5B7FFF]" /> {profile.campus}
                </p>
              </div>

              {/* Overall Circular/Hex Score Badge */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B7FFF] via-[#8A5BFF] to-[#A5B4FC] p-[2px] shadow-xl shrink-0">
                <div className="w-full h-full bg-[#050505]/90 rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-sm font-black gradient-text leading-none">
                    {profile.overallScore.toFixed(1)}
                  </span>
                  <span className="text-[8px] uppercase tracking-tighter text-slate-400 font-bold mt-0.5">
                    AVG
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Major Preview */}
        <div className="mb-4 cursor-pointer" onClick={() => onSelect(profile)}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
              {profile.major}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Class of '{String(profile.graduationYear).slice(-2)}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
            {profile.bio}
          </p>
        </div>

        {/* Rating Bars Preview (Top 3 or Highlights) */}
        <div className="space-y-2 mb-5">
          {categories.slice(0, 3).map((cat) => {
            const score = profile.ratings[cat.key] || 0;
            const percentage = Math.min((score / 10) * 100, 100);
            return (
              <div key={cat.key} className="text-xs space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-medium text-[11px]">{cat.label}</span>
                  <span className="font-bold text-slate-200 text-xs">{score.toFixed(1)} / 10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#5B7FFF] to-[#8A5BFF] rating-bar-transition"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2.5">
        <button
          onClick={() => onSelect(profile)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Profile</span>
        </button>
        <button
          onClick={() => onOpenVoteModal(profile)}
          className="flex-1 py-2.5 px-3 rounded-xl glass-button-primary text-xs font-extrabold text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#5B7FFF]/20"
          aria-label={`Leave feedback for ${profile.name}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '6s' }} />
          <span>Rate & Boost</span>
        </button>
      </div>

    </div>
  );
};
