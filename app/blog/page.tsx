'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { BLOG_CATEGORIES } from '@/lib/constants';
import { createContactSubmission, subscribePublishedBlogs } from '@/lib/firestore';
import type { BlogPost } from '@/types/models';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<string>('All');
  
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = subscribePublishedBlogs(setBlogs);
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (category === 'All') return blogs;
    return blogs.filter((blog) => blog.category === category);
  }, [blogs, category]);

  const onAuthorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      businessType: 'Guest Author Application',
      message: String(form.get('message') || ''),
    };

    setSending(true);
    try {
      await createContactSubmission(payload);
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      alert('Application sent successfully! We will review your profile and reach out.');
      setShowForm(false);
    } catch {
      alert('Failed to send application right now. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="section-wrap min-h-screen">
      <div className="mb-12 flex flex-col items-center justify-center text-center mt-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4">The Growth Blog</h1>
        <p className="text-lg text-fg/60 max-w-2xl">Frameworks, case studies, and tactical advice from operators who have actually done it.</p>
        
        <div className="flex flex-wrap gap-2 mt-8 justify-center">
          {['All', ...BLOG_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${category === cat ? 'bg-fg text-background dark:bg-white dark:text-black border-transparent' : 'border-border/60 hover:border-fg/40'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24">
        {filtered.map((blog) => (
          <GlassCard key={blog.id} className="flex flex-col justify-between !rounded-[2rem] p-8 transition-transform hover:-translate-y-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">{blog.category}</p>
              <h2 className="text-2xl font-bold leading-snug">{blog.title}</h2>
              <p className="mt-4 text-fg/70 leading-relaxed text-sm">{blog.excerpt}</p>
            </div>
            <Link className="mt-8 inline-block text-sm font-bold text-fg underline decoration-2 underline-offset-4 decoration-accent" href={`/blog/${blog.slug}`}>
              Read article
            </Link>
          </GlassCard>
        ))}
      </div>

      {/* Request to Post Section */}
      <GlassCard className="mx-auto max-w-3xl text-center !rounded-[3rem] p-12 border-border/40 bg-card/30 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
        <h3 className="text-3xl font-bold tracking-tight">Have an insight to share?</h3>
        <p className="mt-4 text-fg/70 font-medium mb-8 max-w-lg">We're always looking for sharp operators and founders to share their journey and analytical breakdowns.</p>
        
        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            className="rounded-full bg-accent px-8 py-4 text-base font-extrabold tracking-wide text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] inline-block cursor-pointer"
          >
            Request to Author Blogs
          </button>
        ) : (
          <form onSubmit={onAuthorSubmit} className="mt-8 grid gap-6 w-full text-left bg-black/40 p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-xl animate-in fade-in duration-500">
            <h4 className="font-extrabold text-3xl mb-4 text-center tracking-tight text-white">Guest Author Application</h4>
            
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 pl-2">Name</label>
               <input name="name" required placeholder="John Doe" className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 px-5 font-semibold text-sm text-white placeholder-white/30 transition-all focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent outline-none shadow-inner" />
            </div>
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 pl-2">Email Address</label>
               <input name="email" type="email" required placeholder="john@company.com" className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 px-5 font-semibold text-sm text-white placeholder-white/30 transition-all focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent outline-none shadow-inner" />
            </div>
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 pl-2">Phone Number</label>
               <input name="phone" required placeholder="+1 234 567 890" className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 px-5 font-semibold text-sm text-white placeholder-white/30 transition-all focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent outline-none shadow-inner" />
            </div>
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 pl-2">What would you write about?</label>
               <textarea name="message" required placeholder="Tell us about the frameworks or insights you want to share..." className="w-full min-h-36 rounded-2xl border border-white/10 bg-white/5 p-5 font-semibold text-sm text-white placeholder-white/30 transition-all focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent outline-none resize-none shadow-inner" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button disabled={sending} className="w-full sm:flex-[2] h-16 rounded-2xl bg-accent font-extrabold tracking-wide text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-[1.02] disabled:opacity-70 flex justify-center items-center text-lg">
                {sending ? 'Sending...' : 'Submit Application'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full sm:flex-[1] h-16 rounded-2xl font-extrabold tracking-wide bg-white/5 border border-white/10 text-white/70 transition-all hover:bg-white/10 hover:text-white">
                Cancel
              </button>
            </div>
          </form>
        )}
      </GlassCard>
    </main>
  );
}
