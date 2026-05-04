'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createNewsletterSubscription } from '@/lib/firestore';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus('sending');
    try {
      await createNewsletterSubscription(email.trim());
      setSubStatus('done');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 3000);
    } catch {
      setSubStatus('idle');
      alert('Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="relative overflow-hidden bg-bg border-t border-border pt-16 flex flex-col justify-between">

      {/* SCALEON Watermark - Low opacity, placed far behind everything! */}
      <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-none select-none z-0 flex justify-center opacity-5 dark:opacity-10">
        <span className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter text-fg whitespace-nowrap">
          SCALEON.
        </span>
      </div>

      <div className="relative z-10 mx-auto w-[min(1200px,95vw)] px-5 pb-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-fg">
              ScaleOn
            </Link>
            <p className="max-w-sm text-fg/60 font-medium text-[15px] leading-relaxed">
              We combine performance media, creative systems, and data intelligence to help brands scale predictably.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex max-w-sm items-center rounded-xl border border-border bg-bg p-1 focus-within:border-fg/20 transition-all">
              <input
                type="email"
                placeholder="Join our newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-fg/30"
                required
              />
              <button
                type="submit"
                disabled={subStatus !== 'idle'}
                className="rounded-lg bg-fg px-5 py-2 text-sm font-semibold text-bg transition-all hover:opacity-80 flex-shrink-0 disabled:opacity-60"
              >
                {subStatus === 'sending' ? '...' : subStatus === 'done' ? '✓ Done' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.15em] text-fg/40">Company</h4>
            <ul className="space-y-3 text-sm font-medium text-fg/70">
              <li><Link href="/" className="hover:text-fg transition-colors">Home</Link></li>
              <li><Link href="/#features" className="hover:text-fg transition-colors">Features</Link></li>
              <li><Link href="/#works" className="hover:text-fg transition-colors">My Work</Link></li>
              <li><Link href="/#contact" className="hover:text-fg transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.15em] text-fg/40">Resources</h4>
            <ul className="space-y-3 text-sm font-medium text-fg/70">
              <li><Link href="/blog" className="hover:text-fg transition-colors">Growth Blog</Link></li>
              <li><a href="#" className="hover:text-fg transition-colors">Marketing Guides</a></li>
              <li><a href="#" className="hover:text-fg transition-colors">Media Kit</a></li>
              <li><a href="#" className="hover:text-fg transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-6 relative z-20">
          <p className="text-sm font-medium text-fg/40">
            © {new Date().getFullYear()} ScaleOn. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-fg/40 hover:text-fg transition-colors"><span className="sr-only">Twitter</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
            <a href="https://instagram.com/scaleon" className="text-fg/40 hover:text-fg transition-colors"><span className="sr-only">Instagram</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="https://linkedin.com/company/scaleon" className="text-fg/40 hover:text-fg transition-colors"><span className="sr-only">LinkedIn</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
