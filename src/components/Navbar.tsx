import React, { useState } from 'react';
import { Sparkles, Trophy, Compass, PlusCircle, ShieldAlert, Search, Flame, Menu, X, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onlineCount: number;
  onSearchSubmit: (query: string) => void;
  isFirebaseLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onlineCount,
  onSearchSubmit,
  isFirebaseLive
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
      onNavigate('explore');
      setMobileMenuOpen(false);
    }
  };

  const navItems: { id: PageView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'create', label: 'Create Profile', icon: PlusCircle },
    { id: 'admin', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-x-0 border-t-0 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group focus:outline-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
          aria-label="Navigate to CampusRank Home"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5B7FFF] via-[#8A5BFF] to-[#A5B4FC] p-[2px] shadow-lg shadow-[#5B7FFF]/25 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#8A5BFF] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Inter']">
                Campus<span className="gradient-accent">Rank</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#5B7FFF]/15 border border-[#5B7FFF]/30 text-[#A5B4FC]">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-medium">{onlineCount}</span> online across campuses
            </div>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Stanford, @marcus, UX Design..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl glass-input bg-white/[0.04] text-white placeholder-slate-400 focus:bg-white/[0.07]"
              aria-label="Search profiles by name, university, or major"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Desktop Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                  isActive
                    ? 'text-white bg-white/[0.1] border border-white/[0.15] shadow-sm shadow-[#5B7FFF]/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#8A5BFF]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'create' && (
                  <span className="w-2 h-2 rounded-full bg-[#5B7FFF]" />
                )}
              </button>
            );
          })}

          {/* Firebase Status Badge */}
          <div 
            className="ml-2 pl-3 border-l border-white/10 hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-400"
            title={isFirebaseLive ? "Connected to live Firebase Cloud" : "Running on static High-Speed Storage Engine (GitHub Pages ready)"}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isFirebaseLive ? 'text-emerald-400' : 'text-[#8A5BFF]'}`} />
            <span>{isFirebaseLive ? 'Firebase Live' : 'Static Engine'}</span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white glass-button-primary"
            aria-label="Create Profile"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Join</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-200 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-white/[0.08] px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search campus profiles..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-white"
              />
            </div>
          </form>

          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-[#5B7FFF]/20 to-[#8A5BFF]/20 border border-[#5B7FFF]/30'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#8A5BFF]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>GitHub Pages Production Static Mode</span>
            </div>
            <span className="text-emerald-400 font-bold">{onlineCount} online</span>
          </div>
        </div>
      )}
    </header>
  );
};
