import { KeySquare } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function SetupRequired() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
      <GlassCard glow="blue" className="max-w-md w-full p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
          <KeySquare className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Supabase Configuration Required</h2>
          <p className="text-white/60 text-sm">
            AutoChat requires a real Supabase backend to function. Please set up your configuration.
          </p>
        </div>
        
        <div className="bg-black/50 rounded-xl p-4 text-left border border-white/5 space-y-3">
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">1. Create variables in Settings</p>
          <code className="block text-xs font-mono text-blue-300 break-all">
            VITE_SUPABASE_URL
          </code>
          <code className="block text-xs font-mono text-blue-300 break-all">
            VITE_SUPABASE_ANON_KEY
          </code>
        </div>
        
        <p className="text-xs text-white/40">
          Once added, the app will automatically restart and connect to your database.
        </p>
      </GlassCard>
    </div>
  );
}
