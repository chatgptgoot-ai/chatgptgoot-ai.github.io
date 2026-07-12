import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Trophy, CheckCircle, Flame, MapPin, ExternalLink, 
  Heart, ThumbsUp, ShieldAlert, Award, 
  Image as ImageIcon, Clock, ArrowLeft, Send, CheckCircle2
} from 'lucide-react';
import { CampusProfile, CommentItem, ActivityEvent } from '../types';
import { getComments, addComment, likeComment, getActivities } from '../firebase/service';

interface ProfileDetailViewProps {
  profile: CampusProfile;
  onBack: () => void;
  onOpenVoteModal: (profile: CampusProfile) => void;
  onOpenReportModal: (target: CampusProfile | CommentItem, type: 'profile' | 'comment') => void;
}

export const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({
  profile,
  onBack,
  onOpenVoteModal,
  onOpenReportModal
}) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [commentSort, setCommentSort] = useState<'newest' | 'helpful'>('helpful');
  const [profanityNotice, setProfanityNotice] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const allComments = await getComments(profile.id);
      const allActivities = await getActivities();
      if (isMounted) {
        setComments(allComments);
        setActivities(allActivities.filter(a => a.profileId === profile.id).slice(0, 5));
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [profile.id]);

  const sortedComments = [...comments].sort((a, b) => {
    if (commentSort === 'helpful') {
      return b.likes - a.likes;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || newCommentText.length < 3) return;
    setIsSubmittingComment(true);

    const result = await addComment(profile.id, authorName, newCommentText);
    const updated = await getComments(profile.id);
    setComments(updated);
    setNewCommentText('');
    setIsSubmittingComment(false);

    if (result.hadProfanity) {
      setProfanityNotice('Your comment was automatically cleaned by our campus profanity filter.');
      setTimeout(() => setProfanityNotice(null), 4000);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const updated = await likeComment(commentId);
    if (updated) {
      setComments(prev => prev.map(c => c.id === commentId ? updated : c));
    }
  };

  const categories: { key: keyof CampusProfile['ratings']; label: string }[] = [
    { key: 'style', label: 'Style' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'creativity', label: 'Creativity' },
    { key: 'humor', label: 'Humor' },
    { key: 'kindness', label: 'Kindness' },
    { key: 'charisma', label: 'Charisma' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition-all border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>

      {/* 1. HEADER & HERO CARD */}
      <div className="glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-[#080808]">
        
        {/* Cover Banner Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={profile.coverImage || profile.avatar}
            alt="Cover Banner"
            className="w-full h-full object-cover opacity-60 sm:opacity-75 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
        </div>

        {/* Profile Info Row below banner */}
        <div className="px-6 sm:px-10 pb-8 relative -mt-24 sm:-mt-28 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-[#101010] shadow-2xl bg-slate-900"
              />
              {profile.isVerified && (
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#5B7FFF] text-white shadow-lg" title="Verified Campus Scholar">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="space-y-1 sm:pb-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
                {profile.isTrending && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold flex items-center gap-1 shadow-md animate-pulse">
                    <Flame className="w-3 h-3 text-amber-400" /> Trending
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 font-medium">
                <span className="text-[#A5B4FC] font-semibold">{profile.handle}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5B7FFF]" /> {profile.campus}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-200 font-bold">
                  {profile.major} (Class of '{String(profile.graduationYear).slice(-2)})
                </span>
              </div>
            </div>
          </div>

          {/* Rate Button + Report */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onOpenVoteModal(profile)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-button-primary text-sm font-black text-white shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Rate & Boost {profile.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={() => onOpenReportModal(profile, 'profile')}
              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
              title="Report Profile"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bio & Social Links Bar */}
        <div className="px-6 sm:px-10 py-6 border-t border-white/[0.08] bg-white/[0.02] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">
            {profile.bio}
          </p>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {profile.socialLinks.instagram && (
              <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10">
                <span>Instagram</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.socialLinks.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10">
                <span>LinkedIn</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.socialLinks.portfolio && (
              <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-[#A5B4FC] hover:text-white transition-all flex items-center gap-1.5 border border-white/10">
                <span>Portfolio</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.socialLinks.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10">
                <span>GitHub</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* 2. RATING BREAKDOWN & OVERALL STATISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Col: Category Averages & Animated Bars (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A5B4FC]">
                Multi-Dimensional Analysis
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Category Rating Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
              Based on {profile.totalVotes} student evaluations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {categories.map((cat) => {
              const score = profile.ratings[cat.key] || 0;
              const count = profile.ratingCounts[cat.key] || Math.floor(profile.totalVotes / 6);
              const percentage = Math.min((score / 10) * 100, 100);

              return (
                <div key={cat.key} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{cat.label}</h4>
                      <p className="text-[10px] text-slate-400">{count} community ratings</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black gradient-text">
                        {score.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500"> / 10</span>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5B7FFF] via-[#8A5BFF] to-[#A5B4FC] rating-bar-transition shadow-sm"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Overall Profile Statistics & Badges (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl bg-gradient-to-br from-[#101010] to-[#080808]">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-white/[0.08] pb-3">
              Overall Standings
            </h3>

            <div className="text-center py-4 bg-white/[0.03] rounded-2xl border border-white/[0.08] space-y-1">
              <span className="text-5xl font-black gradient-text">
                {profile.overallScore.toFixed(1)}
              </span>
              <span className="block text-xs uppercase tracking-widest font-extrabold text-[#A5B4FC]">
                Weighted Campus Score
              </span>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" /> Leaderboard Rank
                </span>
                <span className="font-extrabold text-white text-sm">
                  {profile.rank ? `#${profile.rank} Spot` : 'Ranked Top 10'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" /> Total Votes Received
                </span>
                <span className="font-extrabold text-white text-sm">
                  {profile.totalVotes.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#5B7FFF]" /> Badges Earned
                </span>
                <span className="font-bold text-slate-200">{profile.badges.length} Badges</span>
              </div>
            </div>

            {/* Badges Pill Box */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {profile.badges.map((b, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold bg-[#5B7FFF]/15 border border-[#5B7FFF]/30 text-[#A5B4FC]">
                  ✨ {b}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. GALLERY & ACTIVITY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Gallery Section (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#8A5BFF]" /> Student Gallery & Snapshots
            </h3>
            <span className="text-xs text-slate-400">{profile.gallery.length} Photos</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryImg(imgUrl)}
                className="relative h-40 rounded-2xl overflow-hidden bg-slate-800 border border-white/10 cursor-pointer group"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#050505]/0 group-hover:bg-[#050505]/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-xs font-bold text-white bg-[#050505]/80 px-2.5 py-1 rounded-lg">View Full</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5B7FFF]" /> Recent Activity Timeline
            </h3>
          </div>

          <div className="space-y-4 pt-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                No recent activity logged for this student yet. Be the first to vote!
              </p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-xl bg-[#5B7FFF]/15 text-[#A5B4FC] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-200 font-semibold leading-snug">{act.description}</p>
                    <p className="text-[10px] text-slate-500">{act.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 4. OPTIONAL COMMENTS & RESPECTFUL FEEDBACK */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Optional Community Endorsements
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight mt-1">
              Respectful Compliments ({comments.length})
            </h3>
          </div>

          {/* Sort Toggles: Newest / Most Helpful */}
          <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setCommentSort('helpful')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                commentSort === 'helpful' ? 'bg-[#5B7FFF] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⭐ Most Helpful
            </button>
            <button
              onClick={() => setCommentSort('newest')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                commentSort === 'newest' ? 'bg-[#5B7FFF] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🕒 Newest
            </button>
          </div>
        </div>

        {profanityNotice && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 font-medium">
            🛡️ {profanityNotice}
          </div>
        )}

        {/* Comment Submission Form */}
        <form onSubmit={handleCommentSubmit} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Name / Handle (e.g. Devon @berkeley)"
              className="w-full sm:w-64 p-3 rounded-xl glass-input text-xs text-white"
            />
            <span className="text-[11px] text-slate-400 italic">
              ✨ Emojis 🔥 and **bold/italic** markdown formatting are supported!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={`Leave a respectful compliment for ${profile.name}...`}
              className="flex-1 p-3.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !newCommentText.trim()}
              className="px-6 py-3.5 rounded-xl glass-button-primary text-xs font-extrabold text-white shrink-0 flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Compliment</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4 pt-2">
          {sortedComments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              No compliments recorded yet for {profile.name}. Be the first student to leave an uplifting comment!
            </div>
          ) : (
            sortedComments.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      className="w-9 h-9 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{c.authorName}</span>
                        {c.isHelpful && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-400">
                            Verified Helpful
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500">{c.timestamp}</p>
                    </div>
                  </div>

                  {/* Actions: Like & Report */}
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all ${
                        c.likedByCurrentUser
                          ? 'bg-[#5B7FFF]/20 border-[#5B7FFF] text-[#A5B4FC]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-bold">{c.likes}</span>
                    </button>

                    <button
                      onClick={() => onOpenReportModal(c, 'comment')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Report Comment"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed pl-12 font-normal">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Gallery Modal Preview if selected */}
      {selectedGalleryImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
            <img src={selectedGalleryImg} alt="Gallery Zoom" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-[#050505]/80 text-white font-bold text-xs"
            >
              Close Zoom
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
