import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Flame, Sparkles, Filter, RefreshCcw } from 'lucide-react';
import { CampusProfile } from '../types';
import { ProfileCard } from '../components/ProfileCard';

interface ExploreViewProps {
  profiles: CampusProfile[];
  initialSearchQuery?: string;
  onSelectProfile: (profile: CampusProfile) => void;
  onOpenVoteModal: (profile: CampusProfile) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  profiles,
  initialSearchQuery = '',
  onSelectProfile,
  onOpenVoteModal
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'newest' | 'highest' | 'style' | 'confidence' | 'creativity' | 'humor' | 'kindness' | 'charisma'>('trending');
  const [displayCount, setDisplayCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Extract unique universities
  const campuses = useMemo(() => {
    const list = new Set<string>();
    profiles.forEach(p => list.add(p.campus));
    return ['All', ...Array.from(list)];
  }, [profiles]);

  // Filter & Sort
  const filteredProfiles = useMemo(() => {
    let list = [...profiles];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.campus.toLowerCase().includes(q) ||
        p.major.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q)
      );
    }

    // Campus filter
    if (selectedCampus !== 'All') {
      list = list.filter(p => p.campus === selectedCampus);
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.overallScore - a.overallScore;
        case 'popular':
          return (b.totalVotes || 0) - (a.totalVotes || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'highest':
          return b.overallScore - a.overallScore;
        case 'style':
          return (b.ratings.style || 0) - (a.ratings.style || 0);
        case 'confidence':
          return (b.ratings.confidence || 0) - (a.ratings.confidence || 0);
        case 'creativity':
          return (b.ratings.creativity || 0) - (a.ratings.creativity || 0);
        case 'humor':
          return (b.ratings.humor || 0) - (a.ratings.humor || 0);
        case 'kindness':
          return (b.ratings.kindness || 0) - (a.ratings.kindness || 0);
        case 'charisma':
          return (b.ratings.charisma || 0) - (a.ratings.charisma || 0);
        default:
          return b.overallScore - a.overallScore;
      }
    });

    return list;
  }, [profiles, searchQuery, selectedCampus, sortBy]);

  const visibleProfiles = filteredProfiles.slice(0, displayCount);
  const hasMore = visibleProfiles.length < filteredProfiles.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#A5B4FC] flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#8A5BFF]" /> Campus Directory & Feed
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
            Explore Campus Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Browse active students across universities. Filter by major, university, or specific rating categories.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold bg-white/[0.03] px-4 py-2.5 rounded-xl border border-white/10">
          <Filter className="w-4 h-4 text-[#5B7FFF]" />
          <span>Showing {visibleProfiles.length} of {filteredProfiles.length} Profiles</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(6);
              }}
              placeholder="Search by student name, major, university..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Campus Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCampus}
              onChange={(e) => {
                setSelectedCampus(e.target.value);
                setDisplayCount(6);
              }}
              className="w-full p-3 rounded-2xl glass-input text-sm text-white bg-[#101010] cursor-pointer"
            >
              {campuses.map(c => (
                <option key={c} value={c} className="bg-[#101010] text-white">
                  {c === 'All' ? '🏫 All Universities' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setDisplayCount(6);
              }}
              className="w-full p-3 rounded-2xl glass-input text-sm text-white bg-[#101010] cursor-pointer"
            >
              <option value="trending">🔥 Trending First</option>
              <option value="popular">💫 Most Popular (Total Votes)</option>
              <option value="highest">🏆 Highest Overall Average</option>
              <option value="newest">✨ Newest Additions</option>
              <option value="style">👗 Top Style Score</option>
              <option value="confidence">⚡️ Top Confidence Score</option>
              <option value="creativity">🎨 Top Creativity Score</option>
              <option value="humor">😂 Top Humor Score</option>
              <option value="kindness">❤️ Top Kindness Score</option>
              <option value="charisma">✨ Top Charisma Score</option>
            </select>
          </div>

        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 pr-1">Quick Sort:</span>
          {[
            { id: 'trending', label: 'Trending', icon: Flame },
            { id: 'popular', label: 'Most Votes', icon: Sparkles },
            { id: 'creativity', label: 'Creativity', icon: Sparkles },
            { id: 'confidence', label: 'Confidence', icon: Sparkles },
            { id: 'style', label: 'Style', icon: Sparkles },
            { id: 'charisma', label: 'Charisma', icon: Sparkles },
          ].map(quick => (
            <button
              key={quick.id}
              onClick={() => {
                setSortBy(quick.id as typeof sortBy);
                setDisplayCount(6);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                sortBy === quick.id
                  ? 'bg-gradient-to-r from-[#5B7FFF] to-[#8A5BFF] text-white shadow-md shadow-[#5B7FFF]/20'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
              }`}
            >
              <span>{quick.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profiles Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="py-24 text-center glass-panel rounded-3xl border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Profiles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No campus students match "{searchQuery}" or your active university filter. Try adjusting your search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCampus('All');
              setSortBy('trending');
            }}
            className="px-5 py-2.5 rounded-xl glass-button-primary text-xs font-bold text-white mt-2 inline-block"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleProfiles.map((p, idx) => (
              <ProfileCard
                key={p.id}
                profile={p}
                rankPosition={p.rank || idx + 1}
                onSelect={onSelectProfile}
                onOpenVoteModal={onOpenVoteModal}
              />
            ))}
          </div>

          {/* Infinite Scroll / Load More Trigger */}
          {hasMore && (
            <div className="pt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-4 rounded-2xl glass-panel hover:bg-white/[0.08] border border-white/15 text-sm font-extrabold text-white transition-all shadow-xl flex items-center justify-center gap-2.5 mx-auto disabled:opacity-50"
              >
                <RefreshCcw className={`w-4 h-4 text-[#8A5BFF] ${isLoadingMore ? 'animate-spin' : ''}`} />
                <span>{isLoadingMore ? 'Loading More Profiles...' : `Load More Profiles (${filteredProfiles.length - visibleProfiles.length} remaining)`}</span>
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};
