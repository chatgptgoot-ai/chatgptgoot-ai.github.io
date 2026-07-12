import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RatingModal } from './components/RatingModal';
import { ReportModal } from './components/ReportModal';
import { HomeView } from './pages/HomeView';
import { ExploreView } from './pages/ExploreView';
import { LeaderboardView } from './pages/LeaderboardView';
import { CreateProfileView } from './pages/CreateProfileView';
import { ProfileDetailView } from './pages/ProfileDetailView';
import { AdminDashboardView } from './pages/AdminDashboardView';
import { 
  CampusProfile, 
  ActivityEvent, 
  SiteStatistics, 
  PageView, 
  CommentItem 
} from './types';
import { 
  getProfiles, 
  getActivities, 
  getSiteStatistics, 
  voteOnProfile, 
  submitReport, 
  createNewProfile, 
  isFirebaseConnected 
} from './firebase/service';
import { INITIAL_PROFILES, INITIAL_COMMENTS, INITIAL_ACTIVITIES } from './data/mockProfiles';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [profiles, setProfiles] = useState<CampusProfile[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [stats, setStats] = useState<SiteStatistics | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<CampusProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [profileToVote, setProfileToVote] = useState<CampusProfile | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<CampusProfile | CommentItem | null>(null);
  const [reportTargetType, setReportTargetType] = useState<'profile' | 'comment'>('profile');

  // Notification toast
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const refreshAllData = async () => {
    const pList = await getProfiles();
    const aList = await getActivities();
    const sData = await getSiteStatistics();
    setProfiles(pList);
    setActivities(aList);
    setStats(sData);
    if (selectedProfile) {
      const updatedSelect = pList.find(p => p.id === selectedProfile.id);
      if (updatedSelect) setSelectedProfile(updatedSelect);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      const pList = await getProfiles();
      const aList = await getActivities();
      const sData = await getSiteStatistics();
      if (isMounted) {
        setProfiles(pList);
        setActivities(aList);
        setStats(sData);
      }
    }
    init();
    return () => { isMounted = false; };
  }, []);

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProfile = (profile: CampusProfile) => {
    setSelectedProfile(profile);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVoteModal = (profile: CampusProfile) => {
    setProfileToVote(profile);
    setVoteModalOpen(true);
  };

  const handleOpenReportModal = (target: CampusProfile | CommentItem, type: 'profile' | 'comment') => {
    setReportTarget(target);
    setReportTargetType(type);
    setReportModalOpen(true);
  };

  const handleSubmitVote = async (category: keyof CampusProfile['ratings'], score: number) => {
    if (!profileToVote) return;
    await voteOnProfile(profileToVote.id, category, score);
    await refreshAllData();
    showToast(`🌟 Awarded +${score} rating to ${profileToVote.name}!`);
  };

  const handleSubmitReport = async (reason: string, details: string) => {
    if (!reportTarget) return;
    const targetName = 'name' in reportTarget ? reportTarget.name : `Comment (${reportTarget.id})`;
    await submitReport(reportTarget.id, reportTargetType, targetName, reason, details, 'Campus User');
    showToast('🚩 Report submitted to moderation team.');
  };

  const handleCreateProfileSubmit = async (data: Partial<CampusProfile>) => {
    const newP = await createNewProfile(data);
    await refreshAllData();
    setSelectedProfile(newP);
    setCurrentView('profile');
    showToast(`🎉 Profile for ${newP.name} created and added to the leaderboard!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newP;
  };

  const handleResetDemoData = async () => {
    if (window.confirm("Restore default Stanford, MIT, NYU demo profiles & ratings? This will overwrite your local changes.")) {
      localStorage.setItem('campusrank_profiles_v1', JSON.stringify(INITIAL_PROFILES));
      localStorage.setItem('campusrank_comments_v1', JSON.stringify(INITIAL_COMMENTS));
      localStorage.setItem('campusrank_activities_v1', JSON.stringify(INITIAL_ACTIVITIES));
      localStorage.setItem('campusrank_reports_v1', JSON.stringify([]));
      await refreshAllData();
      showToast('🔄 Demo seed profiles & ratings restored successfully.');
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-100 font-['Inter'] selection:bg-[#5B7FFF]/30 selection:text-white relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-gradient-to-r from-[#5B7FFF] to-[#8A5BFF] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 border border-white/20">
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onlineCount={stats?.onlineUsers || 354}
        onSearchSubmit={(q) => setSearchQuery(q)}
        isFirebaseLive={isFirebaseConnected()}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <HomeView
            profiles={profiles}
            activities={activities}
            stats={stats}
            onSelectProfile={handleSelectProfile}
            onOpenVoteModal={handleOpenVoteModal}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            profiles={profiles}
            initialSearchQuery={searchQuery}
            onSelectProfile={handleSelectProfile}
            onOpenVoteModal={handleOpenVoteModal}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            profiles={profiles}
            onSelectProfile={handleSelectProfile}
            onOpenVoteModal={handleOpenVoteModal}
          />
        )}

        {currentView === 'create' && (
          <CreateProfileView
            onCreateProfileSubmit={handleCreateProfileSubmit}
          />
        )}

        {currentView === 'profile' && selectedProfile && (
          <ProfileDetailView
            profile={selectedProfile}
            onBack={() => setCurrentView('explore')}
            onOpenVoteModal={handleOpenVoteModal}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            profiles={profiles}
            stats={stats}
            onRefreshData={refreshAllData}
            isFirebaseConnected={isFirebaseConnected()}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer
        onNavigate={handleNavigate}
        onResetDemoData={handleResetDemoData}
        isFirebaseLive={isFirebaseConnected()}
      />

      {/* Rating & Boosting Modal Dialog */}
      {voteModalOpen && profileToVote && (
        <RatingModal
          profile={profileToVote}
          isOpen={voteModalOpen}
          onClose={() => setVoteModalOpen(false)}
          onSubmitVote={handleSubmitVote}
          onOpenReport={(prof) => handleOpenReportModal(prof, 'profile')}
        />
      )}

      {/* Report Modal Dialog */}
      <ReportModal
        target={reportTarget}
        targetType={reportTargetType}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
      />

    </div>
  );
}
