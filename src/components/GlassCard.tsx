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
    blue: 'shadow-[0_0_40px_rgba(59,130,246,0.15)] border-blue-500/20',
    purple: 'shadow-[0_0_40px_rgba(168,85,247,0.15)] border-purple-500/20',
    success: 'shadow-[0_0_40px_rgba(34,197,94,0.15)] border-green-500/20',
    none: 'shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-white/10',
  };

  return (
    <motion.div
      className={cn(
        'relative bg-white/5 backdrop-blur-2xl border rounded-2xl overflow-hidden',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
