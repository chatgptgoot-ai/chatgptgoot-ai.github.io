import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Lock, Trash2, RefreshCcw, 
  Users, BarChart3, Database, Key, Check, LogOut, Heart
} from 'lucide-react';
import { CampusProfile, ReportItem, SiteStatistics } from '../types';
import { 
  isAdminLoggedIn, loginAdminSession, logoutAdminSession, 
  getReports, resolveReport, deleteProfileById, deleteCommentById, 
  saveAllProfiles, getFirebaseConfig, saveFirebaseConfig
} from '../firebase/service';

interface AdminDashboardViewProps {
  profiles: CampusProfile[];
  stats: SiteStatistics | null;
  onRefreshData: () => void;
  isFirebaseConnected: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  profiles,
  stats,
  onRefreshData,
  isFirebaseConnected
}) => {
  const [isLogged, setIsLogged] = useState(isAdminLoggedIn());
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profiles' | 'reports' | 'stats' | 'firebase'>('profiles');
  const [reports, setReports] = useState<ReportItem[]>([]);
  
  // Firebase config state
  const [fbConfig, setFbConfig] = useState(getFirebaseConfig());
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  useEffect(() => {
    async function loadReports() {
      const all = await getReports();
      setReports(all);
    }
    loadReports();
  }, [profiles]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdminSession(passwordInput)) {
      setIsLogged(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid admin password. Use demo password "campusrank2026" or "admin".');
    }
  };

  const handleAdminLogout = () => {
    logoutAdminSession();
    setIsLogged(false);
  };

  const handleDeleteProfile = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete profile "${name}"?`)) {
      await deleteProfileById(id);
      onRefreshData();
    }
  };

  const handleToggleTrending = async (profile: CampusProfile) => {
    const updated = profiles.map(p => p.id === profile.id ? { ...p, isTrending: !p.isTrending } : p);
    await saveAllProfiles(updated);
    onRefreshData();
  };

  const handleToggleVerified = async (profile: CampusProfile) => {
    const updated = profiles.map(p => p.id === profile.id ? { ...p, isVerified: !p.isVerified } : p);
    await saveAllProfiles(updated);
    onRefreshData();
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed', targetId: string, targetType: string) => {
    if (status === 'resolved') {
      if (targetType === 'profile') {
        await deleteProfileById(targetId);
      } else {
        await deleteCommentById(targetId);
      }
    }
    await resolveReport(reportId, status);
    const updated = await getReports();
    setReports(updated);
    onRefreshData();
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(fbConfig);
    setConfigSavedNotice(true);
    setTimeout(() => {
      setConfigSavedNotice(false);
      window.location.reload();
    }, 1500);
  };

  if (!isLogged) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 animate-fadeIn">
        <div className="glass-panel rounded-3xl p-8 border border-white/15 bg-[#101010] shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#5B7FFF] to-[#8A5BFF] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#5B7FFF]/25">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Moderation Portal</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Protected area for CampusRank community moderators and site admins.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Admin Password / Firebase Auth</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-3.5 rounded-xl glass-input text-sm text-white"
              />
              <p className="text-[11px] text-[#A5B4FC] font-semibold pt-1">
                Demo Key: <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">campusrank2026</code>
              </p>
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl glass-button-primary text-sm font-extrabold text-white shadow-xl transition-all"
            >
              Authenticate & Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 bg-gradient-to-r from-[#101010] via-[#151515] to-[#101010] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5B7FFF] to-[#8A5BFF] flex items-center justify-center text-white shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Admin Moderation Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                Level 4 Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage profiles, moderate flagged content, analyze site metrics, and configure Firebase backend storage.
            </p>
          </div>
        </div>

        <button
          onClick={handleAdminLogout}
          className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-xs font-bold text-slate-300 hover:text-rose-400 border border-white/10 transition-all flex items-center gap-2 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Mode</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
        {[
          { id: 'profiles', label: `Manage Profiles (${profiles.length})`, icon: Users },
          { id: 'reports', label: `Moderation Reports (${reports.filter(r => r.status === 'pending').length} Pending)`, icon: ShieldAlert },
          { id: 'stats', label: 'Site Statistics & Charts', icon: BarChart3 },
          { id: 'firebase', label: `Firebase Cloud Engine (${isFirebaseConnected ? 'Live' : 'Static'})`, icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-[#5B7FFF] to-[#8A5BFF] text-white shadow-lg shadow-[#5B7FFF]/25 scale-105'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MANAGE PROFILES */}
      {activeTab === 'profiles' && (
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl space-y-4 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8A5BFF]" /> Active Campus Profiles
            </h3>
            <button
              onClick={onRefreshData}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs flex items-center gap-1.5"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Refresh List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Student / Handle</th>
                  <th className="p-3.5">University</th>
                  <th className="p-3.5">Major</th>
                  <th className="p-3.5">Score / Votes</th>
                  <th className="p-3.5">Status Toggles</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-white/15" />
                      <div>
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-slate-400 text-[11px]">{p.handle}</div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-300">{p.campus}</td>
                    <td className="p-3.5 text-slate-400">{p.major}</td>
                    <td className="p-3.5">
                      <span className="font-black gradient-text text-sm">{p.overallScore.toFixed(1)}</span>
                      <span className="text-slate-500 text-[10px] block">({p.totalVotes} votes)</span>
                    </td>
                    <td className="p-3.5 space-x-2">
                      <button
                        onClick={() => handleToggleTrending(p)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          p.isTrending
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        🔥 {p.isTrending ? 'Trending ON' : 'Trending OFF'}
                      </button>

                      <button
                        onClick={() => handleToggleVerified(p)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          p.isVerified
                            ? 'bg-[#5B7FFF]/20 border-[#5B7FFF]/40 text-[#A5B4FC]'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ✔ {p.isVerified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteProfile(p.id, p.name)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MODERATION REPORTS */}
      {activeTab === 'reports' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> Community Safety & Content Reports
            </h3>
            <span className="text-xs text-slate-400 font-semibold bg-white/5 px-3 py-1 rounded-xl">
              {reports.filter(r => r.status === 'pending').length} Action Required
            </span>
          </div>

          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 italic">
                No reports submitted by community members yet. All active profiles and comments are clean!
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    rep.status === 'pending'
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-white/[0.02] border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-md uppercase text-[10px] font-black bg-rose-500 text-white">
                        {rep.targetType}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Target: {rep.targetName}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        rep.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Reported on: {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 pl-1 border-l-2 border-rose-400/40">
                    <p className="text-slate-300 font-semibold">Reason: {rep.reason}</p>
                    {rep.details && <p className="text-slate-400 italic">"{rep.details}"</p>}
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismissed', rep.targetId, rep.targetType)}
                        className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors"
                      >
                        Dismiss Report (Keep Content)
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'resolved', rep.targetId, rep.targetType)}
                        className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Inappropriate {rep.targetType === 'profile' ? 'Profile' : 'Comment'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SITE STATISTICS & CHARTS */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">Total Registered Profiles</span>
              <div className="text-4xl font-black text-white">{stats.totalProfiles} Students</div>
            </div>
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">Total Peer Votes</span>
              <div className="text-4xl font-black text-[#8A5BFF]">{stats.totalVotes.toLocaleString()} Votes</div>
            </div>
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">Simulated Online Concurrency</span>
              <div className="text-4xl font-black text-emerald-400">{stats.onlineUsers} Live Users</div>
            </div>
          </div>

          {/* Daily Activity Visual Progression Bar Chart */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#5B7FFF]" /> 7-Day Campus Voting Progression
              </h3>
              <p className="text-xs text-slate-400">Daily breakdown of student rating submissions across universities.</p>
            </div>

            <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-64 pt-8 border-b border-white/[0.08] pb-4">
              {stats.dailyActivity.map((day, idx) => {
                const maxVotes = Math.max(...stats.dailyActivity.map(d => d.votes), 1);
                const heightPercentage = Math.min((day.votes / maxVotes) * 100, 100);

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-extrabold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.votes} v
                    </span>
                    <div className="w-full bg-white/[0.04] rounded-2xl h-full flex items-end overflow-hidden p-1">
                      <div
                        className="w-full bg-gradient-to-t from-[#5B7FFF] via-[#8A5BFF] to-[#A5B4FC] rounded-xl transition-all duration-700 hover:brightness-125"
                        style={{ height: `${heightPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Averages Analysis */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" /> Platform Category Benchmark Averages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.categoryBreakdown.map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center space-y-1">
                  <span className="text-2xl font-black gradient-text block">{c.averageScore.toFixed(1)}</span>
                  <span className="text-xs text-slate-300 font-bold block">{c.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FIREBASE CONFIGURATION */}
      {activeTab === 'firebase' && (
        <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 shadow-2xl max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#5B7FFF]/15 border border-[#5B7FFF]/30 flex items-center justify-center text-[#A5B4FC]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Firebase Backend Integration Settings</h3>
              <p className="text-xs text-slate-400">
                Configure your Firestore + Storage connection. If empty, the app runs on the high-speed static GitHub Pages engine (`localStorage`).
              </p>
            </div>
          </div>

          {configSavedNotice ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span>Firebase Configuration Saved! Reloading storage engine...</span>
            </div>
          ) : (
            <form onSubmit={handleSaveFirebaseConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">API Key (`apiKey`)</label>
                  <input
                    type="text"
                    value={fbConfig.apiKey || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full p-3 rounded-xl glass-input text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Project ID (`projectId`)</label>
                  <input
                    type="text"
                    value={fbConfig.projectId || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                    placeholder="campusrank-project"
                    className="w-full p-3 rounded-xl glass-input text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Auth Domain (`authDomain`)</label>
                  <input
                    type="text"
                    value={fbConfig.authDomain || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                    placeholder="campusrank.firebaseapp.com"
                    className="w-full p-3 rounded-xl glass-input text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Storage Bucket (`storageBucket`)</label>
                  <input
                    type="text"
                    value={fbConfig.storageBucket || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, storageBucket: e.target.value })}
                    placeholder="campusrank.appspot.com"
                    className="w-full p-3 rounded-xl glass-input text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('campusrank_fb_config_v1');
                    window.location.reload();
                  }}
                  className="px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold"
                >
                  Reset to Static GitHub Pages Mode
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl glass-button-primary text-white font-extrabold shadow-lg"
                >
                  Save & Connect Firebase Cloud
                </button>
              </div>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
