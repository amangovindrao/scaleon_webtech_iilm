'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { GlassCard } from '@/components/ui/GlassCard';
import { getUserProfile, subscribePublishedBlogs } from '@/lib/firestore';
import type { UserProfile, BlogPost } from '@/types/models';

export default function ProfilePage() {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    void getUserProfile(uid).then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribePublishedBlogs((allBlogs) => {
      setBlogs(allBlogs.filter((b) => b.createdBy === uid));
    });
    return () => unsub();
  }, [uid]);

  if (loading) return <main className="section-wrap min-h-[50vh] flex items-center justify-center">Loading profile...</main>;
  if (!profile) return <main className="section-wrap min-h-[50vh] flex items-center justify-center">User not found.</main>;

  return (
    <main className="section-wrap min-h-screen pt-20">
      <div className="max-w-3xl mx-auto">
        <GlassCard className="flex items-center gap-6 p-8 !rounded-[2rem]">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border/50">
            <img 
              src={profile.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150'} 
              alt={profile.fullName} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{profile.fullName}</h1>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider">{profile.role}</p>
          </div>
        </GlassCard>

        <h2 className="mt-12 text-2xl font-bold tracking-tight mb-6">Articles by {profile.fullName.split(' ')[0]}</h2>
        
        {blogs.length === 0 ? (
          <p className="text-fg/60">No published articles yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {blogs.map((blog) => (
              <GlassCard key={blog.id} className="flex flex-col justify-between group">
                <div>
                  <p className="text-xs uppercase tracking-wide text-fg/60 mb-2">{blog.category}</p>
                  <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{blog.title}</h3>
                </div>
                <Link href={`/blog/${blog.slug}`} className="mt-4 text-sm font-semibold text-accent block">
                  Read article &rarr;
                </Link>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
