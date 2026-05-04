'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

import { Card } from '@/components/ui/GlassCard';
import { createContactSubmission } from '@/lib/firestore';
import { features, works, testimonials, members, faqs, marqueeLogos, aboutStats, aboutText } from '@/data/siteData';

/* ─── ICONS for features ─── */
const featureIcons = [
  <svg key="0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v4" /><path d="M12 18v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" /></svg>,
  <svg key="3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  <svg key="4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  <svg key="5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 17 22 12" /></svg>
];

/* ─── Animated counter hook ─── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
}

/* ─── Components ─── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full border border-fg/10 bg-fg/[0.03] px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-fg/60 uppercase mb-4">
    {children}
  </span>
);

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ─── PAGE ─── */
export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const words = ["Startup", "Brand", "Business", "Audience", "Website", "Content"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  /* Animated counters for social proof */
  const counter1 = useCounter(50);
  const counter2 = useCounter(228);
  const counter3 = useCounter(3);

  const submitContact = async (formData: FormData) => {
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      businessType: String(formData.get('businessType') || ''),
      budget: String(formData.get('budget') || ''),
      message: String(formData.get('message') || '')
    };
    setSending(true);
    try {
      await createContactSubmission(payload);
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setShowSuccess(true);
    } catch { alert('Unable to submit right now. Please try again.'); }
    finally { setSending(false); }
  };

  const onContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitContact(new FormData(e.currentTarget));
    e.currentTarget.reset();
  };

  return (
    <main className="relative z-0 min-h-[150vh] overflow-hidden pb-20">

      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="relative flex flex-col items-center justify-start px-5 text-center mt-0 pt-0 pb-12">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-[420px] md:max-w-[580px] flex justify-center -mb-6 md:-mb-10 -mt-2 sm:-mt-8"
          >
            {/* Pure white block to hide grid lines underneath the fade */}
            <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-bg via-bg to-transparent z-0"></div>

            {/* Soft Ambient Glow Behind Image */}
            <div className="absolute inset-x-0 inset-y-12 bg-white dark:bg-black blur-[40px] md:blur-[60px] rounded-[100%] z-0 opacity-100 pointer-events-none translate-y-6"></div>

            <img src="/4.png" alt="ScaleOn Team" className="h-[22rem] sm:h-[26rem] md:h-[30rem] w-auto object-contain object-bottom relative z-10" style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }} onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
          </motion.div>

          <h1 className="relative z-20 mt-0 text-[2.8rem] font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.05] text-fg mx-auto max-w-[900px] flex flex-col items-center gap-0 sm:gap-1">
            <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-4">
              <span>Scale your</span>
              <span className="text-[#171717] dark:text-gray-100">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="inline-block"
                  >
                    {words[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div>beyond limits.</div>
          </h1>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center relative z-20">
            <a href="#features" className="px-8 py-3.5 rounded-full bg-fg text-bg font-semibold text-base transition-all hover:opacity-80 hover:-translate-y-0.5 shadow-sm">Let&apos;s Explore</a>
            <a href="#contact" className="px-8 py-3.5 rounded-full border border-fg/20 bg-transparent text-fg font-semibold text-base hover:bg-fg/5 transition-all hover:-translate-y-0.5">Contact Us</a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-center mt-6 flex justify-center items-center gap-2">
            <div className="flex -space-x-3">
              <img className="w-8 h-8 rounded-full border-2 border-bg bg-card/50" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64" alt="user" />
              <img className="w-8 h-8 rounded-full border-2 border-bg bg-card/50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="user" />
              <img className="w-8 h-8 rounded-full border-2 border-bg bg-card/50" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64" alt="user" />
            </div>
            <span className="text-sm font-semibold text-fg/60">Trusted by <span className="text-blue-600 dark:text-blue-500 font-bold">1.3L+</span> Audience</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ 2. LOGO MARQUEE (TRUSTED BY) ═══════════ */}
      <section className="w-full overflow-hidden py-16 opacity-70">

        <div className="relative flex w-full flex-row overflow-hidden pb-4">
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
            @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
            .animate-marquee { display: flex; width: max-content; animation: marquee 35s linear infinite; }
            .animate-marquee-reverse { display: flex; width: max-content; animation: marquee-reverse 35s linear infinite; }
          `}} />
          <div className="animate-marquee whitespace-nowrap flex items-center pr-12">
            {/* Render list twice for infinite loop */}
            {[...marqueeLogos, ...marqueeLogos].map((logo, i) => (
              <span key={i} className="mx-8 text-2xl md:text-3xl font-extrabold text-fg/20 tracking-tighter uppercase whitespace-nowrap">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 2.5 ABOUT US ═══════════ */}
      <section id="about" className="mx-auto max-w-[1200px] px-5 py-24 bg-fg/[0.02]">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 xl:gap-24 items-center pt-4 sm:pt-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-7 sticky top-32">
            <SectionLabel>About Us</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              We don’t just grow brands&#8209;We drive <span className="text-[1.12em] text-fg">real results.</span>
            </h2>
            <div className="space-y-4 text-lg text-fg/60 leading-relaxed font-medium">
              <p>
                ScaleOn began in 2024 with one goal in mind: to help brands and creators succeed online with results that you can actually measure. Since 2018, we've tested and learned exactly how sustainable growth happens across platforms. Today, we focus purely on performance marketing and media growth systems that <span className="text-fg font-semibold cursor-default">actually work</span> - not just look good.
              </p>
              <p>
                We help small businesses and growing brands build an online presence, drive massive engagement, and generate real revenue. Our approach combines strategy, creativity, and consistency, because true growth isn't about posting randomly - it's about having a system.
              </p>
              <p className="border-l-2 border-fg/20 pl-4 my-6 text-fg/70 italic">
                "And if we don’t deliver the promised results within the agreed timeline, we return <span className="text-fg font-bold">70% of your investment</span>  -  because we believe in performance, not excuses."
              </p>
              <div className="mt-8">
                <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-xl hover:scale-[1.02] hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all duration-300 transform-gpu cursor-default">
                  ScaleOn - Scale Beyond Limits.
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-5 grid sm:grid-cols-2 gap-6 relative">
            {aboutStats.map((stat, idx) => (
              <motion.div key={idx} variants={scaleIn} transition={{ duration: 0.4 }} className={idx % 2 !== 0 ? "sm:mt-16" : ""}>
                <Card className="group h-full flex flex-col justify-center items-center text-center !p-10 hover:border-[#171717]/30 hover:shadow-xl transition-all duration-300">
                  <p className="text-4xl md:text-5xl font-extrabold text-fg mb-4 group-hover:scale-[1.05] transition-transform duration-300">{stat.value}</p>
                  <p className="text-sm font-bold text-fg/50 uppercase tracking-widest leading-relaxed">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 3. FEATURES ═══════════ */}
      <section id="features" className="mx-auto max-w-[1200px] px-5 py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <SectionLabel>Our Expertise</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">What We Do to Grow You.</h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div key={feature.title} variants={fadeUp} transition={{ duration: 0.4 }}>
              <Card className="group h-full hover:border-[#171717]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg !p-8">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-fg/5 text-fg/70 group-hover:bg-[#171717] group-hover:text-white transition-colors duration-300">
                  {featureIcons[idx]}
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-fg/50 leading-relaxed text-[15px]">{feature.text}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-20 text-center">
          <p className="inline-block text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-[1.02] transition-transform cursor-default">
            We don’t just provide services — we build systems that grow your brand.
          </p>
        </motion.div>
      </section>

      {/* ═══════════ 4. RESULTS WE'VE DELIVERED ═══════════ */}
      <section id="works" className="mx-auto max-w-[1200px] px-5 py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <SectionLabel>Results</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Results We&apos;ve Delivered.</h2>
          <p className="mt-4 text-lg text-fg/45 max-w-xl mx-auto">Worked with multiple creators and brands across different niches. Focused on real growth.</p>
        </motion.div>

        {/* Case study cards */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-6 md:grid-cols-3">
          {works.map((item) => (
            <motion.div key={item.name} variants={fadeUp} transition={{ duration: 0.4 }}>
              <Card className="group h-full hover:border-[#171717]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] flex flex-col justify-between min-h-[280px] !p-8 relative overflow-hidden">
                {/* Subtle gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10">
                  {/* Platform tag */}
                  <span className="inline-block px-3 py-1 rounded-full bg-fg/[0.06] text-[10px] font-bold uppercase tracking-widest text-fg/50 mb-4 border border-fg/[0.06]">
                    {item.platform}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                </div>

                <div className="relative z-10">
                  <div className="h-px w-10 bg-fg/10 mb-4 transition-all duration-300 group-hover:w-16 group-hover:bg-gradient-to-r group-hover:from-blue-500/60 group-hover:to-purple-500/60"></div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-4xl font-extrabold text-fg">{item.result}</p>
                    <p className="text-base font-semibold text-fg/50">{item.resultSuffix}</p>
                  </div>
                  {item.timeframe && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-1">{item.timeframe}</p>
                  )}
                  <p className="text-[15px] text-fg/40 mt-3 font-medium leading-relaxed">{item.detail}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>



        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10 text-center flex flex-col items-center gap-4">
          <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Want results like this? Let&apos;s grow your brand.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-fg text-bg font-semibold text-base transition-all hover:opacity-80 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
          >
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </motion.div>
      </section>

      {/* ═══════════ 5. TESTIMONIALS ═══════════ */}
      <section className="mx-auto max-w-[1200px] px-5 py-24 bg-fg/[0.02]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <SectionLabel>Client Feedback</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">What Our Clients Say.</h2>

        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} variants={fadeUp} transition={{ duration: 0.4 }}>
              <Card className="group h-full flex flex-col justify-between hover:border-[#171717]/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] !p-8 relative overflow-hidden">
                {/* Subtle hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10">
                  {/* Stars — smaller & subtle */}
                  <div className="mb-5 flex gap-0.5 text-amber-400/70">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[15px] font-medium leading-[1.8] flex-grow text-fg/60 mb-8">&quot;{t.quote}&quot;</p>
                </div>

                {/* Author */}
                <div className="relative z-10 mt-auto flex items-center gap-4 pt-6 border-t border-fg/[0.06]">
                  <div className="relative">
                    <div className="h-11 w-11 bg-gradient-to-br from-fg/10 to-fg/[0.06] rounded-full flex items-center justify-center font-bold text-fg/70 text-sm tracking-tight">
                      {t.author.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] text-fg leading-tight">{t.author}</p>
                    <p className="text-[11px] font-semibold text-fg/40 uppercase tracking-wider mt-0.5">{t.role}</p>
                  </div>
                  {/* Platform tag */}
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-fg/[0.04] text-[9px] font-bold uppercase tracking-widest text-fg/35 border border-fg/[0.05]">
                    {t.platform}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust line */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-14 text-center">
          <p className="text-fg/40 text-base font-medium max-w-2xl mx-auto leading-relaxed">
            We focus on <span className="text-fg/70 font-semibold">real growth</span> and long-term results — not fake numbers.
          </p>
        </motion.div>
      </section>

      {/* ═══════════ 6. OUR TEAM ═══════════ */}
      <section className="mx-auto max-w-[1200px] px-5 py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <SectionLabel>Our Team</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">The Team Behind ScaleOn.</h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[960px] mx-auto">
          {members.map((m, idx) => (
            <motion.div key={idx} variants={scaleIn} transition={{ duration: 0.5 }}>
              <Card className="group h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] hover:border-[#171717]/20 !p-7 relative overflow-hidden">
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.05))' }}></div>

                {/* Circular image */}
                <div className="relative z-10 mb-5">
                  <div className="w-[140px] h-[140px] rounded-full overflow-hidden bg-fg/[0.04] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.1)] group-hover:shadow-[0_12px_40px_-6px_rgba(99,102,241,0.2)] transition-shadow duration-500 border-2 border-white dark:border-card">
                    <img
                      src={m.img}
                      alt={m.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 items-center justify-center bg-gradient-to-br from-fg/10 to-fg/[0.04] text-fg/30 text-5xl font-bold rounded-full" style={{ display: 'none' }}>
                      {m.name.charAt(0)}
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold tracking-tight text-fg">{m.name}</h3>
                  <p className="text-[11px] font-semibold text-fg/40 uppercase tracking-[0.15em] mt-1">{m.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ 7. FAQs ═══════════ */}
      <section className="w-full bg-[#f8f9fa] dark:bg-[#0a0a0a] py-32 border-t border-b border-border/40">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* FAQ Left Column: Title */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-5 pt-4 sticky top-32">
              <SectionLabel>FAQs</SectionLabel>
              <h2 className="text-4xl lg:text-[3.5rem] leading-[1.1] font-bold tracking-tight text-fg">
                Got Questions?<br />We&apos;ve Got Answers.
              </h2>
              <p className="mt-5 text-fg/40 text-base font-medium leading-relaxed max-w-sm">
                Everything you need to know before working with us — straight and simple.
              </p>
            </motion.div>

            {/* FAQ Right Column: Accordions */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-7 flex flex-col gap-3">
              {faqs.map((faq, idx) => (
                <motion.div key={idx} variants={fadeUp} transition={{ duration: 0.3 }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className={`w-full text-left rounded-xl bg-white dark:bg-card border transition-all duration-300 group ${openFaq === idx ? 'border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)]' : 'border-border/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-black/10'}`}
                  >
                    <div className="flex items-center gap-4 p-5 sm:p-6">
                      <div className={`h-4 w-1 rounded-full flex-shrink-0 transition-colors duration-300 ${openFaq === idx ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-black'}`}></div>
                      <span className="text-[15px] font-bold flex-1 text-fg">{faq.q}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-fg/40 transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-black' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${openFaq === idx ? 'max-h-64 opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'}`}>
                      <div className={`text-fg/60 text-[14px] leading-[1.8] font-medium pt-4 ${openFaq === idx ? 'border-t border-border/60' : 'border-t-0 border-transparent'}`}>{faq.a}</div>
                    </div>
                  </button>
                </motion.div>
              ))}

              {/* CTA below FAQs */}
              <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="mt-8 text-center lg:text-left">
                <p className="text-fg/40 text-[15px] font-medium mb-4">
                  Still have questions? Ask our assistant — we&apos;ll help you instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-fg text-bg font-semibold text-sm transition-all hover:opacity-80 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
                  >
                    Get in Touch
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ 8. CONTACT ═══════════ */}
      <section id="contact" className="mx-auto max-w-[860px] px-5 py-24 pb-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Let&apos;s Grow Your Brand.</h2>
          <p className="mt-4 text-lg text-fg/45 font-medium max-w-xl mx-auto">Fill this form and we&apos;ll create a custom strategy for your brand. We usually respond within a few hours.</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Card className="!rounded-[2rem] border-border/50 shadow-glass-large !p-8 md:!p-12">
            <form onSubmit={onContactSubmit} className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-fg/40 pl-1">Your Name</label>
                <input name="name" required placeholder="e.g. Rahul Sharma" className="w-full h-12 rounded-xl border border-border bg-bg/50 px-4 font-medium text-sm text-fg placeholder-fg/25 transition-all outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/20" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-fg/40 pl-1">Email Address</label>
                <input name="email" type="email" required placeholder="you@example.com" className="w-full h-12 rounded-xl border border-border bg-bg/50 px-4 font-medium text-sm text-fg placeholder-fg/25 transition-all outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/20" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-fg/40 pl-1">WhatsApp Number</label>
                <input name="phone" required placeholder="+91 98765 43210" className="w-full h-12 rounded-xl border border-border bg-bg/50 px-4 font-medium text-sm text-fg placeholder-fg/25 transition-all outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/20" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-fg/40 pl-1">What do you do?</label>
                <input name="businessType" required placeholder="Creator, Brand, Agency, etc." className="w-full h-12 rounded-xl border border-border bg-bg/50 px-4 font-medium text-sm text-fg placeholder-fg/25 transition-all outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/20" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-fg/40 pl-1">Monthly Budget <span className="normal-case tracking-normal text-fg/25">(Optional)</span></label>
                <input name="budget" placeholder="₹10K – ₹50K, ₹50K+, etc." className="w-full h-12 rounded-xl border border-border bg-bg/50 px-4 font-medium text-sm text-fg placeholder-fg/25 transition-all outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/20" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-widest text-fg/40 pl-1">What do you want to achieve?</label>
                <input name="message" required placeholder="More followers, leads, brand growth…" className="w-full h-12 rounded-xl border border-border bg-bg/50 px-4 font-medium text-sm text-fg placeholder-fg/25 transition-all outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/20" />
              </div>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={sending} className="mt-2 h-14 w-full rounded-xl bg-fg font-bold tracking-wide text-bg transition-all hover:opacity-90 disabled:opacity-70 md:col-span-2 flex justify-center items-center gap-2 text-base">
                {sending ? (<><span className="h-5 w-5 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>Submitting...</>) : 'Get My Growth Plan →'}
              </motion.button>
            </form>

            {/* Trust lines */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-[12px] text-fg/35 font-medium">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500/70"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                No spam. Your data is 100% secure.
              </span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500/70"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                We respond within 24 hours.
              </span>
            </div>
          </Card>

          {/* Guarantee line */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8 text-center">
            <p className="text-fg/35 text-sm font-medium inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500/70"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              If we don&apos;t deliver promised results, we offer a <span className="text-fg/60 font-semibold">70% refund</span>.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ SUCCESS MODAL ═══════════ */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
            onClick={() => setShowSuccess(false)}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[440px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="!rounded-[2rem] !p-10 text-center shadow-[0_32px_80px_-16px_rgba(0,0,0,0.25)] border-border/40">
                <div className="text-5xl mb-5">🎉</div>
                <h3 className="text-2xl font-bold tracking-tight text-fg mb-3">Thank you for reaching out!</h3>
                <p className="text-fg/50 text-[15px] leading-relaxed font-medium mb-2">
                  Your request has been successfully submitted.
                </p>
                <p className="text-fg/50 text-[15px] leading-relaxed font-medium mb-6">
                  Our team will contact you shortly with your custom growth plan.
                </p>

                <div className="bg-fg/[0.03] border border-fg/[0.06] rounded-xl p-5 mb-6">
                  <p className="text-fg/60 text-sm font-semibold mb-3">⚡ Want a faster response?</p>
                  <p className="text-fg/40 text-[13px] font-medium mb-4">Chat with us directly on WhatsApp.</p>
                  <a
                    href="https://wa.me/919026240970?text=Hi%20ScaleOn,%20I%20just%20submitted%20a%20form%20on%20your%20website."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Chat on WhatsApp
                  </a>
                </div>

                <p className="text-fg/30 text-[12px] font-medium">We usually respond within a few hours.</p>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-6 text-fg/40 text-sm font-semibold hover:text-fg/60 transition-colors"
                >
                  Close
                </button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
