import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { ArrowUpRight, DollarSign, Wallet as WalletIcon, History, CreditCard } from 'lucide-react';

export function Wallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchWalletData = async () => {
        // Fetch balance
        const { data: userData } = await supabase
          .from('users')
          .select('balance')
          .eq('id', user.id)
          .single();
          
        if (userData) {
          setBalance(userData.balance);
        }

        // Fetch history from real transactions table
        const { data: historyData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (historyData) {
          // Format date for UI
          const formattedHistory = historyData.map(item => ({
            ...item,
            date: new Date(item.created_at).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })
          }));
          setHistory(formattedHistory);
        }
      };
      
      fetchWalletData();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      <header>
        <motion.h1 
          className="text-3xl font-bold tracking-tight mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Wallet
        </motion.h1>
        <motion.p 
          className="text-white/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Manage your earnings and withdrawals.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <GlassCard glow="blue" className="p-8 h-full relative overflow-hidden flex flex-col justify-center">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <WalletIcon className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <p className="text-white/60 font-medium mb-2 uppercase tracking-wider text-xs">Available Balance</p>
              <h2 className="text-6xl font-bold tracking-tight text-white mb-8">
                ${balance.toFixed(2)}
              </h2>
              
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
                  <ArrowUpRight className="w-5 h-5" /> Withdraw Funds
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          <GlassCard className="p-6 flex-1 flex flex-col justify-center">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-white/50 text-sm mb-1">Earned this week</p>
            <p className="text-2xl font-bold">${(balance * 0.8).toFixed(2)}</p>
          </GlassCard>
          
          <GlassCard className="p-6 flex-1 flex flex-col justify-center">
             <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-4">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-white/50 text-sm mb-1">Linked Account</p>
            <p className="text-lg font-bold">Chase **4922</p>
          </GlassCard>
        </motion.div>
      </div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mt-10 mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-white/50" /> Recent Activity
        </h3>
        <GlassCard className="overflow-hidden">
          <div className="divide-y divide-white/5">
            {history.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    item.type === 'earn' 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}>
                    {item.type === 'earn' ? <DollarSign className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-white/40">{item.date}</p>
                  </div>
                </div>
                <div className={`font-bold font-mono ${item.type === 'earn' ? 'text-green-400' : 'text-white'}`}>
                  {item.type === 'earn' ? '+' : ''}{item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}