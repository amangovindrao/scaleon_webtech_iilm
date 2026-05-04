'use client';

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe
} from 'firebase/firestore';

import { COLLECTIONS } from '@/lib/constants';
import { db } from '@/lib/firebase/client';
import type { BlogPost, CommunityComment, CommunityPost, ContactSubmission, UserProfile } from '@/types/models';

export const subscribeCommunityPosts = (cb: (posts: CommunityPost[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.communityPosts), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<CommunityPost, 'id'>) })));
  });
};

export const createCommunityPost = async (payload: Omit<CommunityPost, 'id' | 'likes' | 'reports' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, COLLECTIONS.communityPosts), {
    ...payload,
    likes: [],
    reports: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

export const updateCommunityPost = async (postId: string, content: string) => {
  return updateDoc(doc(db, COLLECTIONS.communityPosts, postId), {
    content,
    updatedAt: new Date().toISOString()
  });
};

export const deleteCommunityPost = async (postId: string) => {
  return deleteDoc(doc(db, COLLECTIONS.communityPosts, postId));
};

export const toggleCommunityLike = async (postId: string, uid: string, liked: boolean) => {
  return updateDoc(doc(db, COLLECTIONS.communityPosts, postId), {
    likes: liked ? arrayRemove(uid) : arrayUnion(uid)
  });
};

export const reportCommunityPost = async (postId: string) => {
  const ref = doc(db, COLLECTIONS.communityPosts, postId);
  const snapshot = await getDoc(ref);
  const reports = Number(snapshot.data()?.reports || 0);
  return updateDoc(ref, { reports: reports + 1 });
};

export const moderateCommunityPost = async (
  postId: string,
  payload: Partial<Pick<CommunityPost, 'pinned' | 'commentsLocked'>>
) => {
  return updateDoc(doc(db, COLLECTIONS.communityPosts, postId), {
    ...payload,
    updatedAt: new Date().toISOString()
  });
};

export const createComment = async (payload: Omit<CommunityComment, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, COLLECTIONS.communityComments), {
    ...payload,
    createdAt: new Date().toISOString()
  });
};

export const subscribeComments = (postId: string, cb: (comments: CommunityComment[]) => void): Unsubscribe => {
  const q = query(
    collection(db, COLLECTIONS.communityComments),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<CommunityComment, 'id'>) })));
  });
};

export const saveUserProfile = async (uid: string, payload: Partial<UserProfile>) => {
  const ref = doc(db, COLLECTIONS.users, uid);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    return updateDoc(ref, { ...payload, updatedAt: new Date().toISOString() });
  }

  return setDoc(ref, {
    uid,
    role: 'user',
    banned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...payload
  });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(db, COLLECTIONS.users, uid));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as UserProfile;
};

export const subscribePublishedBlogs = (cb: (posts: BlogPost[]) => void): Unsubscribe => {
  const q = query(
    collection(db, COLLECTIONS.blogPosts),
    where('status', '==', 'published'),
    orderBy('publishAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BlogPost, 'id'>) })));
  });
};

export const subscribeAllBlogs = (cb: (posts: BlogPost[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.blogPosts), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BlogPost, 'id'>) })));
  });
};

export const getBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
  const q = query(collection(db, COLLECTIONS.blogPosts), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }

  const docData = snapshot.docs[0];
  return { id: docData.id, ...(docData.data() as Omit<BlogPost, 'id'>) };
};

export const createOrUpdateBlog = async (payload: Partial<BlogPost> & { title: string; slug: string }) => {
  const data = {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt ?? '',
    content: payload.content ?? '',
    coverImage: payload.coverImage ?? '',
    category: payload.category ?? 'Marketing',
    tags: payload.tags ?? [],
    seoTitle: payload.seoTitle ?? payload.title,
    seoDescription: payload.seoDescription ?? payload.excerpt ?? '',
    status: payload.status ?? 'draft',
    publishAt: payload.publishAt ?? new Date().toISOString(),
    createdBy: payload.createdBy ?? '',
    updatedAt: new Date().toISOString()
  };

  if (payload.id) {
    return updateDoc(doc(db, COLLECTIONS.blogPosts, payload.id), data);
  }

  return addDoc(collection(db, COLLECTIONS.blogPosts), {
    ...data,
    createdAt: new Date().toISOString()
  });
};

export const deleteBlog = async (blogId: string) => {
  return deleteDoc(doc(db, COLLECTIONS.blogPosts, blogId));
};

export const createContactSubmission = async (payload: Omit<ContactSubmission, 'id' | 'responded' | 'createdAt'>) => {
  return addDoc(collection(db, COLLECTIONS.contactSubmissions), {
    ...payload,
    responded: false,
    createdAt: new Date().toISOString()
  });
};

export const subscribeContactSubmissions = (cb: (items: ContactSubmission[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.contactSubmissions), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<ContactSubmission, 'id'>) })));
  });
};

export const setContactResponded = async (id: string, responded: boolean) => {
  return updateDoc(doc(db, COLLECTIONS.contactSubmissions, id), { responded });
};

export const deleteContactSubmission = async (id: string) => {
  return deleteDoc(doc(db, COLLECTIONS.contactSubmissions, id));
};

export const subscribeUsers = (cb: (users: UserProfile[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.users), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map((docItem) => docItem.data() as UserProfile));
  });
};

export const updateUserRoleOrStatus = async (uid: string, payload: Partial<Pick<UserProfile, 'role' | 'banned'>>) => {
  return updateDoc(doc(db, COLLECTIONS.users, uid), {
    ...payload,
    updatedAt: new Date().toISOString()
  });
};

export const createNewsletterSubscription = async (email: string) => {
  return addDoc(collection(db, COLLECTIONS.newsletterSubscribers), {
    email,
    subscribedAt: new Date().toISOString()
  });
};
