import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';
import React from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'purple' | 'success' | 'none';
}

export function GlassCard({ children, className, glow = 'none', ...props }: GlassCardProps) {
  const glowStyles = {
    blue: 'dark:shadow-[0_0_40px_rgba(10,132,255,0.1)] border-blue-500/20',
    purple: 'dark:shadow-[0_0_40px_rgba(191,90,242,0.1)] border-purple-500/20',
    success: 'dark:shadow-[0_0_40px_rgba(48,209,88,0.1)] border- hijau-500/20',
    none: 'shadow-sm border-black/5 dark:border-white/5',
  };

  return (
    <motion.div
      className={cn(
        'relative bg-white dark:bg-[#1C1C1E] border rounded-[20px] overflow-hidden transition-colors',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
