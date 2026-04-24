import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { Play, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [firstName, setFirstName] = useState('');
  
  useEffect(() => {
    if (user) {
      // In a real app we'd fetch from users table, here we use user.user_metadata if available
      setFirstName(user.user_metadata?.first_name || user.email?.split('@')[0] || 'User');
      
      const fetchBalance = async () => {
        const { data } = await supabase
          .from('users')
          .select('balance, first_name')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setBalance(data.balance || 0);
          if (data.first_name) {
            setFirstName(data.first_name);
          }
        }
      };
      fetchBalance();
    }
  }, [user]);

  return (
    <div className="space-y-8 font-sans pb-12">
      <header>
        <motion.h1 
          className="text-3xl font-bold tracking-tight mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Welcome back, {firstName}
        </motion.h1>
        <motion.p 
          className="text-white/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Here's what's happening with your account today.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <GlassCard glow="blue" className="p-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-white/60 font-medium mb-1 uppercase tracking-wider text-xs">Total Earnings</p>
                <div className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  ${balance.toFixed(2)}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <TrendingUp className="text-blue-400 w-6 h-6" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/tasks" className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Start Earning
              </Link>
              <Link to="/wallet" className="px-6 py-3 rounded-full font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                Withdraw
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* Daily Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-8 h-full flex flex-col">
            <h3 className="font-semibold text-lg mb-6">Daily Goal</h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/60">Progress</span>
                <span className="text-white">3 / 10 Tasks</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '30%' }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
              
              <p className="text-xs text-white/40 mt-2">Complete 7 more tasks to unlock today's bonus multiplier.</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recommended Features */}
      <h2 className="text-xl font-semibold mt-10 mb-6">Recommended for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI Interview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard glow="purple" className="p-6 relative group overflow-hidden">
            <div className="absolute right-[-40px] top-[-40px] w-32 h-32 bg-purple-500/20 blur-3xl group-hover:bg-purple-500/40 transition-colors" />
            <div className="flex items-start justify-between relative z-10 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Play className="text-purple-400 w-6 h-6 ml-1" />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                HIGH PAYING
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Interview</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Participate in specialized AI voice conversations to help train next-gen conversational models.
            </p>
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Reward</p>
                <p className="font-bold text-lg text-purple-400">$15.00 <span className="text-sm font-normal text-white/40">/ hr</span></p>
              </div>
              <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-purple-500/30">
                Join Waitlist
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Task */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <CheckCircle2 className="text-blue-400 w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs font-semibold border border-white/10">
                <Clock className="w-3 h-3" /> 2 mins
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">Image Classification</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Help categorize images to improve vision models. Fast and simple tasks to complete in your downtime.
            </p>
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Reward</p>
                <p className="font-bold text-lg text-blue-400">$0.80 <span className="text-sm font-normal text-white/40">/ task</span></p>
              </div>
              <Link to="/tasks" className="bg-white text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                Start Now
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}