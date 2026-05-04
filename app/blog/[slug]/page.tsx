'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { GlassCard } from '@/components/ui/GlassCard';
import { getBlogBySlug, getUserProfile } from '@/lib/firestore';
import type { BlogPost, UserProfile } from '@/types/models';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!slug) return;
    void getBlogBySlug(slug).then(b => {
      setBlog(b);
      if (b?.createdBy) {
        getUserProfile(b.createdBy).then(setAuthor);
      }
    });
  }, [slug]);

  if (!blog) {
    return <main className="section-wrap min-h-[50vh] flex items-center justify-center text-lg font-medium text-fg/60">Loading article...</main>;
  }

  return (
    <main className="section-wrap pt-16">
      <Link href="/blog" className="text-sm font-semibold text-fg/50 hover:text-fg mb-8 inline-block">&larr; Back to articles</Link>
      
      <GlassCard className="mx-auto max-w-4xl p-8 md:p-12 !rounded-[2rem] border-border/40">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">{blog.category}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight">{blog.title}</h1>
        
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border/40 py-6">
          {author ? (
            <Link href={`/profile/${author.uid}`} className="flex items-center gap-3 group">
              <img 
                src={author.photoURL || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64'} 
                alt={author.fullName} 
                className="h-10 w-10 rounded-full object-cover border border-border/50 group-hover:border-accent transition-colors"
              />
              <div>
                <p className="text-sm font-bold text-fg group-hover:text-accent transition-colors">{author.fullName}</p>
                <p className="text-xs font-semibold text-fg/50 uppercase tracking-widest">{author.role}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted border border-border/50 flex items-center justify-center">?</div>
              <p className="text-sm font-bold text-fg">Unknown Author</p>
            </div>
          )}
          
          <p className="text-sm font-semibold text-fg/40 uppercase tracking-wider">
            {new Date(blog.publishAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <article className="mt-12 whitespace-pre-wrap text-lg text-fg/80 leading-relaxed font-medium">
          {blog.content}
        </article>
      </GlassCard>
    </main>
  );
}
