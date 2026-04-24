import { KeySquare } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function SetupRequired() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center p-6 text-slate-900 dark:text-white font-sans transition-colors">
      <GlassCard className="max-w-md w-full p-8 text-center space-y-6 shadow-sm">
        <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-500/20 rounded-[16px] flex items-center justify-center border border-blue-100 dark:border-blue-500/30">
          <KeySquare className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Supabase Configuration Required</h2>
          <p className="text-slate-500 dark:text-white/60 text-[15px]">
            AutoChat AI requires a real Supabase backend to function. Please set up your configuration.
          </p>
        </div>
        
        <div className="bg-slate-100 dark:bg-black/50 rounded-[12px] p-4 text-left border border-slate-200 dark:border-white/5 space-y-3">
          <p className="text-[11px] text-slate-500 dark:text-white/50 uppercase tracking-widest font-semibold">1. Create variables in Settings</p>
          <code className="block text-[13px] font-mono text-blue-600 dark:text-blue-300 break-all font-medium">
            VITE_SUPABASE_URL
          </code>
          <code className="block text-[13px] font-mono text-blue-600 dark:text-blue-300 break-all font-medium">
            VITE_SUPABASE_ANON_KEY
          </code>
        </div>
        
        <p className="text-[13px] text-slate-500 dark:text-white/40">
          Once added, the app will automatically restart and connect to your database.
        </p>
      </GlassCard>
    </div>
  );
}
