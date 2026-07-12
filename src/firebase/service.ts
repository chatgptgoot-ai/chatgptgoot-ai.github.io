import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { 
  CampusProfile, 
  CommentItem, 
  ActivityEvent, 
  ReportItem, 
  SiteStatistics, 
  LeaderboardCategory,
  LeaderboardTimeframe
} from '../types';
import { INITIAL_PROFILES, INITIAL_COMMENTS, INITIAL_ACTIVITIES } from '../data/mockProfiles';
import { cleanCommentText } from '../utils/profanity';

// Storage keys for GitHub Pages persistence
const PROFILES_KEY = 'campusrank_profiles_v1';
const COMMENTS_KEY = 'campusrank_comments_v1';
const ACTIVITIES_KEY = 'campusrank_activities_v1';
const REPORTS_KEY = 'campusrank_reports_v1';
const ADMIN_SESSION_KEY = 'campusrank_admin_v1';
const FIREBASE_CONFIG_KEY = 'campusrank_fb_config_v1';

// Check for custom firebase configuration in localStorage or env safely
export function getFirebaseConfig() {
  const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* ignore */ }
  }
  const env = (import.meta as unknown as { env: Record<string, string> }).env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || "",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: env.VITE_FIREBASE_APP_ID || ""
  };
}

export function saveFirebaseConfig(config: Record<string, string>) {
  localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
}

// Initialize optional real Firebase instances safely
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

try {
  const config = getFirebaseConfig();
  if (config && config.apiKey && config.projectId) {
    const app = initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  }
} catch (e) {
  console.warn("Using high-speed local engine for GitHub Pages static mode.", e);
}

export function isFirebaseConnected(): boolean {
  return db !== null;
}

export function getFirebaseAuthInstance() {
  return auth;
}

export function getFirebaseStorageInstance() {
  return storage;
}

// Ensure initial local storage population
function initLocalStorage() {
  if (!localStorage.getItem(PROFILES_KEY)) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
  }
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(INITIAL_COMMENTS));
  }
  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
  }
  if (!localStorage.getItem(REPORTS_KEY)) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify([]));
  }
}

initLocalStorage();

// Helper to recalculate all ranks based on overall score
function recalculateRanks(profiles: CampusProfile[]): CampusProfile[] {
  const sorted = [...profiles].sort((a, b) => b.overallScore - a.overallScore || b.totalVotes - a.totalVotes);
  return sorted.map((p, idx) => ({
    ...p,
    rank: idx + 1
  }));
}

// GET PROFILES
export async function getProfiles(): Promise<CampusProfile[]> {
  initLocalStorage();
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'profiles'));
      if (!snap.empty) {
        const list: CampusProfile[] = [];
        snap.forEach(docSnap => list.push(docSnap.data() as CampusProfile));
        return recalculateRanks(list);
      }
    } catch {
      // fallback to local storage
    }
  }
  const raw = localStorage.getItem(PROFILES_KEY);
  const profiles: CampusProfile[] = raw ? JSON.parse(raw) : INITIAL_PROFILES;
  return recalculateRanks(profiles);
}

// GET PROFILE BY ID
export async function getProfileById(id: string): Promise<CampusProfile | null> {
  const all = await getProfiles();
  return all.find(p => p.id === id) || null;
}

// SAVE PROFILES
export async function saveAllProfiles(profiles: CampusProfile[]): Promise<void> {
  const ranked = recalculateRanks(profiles);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(ranked));
  if (db) {
    try {
      for (const p of ranked) {
        await setDoc(doc(db, 'profiles', p.id), p);
      }
    } catch (err) {
      console.warn("Firestore sync error, saved locally", err);
    }
  }
}

// VOTE ON PROFILE
export async function voteOnProfile(
  profileId: string, 
  category: keyof CampusProfile['ratings'], 
  scoreValue: number
): Promise<{ updatedProfile: CampusProfile; newScore: number }> {
  const profiles = await getProfiles();
  const index = profiles.findIndex(p => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const target = profiles[index];
  const currentAvg = target.ratings[category] || 9.0;
  const currentCount = target.ratingCounts[category] || 10;

  // Calculate new weighted average
  const newCount = currentCount + 1;
  const newAvg = Number(((currentAvg * currentCount + scoreValue) / newCount).toFixed(1));

  // Update ratings and counts
  const newRatings = { ...target.ratings, [category]: newAvg };
  const newCounts = { ...target.ratingCounts, [category]: newCount };

  // Calculate overall score (average across the 6 core categories)
  const categories: (keyof CampusProfile['ratings'])[] = ['style', 'confidence', 'creativity', 'humor', 'kindness', 'charisma'];
  const totalSum = categories.reduce((sum, cat) => sum + (newRatings[cat] || 0), 0);
  const overallScore = Number((totalSum / categories.length).toFixed(1));

  const updatedProfile: CampusProfile = {
    ...target,
    ratings: newRatings,
    ratingCounts: newCounts,
    totalVotes: target.totalVotes + 1,
    overallScore
  };

  profiles[index] = updatedProfile;
  const reRanked = recalculateRanks(profiles);
  await saveAllProfiles(reRanked);

  // Add activity item
  const catNames: Record<string, string> = {
    style: 'Style',
    confidence: 'Confidence',
    creativity: 'Creativity',
    humor: 'Humor',
    kindness: 'Kindness',
    charisma: 'Charisma'
  };
  await addActivityEvent({
    id: 'act-' + Date.now(),
    profileId: target.id,
    type: 'rating_boost',
    description: `Someone voted +${scoreValue} in ${catNames[category]} for ${target.name}! ✨`,
    timestamp: 'Just now',
    icon: 'Star'
  });

  return { 
    updatedProfile: reRanked.find(p => p.id === profileId) || updatedProfile, 
    newScore: newAvg 
  };
}

// COMMENTS SYSTEM
export async function getComments(profileId?: string): Promise<CommentItem[]> {
  initLocalStorage();
  const raw = localStorage.getItem(COMMENTS_KEY);
  const all: CommentItem[] = raw ? JSON.parse(raw) : INITIAL_COMMENTS;
  if (profileId) {
    return all.filter(c => c.profileId === profileId);
  }
  return all;
}

export async function addComment(
  profileId: string, 
  authorName: string, 
  content: string,
  authorAvatar?: string
): Promise<{ comment: CommentItem; hadProfanity: boolean }> {
  const { cleaned, hadProfanity } = cleanCommentText(content);
  const all = await getComments();

  const newComment: CommentItem = {
    id: 'c-' + Date.now(),
    profileId,
    authorName: authorName.trim() || 'Anonymous Student',
    authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    content: cleaned,
    timestamp: 'Just now',
    likes: 1,
    isHelpful: false
  };

  const updated = [newComment, ...all];
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));

  if (db) {
    try { await setDoc(doc(db, 'comments', newComment.id), newComment); } catch { /* ignore */ }
  }

  // Activity log
  const profile = await getProfileById(profileId);
  if (profile) {
    await addActivityEvent({
      id: 'act-' + Date.now(),
      profileId,
      type: 'compliment',
      description: `${newComment.authorName} left a respectful compliment for ${profile.name} 💬`,
      timestamp: 'Just now',
      icon: 'MessageSquare'
    });
  }

  return { comment: newComment, hadProfanity };
}

export async function likeComment(commentId: string): Promise<CommentItem | null> {
  const all = await getComments();
  const idx = all.findIndex(c => c.id === commentId);
  if (idx === -1) return null;

  const current = all[idx];
  const liked = !current.likedByCurrentUser;
  const updated: CommentItem = {
    ...current,
    likes: current.likes + (liked ? 1 : -1),
    likedByCurrentUser: liked,
    isHelpful: (current.likes + (liked ? 1 : -1)) > 10
  };

  all[idx] = updated;
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  return updated;
}

export async function deleteCommentById(commentId: string): Promise<void> {
  const all = await getComments();
  const filtered = all.filter(c => c.id !== commentId);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filtered));
  if (db) {
    try { await deleteDoc(doc(db, 'comments', commentId)); } catch { /* ignore */ }
  }
}

// ACTIVITIES
export async function getActivities(): Promise<ActivityEvent[]> {
  initLocalStorage();
  const raw = localStorage.getItem(ACTIVITIES_KEY);
  return raw ? JSON.parse(raw) : INITIAL_ACTIVITIES;
}

export async function addActivityEvent(event: ActivityEvent): Promise<void> {
  const all = await getActivities();
  const updated = [event, ...all].slice(0, 50); // keep recent 50
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
}

// REPORTS
export async function getReports(): Promise<ReportItem[]> {
  initLocalStorage();
  const raw = localStorage.getItem(REPORTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function submitReport(
  targetId: string,
  targetType: 'profile' | 'comment',
  targetName: string,
  reason: string,
  details: string,
  reportedBy: string
): Promise<ReportItem> {
  const all = await getReports();
  const report: ReportItem = {
    id: 'rep-' + Date.now(),
    targetId,
    targetType,
    targetName,
    reason,
    details,
    reportedBy: reportedBy || 'Campus Citizen',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  const updated = [report, ...all];
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  return report;
}

export async function resolveReport(reportId: string, status: 'resolved' | 'dismissed'): Promise<void> {
  const all = await getReports();
  const updated = all.map(r => r.id === reportId ? { ...r, status } : r);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
}

// CREATE NEW PROFILE
export async function createNewProfile(data: Partial<CampusProfile>): Promise<CampusProfile> {
  const profiles = await getProfiles();
  const id = 'profile-' + (Date.now());
  const newProfile: CampusProfile = {
    id,
    name: data.name || 'New Campus Student',
    handle: data.handle || `@student_${Math.floor(Math.random() * 900 + 100)}`,
    avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    bio: data.bio || 'New to CampusRank! Ready to connect, collaborate, and share campus experiences.',
    campus: data.campus || 'Global Campus',
    major: data.major || 'Undecided',
    graduationYear: data.graduationYear || 2027,
    socialLinks: data.socialLinks || {},
    gallery: data.gallery && data.gallery.length ? data.gallery : [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 9.0,
      confidence: 9.0,
      creativity: 9.0,
      humor: 9.0,
      kindness: 9.0,
      charisma: 9.0
    },
    ratingCounts: {
      style: 1,
      confidence: 1,
      creativity: 1,
      humor: 1,
      kindness: 1,
      charisma: 1
    },
    totalVotes: 6,
    overallScore: 9.0,
    badges: ['New Rising Star', 'Verified Student'],
    isVerified: true,
    isTrending: true,
    createdAt: new Date().toISOString()
  };

  const updated = [newProfile, ...profiles];
  await saveAllProfiles(updated);

  await addActivityEvent({
    id: 'act-' + Date.now(),
    profileId: newProfile.id,
    type: 'milestone',
    description: `${newProfile.name} from ${newProfile.campus} joined the CampusRank community! 🎉`,
    timestamp: 'Just now',
    icon: 'UserPlus'
  });

  return newProfile;
}

export async function deleteProfileById(id: string): Promise<void> {
  const profiles = await getProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  await saveAllProfiles(filtered);
  if (db) {
    try { await deleteDoc(doc(db, 'profiles', id)); } catch { /* ignore */ }
  }
}

// STATISTICS GENERATOR
export async function getSiteStatistics(): Promise<SiteStatistics> {
  const profiles = await getProfiles();
  const totalVotes = profiles.reduce((sum, p) => sum + (p.totalVotes || 0), 0);
  const trendingCount = profiles.filter(p => p.isTrending).length;

  // Category breakdown
  const categories: (keyof CampusProfile['ratings'])[] = ['style', 'confidence', 'creativity', 'humor', 'kindness', 'charisma'];
  const categoryBreakdown = categories.map(cat => {
    const avg = profiles.reduce((acc, p) => acc + (p.ratings[cat] || 0), 0) / (profiles.length || 1);
    const names: Record<string, string> = {
      style: 'Style',
      confidence: 'Confidence',
      creativity: 'Creativity',
      humor: 'Humor',
      kindness: 'Kindness',
      charisma: 'Charisma'
    };
    return {
      category: names[cat],
      averageScore: Number(avg.toFixed(1))
    };
  });

  // Simulated 7-day realistic progression chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyActivity = days.map((day, idx) => ({
    day,
    votes: Math.floor(totalVotes / 7 + (idx - 3) * 35 + Math.random() * 20),
    newProfiles: Math.floor(profiles.length / 7 + idx + 1)
  }));

  return {
    totalProfiles: profiles.length,
    totalVotes,
    onlineUsers: 342 + Math.floor(Math.random() * 25), // dynamic realistic live count
    trendingCount,
    dailyActivity,
    categoryBreakdown
  };
}

// ADMIN AUTHENTICATION
export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function loginAdminSession(password: string): boolean {
  if (password === 'campusrank2026' || password === 'admin') {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    return true;
  }
  return false;
}

export function logoutAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// FILTER & SORT LEADERBOARD
export function filterLeaderboard(
  profiles: CampusProfile[],
  timeframe: LeaderboardTimeframe,
  category: LeaderboardCategory,
  searchQuery: string
): CampusProfile[] {
  let list = [...profiles];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.handle.toLowerCase().includes(q) ||
      p.campus.toLowerCase().includes(q) ||
      p.major.toLowerCase().includes(q)
    );
  }

  // Timeframe variance (today/week/month/all)
  // For 'today' and 'week', we sort by who gained the highest momentum or trending status first
  if (timeframe === 'today') {
    list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.overallScore - a.overallScore);
  } else if (timeframe === 'week') {
    list.sort((a, b) => b.totalVotes - a.totalVotes || b.overallScore - a.overallScore);
  } else {
    // Sort by category or overall
    if (category === 'overall') {
      list.sort((a, b) => b.overallScore - a.overallScore || b.totalVotes - a.totalVotes);
    } else {
      list.sort((a, b) => (b.ratings[category] || 0) - (a.ratings[category] || 0) || b.totalVotes - a.totalVotes);
    }
  }

  // Assign position index dynamically based on current filter
  return list.map((p, idx) => ({
    ...p,
    rank: idx + 1
  }));
}
