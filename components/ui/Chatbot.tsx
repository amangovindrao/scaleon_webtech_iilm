'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotQuestions, fallbackResponse, contactOptions } from '@/data/chatbotData';

type Message = {
  from: 'bot' | 'user';
  text: string;
  showContacts?: boolean;
};

const ContactIcon = ({ type }: { type: string }) => {
  if (type === 'whatsapp') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  );
  if (type === 'instagram') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  );
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputStr, setInputStr] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi 👋\nI\'m ScaleOn Assistant.\nAsk me anything about our services, pricing, or growth strategies.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isOpen]);

  const handleAsk = (q: string, a: string) => {
    setMessages(prev => [...prev, { from: 'user', text: q }]);
    setTimeout(() => { setMessages(prev => [...prev, { from: 'bot', text: a }]); }, 400);
  };

  const processUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStr.trim()) return;
    const userText = inputStr.trim();
    setInputStr('');
    setMessages(prev => [...prev, { from: 'user', text: userText }]);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let bestMatch = null;
      let highestScore = 0;
      for (const item of chatbotQuestions) {
        let score = 0;
        for (const kw of item.keywords) { if (lower.includes(kw)) score++; }
        if (score > highestScore) { highestScore = score; bestMatch = item; }
      }

      if (bestMatch && highestScore > 0) {
        setMessages(prev => [...prev, { from: 'bot', text: bestMatch!.answer }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: fallbackResponse, showContacts: true }]);
      }
    }, 500);
  };

  return (
    <>
      {/* Floating chat trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-fg text-bg shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl z-50"
        aria-label="Open chat assistant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] rounded-2xl border border-border bg-card overflow-hidden flex flex-col z-50 origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-card text-fg py-4 px-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base tracking-tight">ScaleOn Assistant</h3>
                <p className="text-[11px] font-semibold text-fg/40 mt-0.5 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Active Now
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-fg/30 hover:text-fg transition-colors p-1.5 rounded-lg hover:bg-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 p-5 h-[360px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex w-full ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${m.from === 'user' ? '' : ''}`}>
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed font-medium whitespace-pre-line ${m.from === 'user' ? 'bg-fg text-bg rounded-br-sm' : 'bg-muted/50 border border-border text-fg rounded-bl-sm'}`}>
                        {m.text}
                      </div>

                      {/* Contact buttons on fallback */}
                      {m.showContacts && (
                        <div className="mt-3 flex flex-col gap-2">
                          {contactOptions.map((opt, i) => (
                            <a
                              key={i}
                              href={opt.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${opt.color} text-white text-[13px] font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm`}
                            >
                              <ContactIcon type={opt.icon} />
                              {opt.label}
                            </a>
                          ))}
                          <p className="text-[11px] text-fg/30 font-medium mt-1 pl-1">We usually respond within a few hours.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions + Input */}
            <div className="border-t border-border flex flex-col">
              <div className="flex overflow-x-auto gap-2 p-3 border-b border-border whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {chatbotQuestions.slice(0, 5).map((item, idx) => (
                  <button key={idx} onClick={() => handleAsk(item.question, item.answer)} className="inline-block py-1.5 px-3 text-[11px] font-semibold border border-border rounded-full bg-card text-fg/70 hover:bg-fg hover:text-bg hover:border-fg transition-colors flex-shrink-0">
                    {item.question}
                  </button>
                ))}
              </div>
              <form onSubmit={processUserInput} className="flex p-3 gap-2">
                <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} placeholder="Type your message..." className="flex-1 rounded-xl border border-border bg-bg px-4 py-2.5 text-sm font-medium outline-none text-fg placeholder-fg/30 focus:border-fg/30 focus:ring-1 focus:ring-fg/10 transition-all" />
                <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-xl bg-fg text-bg transition-all hover:opacity-80 disabled:opacity-50 flex-shrink-0" disabled={!inputStr.trim()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
