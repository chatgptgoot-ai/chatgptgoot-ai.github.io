import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { CampusProfile, CommentItem } from '../types';

interface ReportModalProps {
  target: CampusProfile | CommentItem | null;
  targetType: 'profile' | 'comment';
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => Promise<void>;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  target,
  targetType,
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [reason, setReason] = useState<string>('Inappropriate Content');
  const [details, setDetails] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !target) return null;

  const targetName = 'name' in target ? target.name : `Comment by ${target.authorName}`;

  const reasons = [
    'Inappropriate or Offensive Content',
    'Harassment or Cyberbullying',
    'Impersonation or False Information',
    'Spam or Irrelevant Promotion',
    'Other Community Policy Violation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmitReport(reason, details);
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#050505]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-white/15 bg-[#101010]/95 shadow-2xl p-6 sm:p-8 z-10">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white"
          aria-label="Close Report Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 text-rose-400">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              Report {targetType === 'profile' ? 'Profile' : 'Comment'}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1">
              Target: {targetName}
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-scaleUp">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Report Received</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Our campus moderation team has flagged this item for expedited review. Thank you for keeping CampusRank respectful and safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Reason for reporting
              </label>
              <div className="space-y-1.5">
                {reasons.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      reason === r
                        ? 'bg-rose-500/15 border-rose-500/40 text-white font-semibold'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-rose-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide specific details or context for moderators..."
                rows={3}
                className="w-full p-3 rounded-xl glass-input text-xs text-white placeholder-slate-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-lg transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
