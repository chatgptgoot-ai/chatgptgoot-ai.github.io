import React from 'react';
import { Sparkles, ShieldCheck, Heart, ExternalLink, RefreshCw, Globe } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (view: PageView) => void;
  onResetDemoData: () => void;
  isFirebaseLive: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onResetDemoData,
  isFirebaseLive
}) => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050505] text-slate-400 mt-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-gradient-to-r from-[#5B7FFF]/10 via-[#8A5BFF]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B7FFF] to-[#8A5BFF] flex items-center justify-center text-white font-bold shadow-md shadow-[#5B7FFF]/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Campus<span className="gradient-accent">Rank</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The glassmorphic campus recognition platform. We believe high-achieving students deserve a respectful, multi-dimensional space to showcase their confidence, creativity, and charisma.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Respectful Rating Engine
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">
                  Explore Profiles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-white transition-colors">
                  Live Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('create')} className="hover:text-[#8A5BFF] transition-colors flex items-center gap-1.5">
                  Join CampusRank <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Categories Explained */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
              Rating Breakdown
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex justify-between"><span>Style</span> <span className="text-slate-300 font-semibold">Aesthetic & Presence</span></li>
              <li className="flex justify-between"><span>Confidence</span> <span className="text-slate-300 font-semibold">Self-assurance</span></li>
              <li className="flex justify-between"><span>Creativity</span> <span className="text-slate-300 font-semibold">Innovation & Art</span></li>
              <li className="flex justify-between"><span>Humor</span> <span className="text-slate-300 font-semibold">Wit & Charm</span></li>
              <li className="flex justify-between"><span>Kindness</span> <span className="text-slate-300 font-semibold">Empathy & Community</span></li>
              <li className="flex justify-between"><span>Charisma</span> <span className="text-slate-300 font-semibold">Magnetic Vibe</span></li>
            </ul>
          </div>

          {/* Static Hosting & Reset */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
              Engine & Status
            </h4>
            <div className="p-4 rounded-2xl glass-panel text-xs space-y-2 border border-white/[0.08]">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>Backend Provider</span>
                <span className={isFirebaseLive ? "text-emerald-400" : "text-[#8A5BFF]"}>
                  {isFirebaseLive ? "Firebase Cloud" : "GitHub Pages Static"}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Runs completely client-side with 60fps glass reflections, local state sync, and optional Firebase Firestore integration.
              </p>
              <button
                onClick={onResetDemoData}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 font-medium transition-all"
                title="Restore all default Stanford, MIT, NYU demo profiles & ratings"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#8A5BFF]" />
                <span>Reset Demo Seed Data</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>© 2026 CampusRank Inc. Engineered for GitHub Pages static deployment. Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Globe className="w-4 h-4 text-[#5B7FFF]" /> Campus Social Network
            </span>
            <button onClick={() => onNavigate('admin')} className="hover:text-[#A5B4FC] transition-colors font-medium">
              Admin Moderation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
