export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserProfile {
  uid: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    x?: string;
    website?: string;
  };
  role: UserRole;
  banned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  uid: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  uid: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  likes: string[];
  reports: number;
  pinned?: boolean;
  commentsLocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: 'Marketing' | 'AI' | 'Social Media' | 'Trends';
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'scheduled' | 'published';
  publishAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
  responded: boolean;
  createdAt: string;
}
