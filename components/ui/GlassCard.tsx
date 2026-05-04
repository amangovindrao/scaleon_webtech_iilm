'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-2xl ${className}`}>
      {children}
    </div>
  );
};

// Keep backward compat
export const GlassCard = Card;
