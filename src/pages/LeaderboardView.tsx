import React, { useState } from 'react';
import { Trophy, Flame, Search, ArrowUpRight } from 'lucide-react';
import { CampusProfile, LeaderboardTimeframe, LeaderboardCategory } from '../types';
import { filterLeaderboard } from '../firebase/service';

interface LeaderboardViewProps {
  profiles: CampusProfile[];
  onSelectProfile: (profile: CampusProfile) => void;
  onOpenVoteModal: (profile: CampusProfile) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  profiles,
  onSelectProfile,
  onOpenVoteModal
}) => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all');
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  const [searchQuery, setSearchQuery] = useState('');

  const rankedProfiles = filterLeaderboard(profiles, timeframe, category, searchQuery);

  const timeframes: { id: LeaderboardTimeframe; label: string }[] = [
    { id: 'today', label: '🔥 Today' },
    { id: 'week', label: '⚡️ This Week' },
    { id: 'month', label: '📅 This Month' },
    { id: 'all', label: '👑 All Time' },
  ];

  const categories: { id: LeaderboardCategory; label: string }[] = [
    { id: 'overall', label: 'Overall Champion' },
    { id: 'style', label: 'Style' },
    { id: 'confidence', label: 'Confidence' },
    { id: 'creativity', label: 'Creativity' },
    { id: 'humor', label: 'Humor' },
    { id: 'kindness', label: 'Kindness' },
    { id: 'charisma', label: 'Charisma' },
  ];

  // Top 3 Podium
  const podium = rankedProfiles.slice(0, 3);
  const remaining = rankedProfiles.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-10 animate-fadeIn">
      
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300 shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Real-time 60fps Campus Standings</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Campus <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Ranked by positive peer evaluations across universities. Switch between categories or timeframes to discover standout students.
        </p>
      </div>

      {/* Timeframe & Category Selector Bar */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6">
        
        {/* Timeframe Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/[0.08] pb-5">
          {timeframes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                timeframe === t.id
                  ? 'bg-gradient-to-r from-[#5B7FFF] to-[#8A5BFF] text-white shadow-lg shadow-[#5B7FFF]/25 scale-105'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category Tabs & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  category === c.id
                    ? 'bg-white/15 text-white border border-white/30 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leader..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>
        </div>

      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      {podium.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* #2 Silver (Left) */}
          {podium[1] && (
            <div className="md:order-1 glass-panel rounded-3xl p-6 border border-slate-400/20 bg-gradient-to-t from-slate-900/40 via-[#101010] to-transparent flex flex-col justify-between hover:scale-[1.02] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-300/20 border border-slate-300/40 text-slate-200 flex items-center gap-1">
                    🥈 #2 Spot
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{podium[1].campus}</span>
                </div>
                <div className="text-center space-y-3 cursor-pointer" onClick={() => onSelectProfile(podium[1])}>
                  <img
                    src={podium[1].avatar}
                    alt={podium[1].name}
                    className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-slate-300/40 shadow-xl"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white">{podium[1].name}</h3>
                    <p className="text-xs text-slate-400">{podium[1].major}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] inline-block">
                    <span className="text-2xl font-black gradient-text">
                      {category === 'overall' 
                        ? podium[1].overallScore.toFixed(1) 
                        : (podium[1].ratings[category as keyof CampusProfile['ratings']] || 0).toFixed(1)}
                    </span>
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Score</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenVoteModal(podium[1])}
                className="w-full mt-6 py-2.5 rounded-xl glass-button-primary text-xs font-extrabold text-white"
              >
                Rate + Boost
              </button>
            </div>
          )}

          {/* #1 Gold Crown (Center - Highest) */}
          {podium[0] && (
            <div className="md:order-2 glass-panel rounded-3xl p-8 border border-amber-400/40 bg-gradient-to-t from-amber-950/20 via-[#101010] to-transparent flex flex-col justify-between shadow-2xl shadow-amber-500/10 scale-105 z-10">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center gap-1 shadow-md animate-pulse">
                    👑 #1 Champion
                  </span>
                  <span className="text-xs font-bold text-amber-400">{podium[0].campus}</span>
                </div>
                <div className="text-center space-y-3 cursor-pointer" onClick={() => onSelectProfile(podium[0])}>
                  <div className="relative w-28 h-28 mx-auto">
                    <img
                      src={podium[0].avatar}
                      alt={podium[0].name}
                      className="w-full h-full rounded-full object-cover border-4 border-amber-400 shadow-2xl"
                    />
                    <div className="absolute -bottom-2 right-0 p-1.5 rounded-full bg-amber-400 text-[#050505] shadow-lg">
                      <Flame className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{podium[0].name}</h3>
                    <p className="text-xs text-slate-300 font-medium">{podium[0].major}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 inline-block">
                    <span className="text-3xl font-black text-amber-300">
                      {category === 'overall' 
                        ? podium[0].overallScore.toFixed(1) 
                        : (podium[0].ratings[category as keyof CampusProfile['ratings']] || 0).toFixed(1)}
                    </span>
                    <span className="text-[10px] uppercase text-amber-400 block font-bold mt-0.5">Top Leader Score</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenVoteModal(podium[0])}
                className="w-full mt-6 py-3 rounded-xl glass-button-primary text-sm font-black text-white shadow-xl"
              >
                Boost Champion ✨
              </button>
            </div>
          )}

          {/* #3 Bronze (Right) */}
          {podium[2] && (
            <div className="md:order-3 glass-panel rounded-3xl p-6 border border-amber-700/20 bg-gradient-to-t from-amber-900/10 via-[#101010] to-transparent flex flex-col justify-between hover:scale-[1.02] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-800/20 border border-amber-700/40 text-amber-500 flex items-center gap-1">
                    🥉 #3 Spot
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{podium[2].campus}</span>
                </div>
                <div className="text-center space-y-3 cursor-pointer" onClick={() => onSelectProfile(podium[2])}>
                  <img
                    src={podium[2].avatar}
                    alt={podium[2].name}
                    className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-amber-700/40 shadow-xl"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white">{podium[2].name}</h3>
                    <p className="text-xs text-slate-400">{podium[2].major}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] inline-block">
                    <span className="text-2xl font-black gradient-text">
                      {category === 'overall' 
                        ? podium[2].overallScore.toFixed(1) 
                        : (podium[2].ratings[category as keyof CampusProfile['ratings']] || 0).toFixed(1)}
                    </span>
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Score</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenVoteModal(podium[2])}
                className="w-full mt-6 py-2.5 rounded-xl glass-button-primary text-xs font-extrabold text-white"
              >
                Rate + Boost
              </button>
            </div>
          )}

        </div>
      )}

      {/* REMAINING LEADERBOARD TABLE (#4 and beyond) */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Standings (#4 — #{rankedProfiles.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Total {rankedProfiles.length} Students Ranked</span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {remaining.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              All currently visible students are on the podium above or no additional results match your query!
            </div>
          ) : (
            remaining.map((user, idx) => {
              const rankNum = idx + 4;
              const displayScore = category === 'overall'
                ? user.overallScore
                : (user.ratings[category as keyof CampusProfile['ratings']] || 0);

              return (
                <div
                  key={user.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="flex items-center gap-4 sm:gap-6 cursor-pointer flex-1" onClick={() => onSelectProfile(user)}>
                    <span className="w-8 text-center text-sm sm:text-base font-black text-slate-400 group-hover:text-[#8A5BFF]">
                      #{rankNum}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/15 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#A5B4FC] transition-colors flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {user.isTrending && <Flame className="w-3.5 h-3.5 text-amber-400 inline" />}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {user.major} @ <span className="text-slate-300 font-semibold">{user.campus}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black gradient-text">
                        {displayScore.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {user.totalVotes} votes
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenVoteModal(user)}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#5B7FFF] border border-white/10 hover:border-[#5B7FFF] text-xs font-bold text-white transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>Rate</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
