import { CampusProfile, CommentItem, ActivityEvent } from '../types';

export const INITIAL_PROFILES: CampusProfile[] = [
  {
    id: 'profile-1',
    name: 'Elena Rostova',
    handle: '@elena_design',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    bio: 'Senior UX & Interaction Design major @ Stanford. Obsessed with glassmorphic interfaces, synthwave aesthetics, and ethical AI typography. Building digital experiences that feel like magic ✨',
    campus: 'Stanford University',
    major: 'Interaction Design & CS',
    graduationYear: 2026,
    socialLinks: {
      instagram: 'https://instagram.com/elena_design',
      linkedin: 'https://linkedin.com/in/elena-rostova',
      portfolio: 'https://dribbble.com',
      twitter: 'https://x.com/elena_ux'
    },
    gallery: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 9.7,
      confidence: 9.4,
      creativity: 9.9,
      humor: 8.8,
      kindness: 9.6,
      charisma: 9.5
    },
    ratingCounts: {
      style: 142,
      confidence: 128,
      creativity: 189,
      humor: 94,
      kindness: 156,
      charisma: 138
    },
    totalVotes: 847,
    overallScore: 9.6,
    rank: 1,
    badges: ['Design Prodigy', 'Top 1% Creativity', 'Verified Scholar', 'Trendsetter'],
    isVerified: true,
    isTrending: true,
    createdAt: '2026-01-14T10:00:00Z'
  },
  {
    id: 'profile-2',
    name: 'Marcus Vance',
    handle: '@marcus_vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    bio: 'MIT Robotics lab researcher & marathon runner. Co-founder of a clean-tech battery startup. Will debug your neural net over espresso ☕️ or debate quantum computing at midnight.',
    campus: 'MIT',
    major: 'Robotics & Electrical Engineering',
    graduationYear: 2026,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/marcus-vance',
      github: 'https://github.com/marcusvance',
      twitter: 'https://x.com/marcus_ai'
    },
    gallery: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 8.9,
      confidence: 9.8,
      creativity: 9.5,
      humor: 9.1,
      kindness: 9.3,
      charisma: 9.6
    },
    ratingCounts: {
      style: 98,
      confidence: 164,
      creativity: 145,
      humor: 112,
      kindness: 130,
      charisma: 152
    },
    totalVotes: 801,
    overallScore: 9.5,
    rank: 2,
    badges: ['Founder Club', 'Charisma Champion', 'Verified Scholar'],
    isVerified: true,
    isTrending: true,
    createdAt: '2026-01-10T14:30:00Z'
  },
  {
    id: 'profile-3',
    name: 'Sofia Reyes',
    handle: '@sofia_beats',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    bio: 'Music Production & Acoustic Engineering @ NYU Tisch. Producing cinematic electro-pop tracks. Always hunting for vintage synthesizers and authentic campus vibes 🎧',
    campus: 'NYU',
    major: 'Music Technology & Audio Engineering',
    graduationYear: 2027,
    socialLinks: {
      instagram: 'https://instagram.com/sofia_beats',
      tiktok: 'https://tiktok.com/@sofiareyes',
      portfolio: 'https://soundcloud.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 9.8,
      confidence: 9.2,
      creativity: 9.7,
      humor: 9.4,
      kindness: 9.1,
      charisma: 9.3
    },
    ratingCounts: {
      style: 165,
      confidence: 110,
      creativity: 172,
      humor: 134,
      kindness: 108,
      charisma: 125
    },
    totalVotes: 814,
    overallScore: 9.4,
    rank: 3,
    badges: ['Style Icon', 'Auditory Alchemist', 'Verified Scholar'],
    isVerified: true,
    isTrending: true,
    createdAt: '2026-01-18T09:15:00Z'
  },
  {
    id: 'profile-4',
    name: 'Devon Chen',
    handle: '@devon_codes',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
    bio: 'Full Stack Engineer @ UC Berkeley. Hackathon addict (4x winner), building high-performance decentralized tools. Huge fan of mechanical keyboards and late-night ramen runs 🍜',
    campus: 'UC Berkeley',
    major: 'Computer Science',
    graduationYear: 2026,
    socialLinks: {
      github: 'https://github.com/devonchen',
      linkedin: 'https://linkedin.com/in/devonchen',
      twitter: 'https://x.com/devon_codes'
    },
    gallery: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 8.7,
      confidence: 9.3,
      creativity: 9.6,
      humor: 9.5,
      kindness: 9.4,
      charisma: 9.0
    },
    ratingCounts: {
      style: 88,
      confidence: 120,
      creativity: 154,
      humor: 142,
      kindness: 135,
      charisma: 110
    },
    totalVotes: 749,
    overallScore: 9.3,
    rank: 4,
    badges: ['Hackathon Legend', 'Humor Maestro', 'Verified Scholar'],
    isVerified: true,
    isTrending: false,
    createdAt: '2026-01-05T11:20:00Z'
  },
  {
    id: 'profile-5',
    name: 'Aria Montgomery',
    handle: '@aria_m',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    bio: 'Behavioral Economics & Psychology @ Columbia University. President of the Debate Guild. Fascinated by decision theory, game theory, and vintage French cinema 🎬',
    campus: 'Columbia University',
    major: 'Behavioral Economics',
    graduationYear: 2027,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aria-montgomery',
      instagram: 'https://instagram.com/aria_m'
    },
    gallery: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 9.4,
      confidence: 9.7,
      creativity: 9.1,
      humor: 8.9,
      kindness: 9.6,
      charisma: 9.4
    },
    ratingCounts: {
      style: 115,
      confidence: 148,
      creativity: 102,
      humor: 95,
      kindness: 138,
      charisma: 132
    },
    totalVotes: 730,
    overallScore: 9.3,
    rank: 5,
    badges: ['Debate Champion', 'Kindness Luminary', 'Verified Scholar'],
    isVerified: true,
    isTrending: true,
    createdAt: '2026-01-12T16:00:00Z'
  },
  {
    id: 'profile-6',
    name: 'Liam Thorne',
    handle: '@liam_architecture',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    bio: 'Sustainable Architecture & Urban Planning @ Cornell University. Designing net-zero biodynamic structures for the campus of tomorrow. Amateur potter and bouldering enthusiast 🧗‍♂️',
    campus: 'Cornell University',
    major: 'Architecture',
    graduationYear: 2026,
    socialLinks: {
      instagram: 'https://instagram.com/liam_arch',
      portfolio: 'https://behance.net'
    },
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 9.3,
      confidence: 9.1,
      creativity: 9.8,
      humor: 8.7,
      kindness: 9.5,
      charisma: 9.2
    },
    ratingCounts: {
      style: 104,
      confidence: 98,
      creativity: 160,
      humor: 82,
      kindness: 130,
      charisma: 110
    },
    totalVotes: 684,
    overallScore: 9.2,
    rank: 6,
    badges: ['Eco Visionary', 'Master Builder'],
    isVerified: true,
    isTrending: false,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'profile-7',
    name: 'Zara Patel',
    handle: '@zara_bio',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
    bio: 'Synthetic Biology & Genetics @ Johns Hopkins. Developing novel biosensors for clean water access. Classical violinist & tea connoisseur 🫖',
    campus: 'Johns Hopkins University',
    major: 'Biomedical Engineering',
    graduationYear: 2027,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/zara-patel',
      twitter: 'https://x.com/zarapatel'
    },
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 9.0,
      confidence: 9.3,
      creativity: 9.5,
      humor: 9.1,
      kindness: 9.8,
      charisma: 9.1
    },
    ratingCounts: {
      style: 90,
      confidence: 105,
      creativity: 125,
      humor: 95,
      kindness: 162,
      charisma: 102
    },
    totalVotes: 679,
    overallScore: 9.2,
    rank: 7,
    badges: ['Kindness Luminary', 'Verified Scholar'],
    isVerified: true,
    isTrending: false,
    createdAt: '2026-01-16T12:00:00Z'
  },
  {
    id: 'profile-8',
    name: 'Noah Brooks',
    handle: '@noah_films',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
    bio: 'Cinematography & Film Directing @ UCLA. Directed 3 award-winning indie shorts. Creating visual stories about urban youth and technology culture 🎥',
    campus: 'UCLA',
    major: 'Film & Television',
    graduationYear: 2026,
    socialLinks: {
      instagram: 'https://instagram.com/noahbrooks',
      portfolio: 'https://vimeo.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80'
    ],
    ratings: {
      style: 9.6,
      confidence: 9.0,
      creativity: 9.7,
      humor: 9.2,
      kindness: 8.9,
      charisma: 9.3
    },
    ratingCounts: {
      style: 120,
      confidence: 92,
      creativity: 145,
      humor: 105,
      kindness: 88,
      charisma: 112
    },
    totalVotes: 662,
    overallScore: 9.1,
    rank: 8,
    badges: ['Director Choice', 'Style Icon'],
    isVerified: true,
    isTrending: false,
    createdAt: '2026-01-17T15:45:00Z'
  }
];

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c-1',
    profileId: 'profile-1',
    authorName: 'Devon Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    content: 'Elena’s new interaction prototype for the Stanford design showcase is literally **mind-blowing**. The glassmorphism transitions feel so natural! 🔥🚀',
    timestamp: '2 hours ago',
    likes: 24,
    isHelpful: true
  },
  {
    id: 'c-2',
    profileId: 'profile-1',
    authorName: 'Sofia Reyes',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    content: 'Always brings the best energy to campus workshops and helped me fix my portfolio layout in 10 minutes! ❤️✨',
    timestamp: '5 hours ago',
    likes: 19,
    isHelpful: true
  },
  {
    id: 'c-3',
    profileId: 'profile-2',
    authorName: 'Liam Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    content: 'Marcus gave an incredible talk at the robotics symposium yesterday. Super articulate and humble about his research breakthroughs! 🤖👏',
    timestamp: '1 day ago',
    likes: 31,
    isHelpful: true
  },
  {
    id: 'c-4',
    profileId: 'profile-3',
    authorName: 'Aria Montgomery',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    content: 'Sofia’s synthwave set at the campus spring festival was unforgettable. Unrivaled creativity and vibe! 🎧⚡️',
    timestamp: '3 hours ago',
    likes: 18,
    isHelpful: true
  }
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    profileId: 'profile-1',
    type: 'new_rank',
    description: 'Elena Rostova claimed the #1 Overall Spot on the Campus Leaderboard! 👑',
    timestamp: '10 mins ago',
    icon: 'Trophy'
  },
  {
    id: 'act-2',
    profileId: 'profile-2',
    type: 'rating_boost',
    description: 'Marcus Vance crossed 9.8 in Confidence score from peer votes! ⚡️',
    timestamp: '25 mins ago',
    icon: 'Zap'
  },
  {
    id: 'act-3',
    profileId: 'profile-3',
    type: 'compliment',
    description: 'Sofia Reyes received 15 new Creativity endorsements today! 🎨',
    timestamp: '1 hour ago',
    icon: 'Sparkles'
  },
  {
    id: 'act-4',
    profileId: 'profile-4',
    type: 'milestone',
    description: 'Devon Chen reached over 700 total positive campus ratings! 🚀',
    timestamp: '2 hours ago',
    icon: 'Award'
  }
];
