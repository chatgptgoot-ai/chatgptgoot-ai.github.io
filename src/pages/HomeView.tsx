import React from 'react';
import { Sparkles, Trophy, Flame, PlusCircle, TrendingUp, Users, Heart, ArrowRight, Zap, Award } from 'lucide-react';
import { CampusProfile, ActivityEvent, SiteStatistics, PageView } from '../types';
import { ProfileCard } from '../components/ProfileCard';

interface HomeViewProps {
  profiles: CampusProfile[];
  activities: ActivityEvent[];
  stats: SiteStatistics | null;
  onSelectProfile: (profile: CampusProfile) => void;
  onOpenVoteModal: (profile: CampusProfile) => void;
  onNavigate: (view: PageView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profiles,
  activities,
  stats,
  onSelectProfile,
  onOpenVoteModal,
  onNavigate
}) => {
  // Get top 3 leaderboard podium
  const topThree = [...profiles].sort((a, b) => b.overallScore - a.overallScore || b.totalVotes - a.totalVotes).slice(0, 3);
  
  // Get 3 random or trending profiles to showcase
  const trendingProfiles = profiles.filter(p => p.isTrending).slice(0, 3);
  const displayProfiles = trendingProfiles.length >= 3 ? trendingProfiles : profiles.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION WITH ANIMATED BACKGROUND */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Floating Ambient Mesh Orbs */}
        <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#5B7FFF]/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div className="absolute top-24 right-1/4 translate-x-1/2 w-96 h-96 bg-[#8A5BFF]/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '3s' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold text-slate-300 shadow-xl backdrop-blur-xl animate-float">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B7FFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8A5BFF]"></span>
            </span>
            <span>The #1 Glassmorphic Campus Recognition Platform</span>
            <span className="text-[#A5B4FC]">60fps</span>
          </div>

          {/* Main Startup Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Celebrate Campus <br className="hidden sm:inline" />
            <span className="gradient-text">Style, Confidence & Charisma.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Where university students showcase their presence, receive respectful multi-category peer feedback, and climb the live 60fps campus leaderboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('explore')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-button-primary text-base font-extrabold text-white shadow-xl flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>Explore Campus Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('create')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-base font-bold text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 border border-white/15 shadow-lg"
            >
              <PlusCircle className="w-5 h-5 text-[#8A5BFF]" />
              <span>Upload Your Profile</span>
            </button>
          </div>

          {/* Mini Trust Badges below Hero */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-slate-400 font-medium border-t border-white/10">
            <div className="flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Exact 60fps Animations
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" /> Respectful Feedback Only
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4 text-[#5B7FFF]" /> Verified Campus IDs
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8A5BFF]" /> GitHub Pages Ready
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE STATISTICS & ANIMATED COUNTERS */}
      {stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              
              <div className="flex flex-col items-center justify-center text-center p-2">
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-1">
                  {stats.totalProfiles}
                  <span className="text-[#5B7FFF]">+</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2 flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#5B7FFF]" /> Active Campus Profiles
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center p-2 pt-6 lg:pt-2">
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-1">
                  {stats.totalVotes.toLocaleString()}
                  <span className="text-[#8A5BFF]">+</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-[#8A5BFF]" /> Total Peer Ratings
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center p-2 pt-6 lg:pt-2">
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-1">
                  {stats.onlineUsers}
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block ml-1 animate-ping" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-emerald-400" /> Online Across Campuses
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center p-2 pt-6 lg:pt-2">
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-1">
                  {stats.trendingCount}
                  <Flame className="w-8 h-8 text-amber-400 inline" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-amber-400" /> Trending Right Now
                </span>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. TRENDING & RANDOM PROFILE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#A5B4FC]">
              <Flame className="w-4 h-4 text-amber-400" /> Trending & Spotlight
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Featured Campus Profiles
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1 bg-white/[0.05] hover:bg-white/[0.1] px-4 py-2.5 rounded-xl border border-white/10"
          >
            <span>View All {profiles.length} Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayProfiles.map((p, idx) => (
            <ProfileCard
              key={p.id}
              profile={p}
              rankPosition={idx + 1}
              onSelect={onSelectProfile}
              onOpenVoteModal={onOpenVoteModal}
            />
          ))}
        </div>
      </section>

      {/* 4. LEADERBOARD PODIUM PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#101010] via-[#050505] to-[#151515]">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> Live Ranking
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Top Campus Leaders Today
              </h2>
            </div>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B7FFF]/20 to-[#8A5BFF]/20 border border-[#5B7FFF]/40 text-xs font-extrabold text-white hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Full Leaderboard Standings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {topThree.map((user, idx) => {
              const medals = ['🥇 Gold Crown', '🥈 Silver Medal', '🥉 Bronze Medal'];
              const medalColors = ['border-amber-400/50 bg-amber-500/10 text-amber-300', 'border-slate-300/50 bg-slate-400/10 text-slate-200', 'border-amber-700/50 bg-amber-800/10 text-amber-500'];
              
              return (
                <div
                  key={user.id}
                  onClick={() => onSelectProfile(user)}
                  className="group cursor-pointer p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${medalColors[idx] || ''}`}>
                      {medals[idx] || `#${idx + 1}`}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {user.campus}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="text-base font-extrabold text-white group-hover:text-[#A5B4FC] transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        {user.major}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-black gradient-text">
                          {user.overallScore.toFixed(1)} AVG
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({user.totalVotes} votes)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. LIVE ACTIVITY FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Live Campus Activity Ticker
            </h3>
            <span className="text-xs text-slate-500 ml-auto font-medium">60fps Realtime</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3.5 text-xs hover:border-white/15 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B7FFF]/20 to-[#8A5BFF]/20 border border-[#5B7FFF]/30 flex items-center justify-center shrink-0 text-[#A5B4FC]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-300 leading-snug font-medium">
                    {act.description}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {act.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
