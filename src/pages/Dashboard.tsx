import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { Play, TrendingUp, CheckCircle2, Clock, Activity, BarChart2, DollarSign, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  useEffect(() => {
    if (!user) return;

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

    const fetchTaskCount = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;
      
      const { count, error } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .eq('status', 'completed');
        
      if (!error && count !== null) {
        setCompletedTasksCount(count);
      }
    };
    
    fetchBalance();
    fetchTaskCount();

    const subscription = supabase
      .channel('public:user_tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_tasks', filter: `user_id=eq.${user.id}` },
        () => {
          fetchTaskCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Derived mock balances based on main balance to showcase multi-wallet interface
  const pendingBalance = balance > 0 ? (balance * 0.1).toFixed(2) : '0.00';
  const withdrawableBalance = balance > 0 ? (balance * 0.9).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 font-sans pb-12 transition-colors">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <motion.h1 
            className="text-[26px] font-bold tracking-tight mb-1 text-slate-900 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Overview
          </motion.h1>
          <motion.p 
            className="text-slate-500 dark:text-slate-400 text-[13px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Welcome back, {firstName}. Here is your performance summary.
          </motion.p>
        </div>
        
        {/* Timeframe Toggle */}
        <motion.div 
          className="flex bg-slate-200/50 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/5 self-start md:self-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {['daily', 'weekly', 'monthly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${timeframe === tf ? 'bg-white dark:bg-[#2C2C2E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {tf}
            </button>
          ))}
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Earnings Card (Main) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-8 flex flex-col"
        >
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-1 tracking-tight text-[13px]">Total Earnings</p>
                <div className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  ${balance.toFixed(2)} USD
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full font-medium ml-2">+12.5%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <BarChart2 className="text-blue-500 w-5 h-5" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Visualizer Mock */}
            <div className="flex-1 flex items-end gap-2 h-32 mt-4 opacity-80 pl-2">
               {[40, 60, 30, 80, 50, 90, 100].map((h, i) => (
                 <div key={i} className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative group transition-all duration-300 hover:bg-blue-200 dark:hover:bg-blue-800/50" style={{ height: `${h}%` }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                     ${(h * 0.4).toFixed(1)}
                   </div>
                 </div>
               ))}
            </div>

            <div className="flex items-center gap-3 mt-6 border-t border-black/5 dark:border-white/5 pt-6">
              <div className="flex-1">
                <p className="text-[12px] text-slate-500 dark:text-slate-400">Pending</p>
                <p className="font-semibold text-slate-900 dark:text-white text-[14px]">${pendingBalance}</p>
              </div>
              <div className="w-[1px] h-8 bg-black/5 dark:bg-white/5"></div>
              <div className="flex-1">
                <p className="text-[12px] text-slate-500 dark:text-slate-400">Withdrawable</p>
                <p className="font-semibold text-slate-900 dark:text-white text-[14px]">${withdrawableBalance}</p>
              </div>
              <Link to="/wallet" className="px-4 py-2 rounded-[10px] text-[13px] font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm ml-auto">
                Withdraw
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* Task Progress & AI Suggestion Block */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Daily Goal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white tracking-tight">Daily Goal</h3>
                <CheckCircle2 className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex justify-between text-[13px] font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Progress</span>
                  <span className="text-slate-900 dark:text-white">{completedTasksCount} / 10 Tasks</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (completedTasksCount / 10) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                  Complete {Math.max(0, 10 - completedTasksCount)} more tasks for bonus multiplier.
                </p>
                <Link to="/tasks" className="mt-2 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-[10px] text-[13px] font-medium transition-colors text-center border border-black/5 dark:border-white/5">
                  View Tasks
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Suggestion Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlassCard className="p-5 flex gap-4 items-center bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/10 dark:to-blue-900/10 border-indigo-100 dark:border-indigo-500/20">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-semibold text-slate-900 dark:text-white">AI Suggestion</h4>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Focus on transcription tasks today for a 20% boost.</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col"
        >
          <h2 className="text-[16px] font-semibold mb-4 text-slate-900 dark:text-white">Recent Activity</h2>
          <GlassCard className="flex-1 p-0 overflow-hidden">
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {[
                { id: 1, action: 'Completed Image Labeling', time: '10 mins ago', status: 'Approved', amount: '+$0.80' },
                { id: 2, action: 'Withdrawal Requested', time: '2 hrs ago', status: 'Pending', amount: '-$50.00' },
                { id: 3, action: 'Completed Audio Transcription', time: '5 hrs ago', status: 'Approved', amount: '+$2.50' },
                { id: 4, action: 'Daily Login Bonus', time: '8 hrs ago', status: 'Added', amount: '+$0.10' }
              ].map((activity) => (
                <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'Approved' || activity.status === 'Added' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <p className="text-[13px] font-medium text-slate-900 dark:text-white">{activity.action}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[13px] font-semibold ${activity.amount.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>{activity.amount}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{activity.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-black/5 dark:border-white/5 text-center">
              <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors">View All Activity</button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tutorial Locked Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col"
        >
          <h2 className="text-[16px] font-semibold mb-4 text-slate-900 dark:text-white">Premium Tasks</h2>
          <GlassCard className="flex-1 p-6 flex flex-col justify-center items-center text-center bg-slate-50/50 dark:bg-zinc-900/50 border-dashed border-2 border-slate-200 dark:border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center mb-4 relative z-10">
              <Lock className="w-6 h-6 text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-semibold mb-2 text-slate-900 dark:text-white relative z-10">Advanced Audio Analysis</h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-6 max-w-xs relative z-10">
              Complete the Tier 2 Tutorial to unlock these high-paying tasks. Earn up to $25/hr.
            </p>
            <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 rounded-[10px] text-[13px] font-semibold transition-colors flex items-center gap-2 relative z-10 shadow-sm">
              Start Tutorial <ArrowRight className="w-4 h-4" />
            </button>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  );
}