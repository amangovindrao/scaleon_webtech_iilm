'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/**
 * NAVBAR — To update the logo:
 * Replace the <span> text below with an <img> tag:
 * <img src="/your-logo.png" alt="ScaleOn" className="h-7 w-auto" />
 */

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#works', label: 'Works' },
    { href: '/blog', label: 'Blog' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-5 z-50 mx-auto w-full max-w-[900px] px-5">
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center justify-between rounded-full border border-border bg-bg/90 px-8 py-5 shadow-glass-large shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-glass-dark backdrop-blur-lg">
        <div className="flex gap-6 text-base font-semibold text-fg/70">
          {navLinks.slice(0, 2).map(link => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-fg">{link.label}</Link>
          ))}
        </div>

        {/* ── LOGO: Replace this span with <img src="/your-logo.png" alt="ScaleOn" className="h-7 w-auto" /> ── */}
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
          <span className="text-2xl font-extrabold tracking-tight text-fg">ScaleOn</span>
        </Link>

        <div className="flex items-center gap-6 text-base font-semibold text-fg/70">
          {navLinks.slice(2).map(link => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-fg">{link.label}</Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden">
        <div className="flex items-center justify-between rounded-full border border-border bg-bg/90 px-5 py-4 shadow-glass dark:shadow-glass-dark backdrop-blur-lg">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-extrabold tracking-tight text-fg">ScaleOn</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-fg/5 transition-colors" aria-label="Toggle menu">
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="mt-2 rounded-2xl border border-border bg-bg/95 p-3 shadow-glass dark:shadow-glass-dark backdrop-blur-lg flex flex-col gap-0.5">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-fg/60 hover:text-fg hover:bg-fg/5 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
