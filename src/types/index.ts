export interface RatingBreakdown {
  style: number;
  confidence: number;
  creativity: number;
  humor: number;
  kindness: number;
  charisma: number;
}

export interface RatingCounts {
  style: number;
  confidence: number;
  creativity: number;
  humor: number;
  kindness: number;
  charisma: number;
}

export interface CommentItem {
  id: string;
  profileId: string;
  authorName: string;
  authorAvatar: string;
  content: string; // supports emoji and basic markdown
  timestamp: string;
  likes: number;
  likedByCurrentUser?: boolean;
  isHelpful?: boolean;
  isReported?: boolean;
}

export interface ActivityEvent {
  id: string;
  profileId: string;
  type: 'rating_boost' | 'new_rank' | 'compliment' | 'milestone';
  description: string;
  timestamp: string;
  icon: string;
}

export interface CampusProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  campus: string;
  major: string;
  graduationYear: number;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    tiktok?: string;
    portfolio?: string;
  };
  gallery: string[];
  ratings: RatingBreakdown;
  ratingCounts: RatingCounts;
  totalVotes: number;
  overallScore: number;
  rank?: number;
  badges: string[];
  isVerified?: boolean;
  isTrending?: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  targetId: string;
  targetType: 'profile' | 'comment';
  targetName: string;
  reason: string;
  details: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface SiteStatistics {
  totalProfiles: number;
  totalVotes: number;
  onlineUsers: number;
  trendingCount: number;
  dailyActivity: { day: string; votes: number; newProfiles: number }[];
  categoryBreakdown: { category: string; averageScore: number }[];
}

export type PageView = 'home' | 'explore' | 'profile' | 'leaderboard' | 'create' | 'admin' | 'settings';

export type LeaderboardTimeframe = 'today' | 'week' | 'month' | 'all';
export type LeaderboardCategory = 'overall' | 'style' | 'confidence' | 'creativity' | 'humor' | 'kindness' | 'charisma';
