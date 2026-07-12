import React, { useState } from 'react';
import { Sparkles, X, Heart, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusProfile } from '../types';

interface RatingModalProps {
  profile: CampusProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitVote: (category: keyof CampusProfile['ratings'], score: number) => Promise<void>;
  onOpenReport: (profile: CampusProfile) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSubmitVote,
  onOpenReport
}) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof CampusProfile['ratings']>('creativity');
  const [scoreValue, setScoreValue] = useState<number>(9.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { key: keyof CampusProfile['ratings']; label: string; desc: string }[] = [
    { key: 'style', label: 'Style', desc: 'Personal aesthetic, outfit vibe, and visual presentation' },
    { key: 'confidence', label: 'Confidence', desc: 'Self-assurance, poise, and leadership spirit' },
    { key: 'creativity', label: 'Creativity', desc: 'Artistic talent, innovative thinking, and originality' },
    { key: 'humor', label: 'Humor', desc: 'Wit, charm, and ability to brighten the room' },
    { key: 'kindness', label: 'Kindness', desc: 'Empathy, community support, and positive aura' },
    { key: 'charisma', label: 'Charisma', desc: 'Magnetic energy, charm, and overall presence' },
  ];

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitVote(selectedCategory, scoreValue);
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas blocked
      }

      const catName = categories.find(c => c.key === selectedCategory)?.label || 'Overall';
      setSubmittedMessage(`🎉 Successfully added +${scoreValue} to ${profile.name}'s ${catName} rating!`);
      
      setTimeout(() => {
        setSubmittedMessage(null);
        setIsSubmitting(false);
        onClose();
      }, 1600);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#050505]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/15 bg-[#101010]/95 shadow-2xl overflow-hidden p-6 sm:p-8 z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
          aria-label="Close Rating Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-md"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A5B4FC] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8A5BFF]" /> Respectful Feedback
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Rate {profile.name}
            </h3>
            <p className="text-xs text-slate-400">
              Select a category and award your positive appreciation score.
            </p>
          </div>
        </div>

        {submittedMessage ? (
          <div className="py-10 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-white px-4">
              {submittedMessage}
            </p>
            <p className="text-xs text-slate-400">
              Recalculating campus averages at 60fps...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVoteSubmit} className="space-y-6">
            
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                1. Choose Feedback Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((c) => {
                  const isSelected = selectedCategory === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setSelectedCategory(c.key)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-tr from-[#5B7FFF]/20 to-[#8A5BFF]/20 border-[#5B7FFF] shadow-md shadow-[#5B7FFF]/15'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-slate-300'
                      }`}
                    >
                      <div className={`text-xs font-extrabold ${isSelected ? 'gradient-accent' : 'text-slate-200'}`}>
                        {c.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        Current: {(profile.ratings[c.key] || 9.0).toFixed(1)}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 italic pt-1">
                {categories.find(c => c.key === selectedCategory)?.desc}
              </p>
            </div>

            {/* Score Slider & Quick Buttons */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  2. Appreciation Score (7.0 — 10.0)
                </label>
                <span className="text-2xl font-black gradient-text">
                  {scoreValue.toFixed(1)}
                </span>
              </div>

              <input
                type="range"
                min="7.0"
                max="10.0"
                step="0.1"
                value={scoreValue}
                onChange={(e) => setScoreValue(parseFloat(e.target.value))}
                className="w-full accent-[#5B7FFF] cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between gap-2 pt-1">
                {[8.5, 9.0, 9.5, 10.0].map((quickScore) => (
                  <button
                    key={quickScore}
                    type="button"
                    onClick={() => setScoreValue(quickScore)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      scoreValue === quickScore
                        ? 'bg-[#5B7FFF] text-white shadow-sm'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-300'
                    }`}
                  >
                    {quickScore.toFixed(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Respectful Guidelines Check */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Community Standard:</strong> CampusRank is built to celebrate real peers. All ratings should reflect positive, constructive appreciation.
              </p>
            </div>

            {/* Submit / Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReport(profile);
                }}
                className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Report inappropriate profile"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Report</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 rounded-xl glass-button-primary text-sm font-extrabold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{isSubmitting ? 'Recording Vote...' : `Submit +${scoreValue.toFixed(1)} Rating`}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
