import React, { useState } from 'react';
import { PlusCircle, Sparkles, Image, Globe, CheckCircle2 } from 'lucide-react';
import { CampusProfile } from '../types';

interface CreateProfileViewProps {
  onCreateProfileSubmit: (data: Partial<CampusProfile>) => Promise<CampusProfile>;
}

export const CreateProfileView: React.FC<CreateProfileViewProps> = ({
  onCreateProfileSubmit
}) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [campus, setCampus] = useState('Stanford University');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState(2027);
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetPhotos = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !major.trim() || !bio.trim()) {
      setError('Please fill in your Name, Major, and Bio to participate.');
      return;
    }
    if (!agreed) {
      setError('You must agree to participate in respectful peer evaluations.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateProfileSubmit({
        name: name.trim(),
        handle: handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: avatar.trim() || presetPhotos[Math.floor(Math.random() * presetPhotos.length)],
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        campus: campus.trim(),
        major: major.trim(),
        graduationYear: Number(graduationYear),
        bio: bio.trim(),
        socialLinks: {
          instagram: instagram.trim() ? `https://instagram.com/${instagram.replace('@', '')}` : undefined,
          linkedin: linkedin.trim() || undefined,
          portfolio: portfolio.trim() || undefined,
        }
      });
    } catch (err) {
      setError('Could not create profile. Please check your network connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B7FFF]/10 border border-[#5B7FFF]/30 text-xs font-bold text-[#A5B4FC]">
          <PlusCircle className="w-4 h-4 text-[#8A5BFF]" />
          <span>Join the Campus Community</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Create Your <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Upload your portrait and bio to join your campus leaderboard. Profiles represent people who actively choose to participate and receive positive peer feedback.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-semibold flex items-center justify-between">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
        
        {/* Step 1: Identity & Campus */}
        <div className="space-y-4 pb-6 border-b border-white/[0.08]">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#A5B4FC]">
            1. Student Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Lin or Alex Rivera"
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Preferred Handle (Optional)</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. @mayalin_cs"
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">University / Campus *</label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white bg-[#101010]"
              >
                <option value="Stanford University">Stanford University</option>
                <option value="MIT">MIT</option>
                <option value="NYU">NYU</option>
                <option value="UC Berkeley">UC Berkeley</option>
                <option value="Columbia University">Columbia University</option>
                <option value="Cornell University">Cornell University</option>
                <option value="Johns Hopkins University">Johns Hopkins University</option>
                <option value="UCLA">UCLA</option>
                <option value="Harvard University">Harvard University</option>
                <option value="University of Texas at Austin">UT Austin</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Major / Program *</label>
              <input
                type="text"
                required
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Class Year *</label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white bg-[#101010]"
              >
                <option value={2026}>Class of 2026</option>
                <option value={2027}>Class of 2027</option>
                <option value={2028}>Class of 2028</option>
                <option value={2029}>Class of 2029</option>
                <option value={2025}>Class of 2025 (Grad/Alumni)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Photography & Bio */}
        <div className="space-y-4 pb-6 border-b border-white/[0.08]">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#A5B4FC] flex items-center gap-1.5">
            <Image className="w-4 h-4 text-[#8A5BFF]" /> 2. Profile Photo & Bio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Avatar Image URL (Or pick a preset below)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1534..."
                className="w-full p-3.5 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Cover Banner URL (Optional)
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1618..."
                className="w-full p-3.5 rounded-xl glass-input text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar">
            <span className="text-xs text-slate-400 shrink-0 pr-1 font-semibold">Or Click Preset Avatar:</span>
            {presetPhotos.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(url)}
                className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  avatar === url ? 'border-[#5B7FFF] scale-110 shadow-lg' : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-300">Bio & Interests * (Up to 300 chars)</label>
            <textarea
              required
              rows={3}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your peers what you build, study, or love on campus. e.g. Building AI design tools @ Stanford, barista addict, and bouldering fan 🧗‍♂️"
              className="w-full p-3.5 rounded-xl glass-input text-sm text-white resize-none"
            />
            <div className="text-right text-[11px] text-slate-400">
              {bio.length} / 300 characters
            </div>
          </div>
        </div>

        {/* Step 3: Social Links */}
        <div className="space-y-4 pb-6 border-b border-white/[0.08]">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#A5B4FC] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#8A5BFF]" /> 3. Social & Portfolio (Optional)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Instagram Handle / URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Portfolio or Project Website</label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Consent & Submit */}
        <div className="space-y-6">
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.05] transition-all">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-[#5B7FFF] w-4 h-4 rounded cursor-pointer shrink-0"
            />
            <span className="text-xs text-slate-300 leading-relaxed">
              <strong>Participation Agreement:</strong> I confirm that I am uploading my own campus profile (or have explicit permission to represent this student). I agree to receive positive, respectful category evaluations and join the live CampusRank community.
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed || isSubmitting}
            className="w-full py-4 rounded-2xl glass-button-primary text-base font-extrabold text-white shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Publishing Profile to Leaderboard...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Publish Profile to Campus Leaderboard</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
