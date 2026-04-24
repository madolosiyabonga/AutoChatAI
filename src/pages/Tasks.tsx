import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { Clock, DollarSign, CheckCircle2, Zap, BrainCircuit, Type } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

// Fallback if DB is empty, but we fetch directly from Supabase 
const ICON_MAP: Record<string, React.ElementType> = {
  Type,
  Zap,
  BrainCircuit,
  Clock,
  DollarSign,
  CheckCircle2
};

export function Tasks() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState<string | null>(null);
  const [userTasks, setUserTasks] = useState<Record<string, string>>({});
  const [tasksList, setTasksList] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setTasksList(data);
      } else {
        // Fallback to demo data if the table is empty for previewing purposes
        setTasksList([
          { id: '1', title: 'Sentiment Analysis', description: 'Read short product reviews and classify them as positive, negative, or neutral.', reward: 0.50, duration: '2 mins', difficulty: 'Easy', icon: 'Type' },
          { id: '2', title: 'Image Bounding Boxes', description: 'Draw bounding boxes around vehicles in street scenes to train autonomous driving models.', reward: 1.20, duration: '5 mins', difficulty: 'Medium', icon: 'Zap' },
          { id: '3', title: 'Audio Transcription', description: 'Listen to short AI voice generations and correct the generated text transcripts.', reward: 2.50, duration: '10 mins', difficulty: 'Medium', icon: 'BrainCircuit' },
          { id: '4', title: 'Logic Verification', description: 'Review AI-generated code snippets and verify them for logical consistency and bugs.', reward: 5.00, duration: '15 mins', difficulty: 'Hard', icon: 'Zap' },
        ]);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUserTasks = async () => {
      const { data } = await supabase
        .from('user_tasks')
        .select('task_id, status')
        .eq('user_id', user.id);
      
      if (data) {
        const mapping = data.reduce((acc, curr) => ({ ...acc, [curr.task_id]: curr.status }), {});
        setUserTasks(mapping);
      }
    };
    fetchUserTasks();
  }, [user]);

  const handleTaskAction = async (task: any) => {
    if (!user) return;
    
    setLoading(task.id);
    const status = userTasks[task.id];
    
    try {
      if (!status) {
        // Start task
        await supabase.from('user_tasks').insert({
          user_id: user.id,
          task_id: task.id,
          status: 'active'
        });
        setUserTasks(prev => ({ ...prev, [task.id]: 'active' }));
      } else if (status === 'active') {
        // Complete Task
        await supabase
          .from('user_tasks')
          .update({ status: 'completed' })
          .eq('user_id', user.id)
          .eq('task_id', task.id);

        const { data: userData } = await supabase
          .from('users')
          .select('balance')
          .eq('id', user.id)
          .single();

        if (userData) {
          await supabase
            .from('users')
            .update({ balance: userData.balance + task.reward })
            .eq('id', user.id);
            
          // Record the transaction
          await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              title: task.title,
              amount: task.reward,
              type: 'earn'
            });
        }
        
        setUserTasks(prev => ({ ...prev, [task.id]: 'completed' }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const filteredTasks = tasksList.filter(t => filter === 'All' || t.difficulty === filter);

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            className="text-[26px] font-bold tracking-tight mb-2 text-slate-900 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Available Tasks
          </motion.h1>
          <motion.p 
            className="text-slate-500 dark:text-white/50 text-[15px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Complete tasks below to earn rewards instantly.
          </motion.p>
        </div>
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-1 sm:space-x-2 bg-slate-100 dark:bg-black/40 p-1.5 rounded-full border border-transparent dark:border-white/10 w-fit shadow-sm"
        >
          {['All', 'Easy', 'Medium', 'Hard'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, i) => {
          const Icon = ICON_MAP[task.icon as string] || CheckCircle2;
          const isCompleting = loading === task.id;
          const status = userTasks[task.id];
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="h-full"
            >
              <GlassCard className="p-6 h-full flex flex-col group hover:border-slate-300 dark:hover:border-white/20 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-[12px] bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-colors`}>
                    <Icon className="w-5 h-5 text-slate-700 dark:text-white/80" />
                  </div>
                  <div className="flex gap-2 text-[11px] font-bold tracking-wide uppercase">
                    <span className="flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-[8px] border border-green-200 dark:border-green-500/20">
                      <DollarSign className="w-3 h-3" /> {task.reward.toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 px-2.5 py-1 rounded-[8px] border border-slate-200 dark:border-white/10">
                      <Clock className="w-3 h-3" /> {task.duration}
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-[17px] font-semibold mb-2 text-slate-900 dark:text-white tracking-tight">{task.title}</h3>
                  <p className="text-slate-500 dark:text-white/50 text-[14px] leading-relaxed">{task.description}</p>
                </div>

                <button
                  onClick={() => handleTaskAction(task)}
                  disabled={isCompleting || status === 'completed'}
                  className={`w-full relative overflow-hidden group/btn border font-semibold py-3 rounded-[12px] transition-all disabled:opacity-50 text-[14px] ${
                    status === 'completed'
                      ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400'
                      : status === 'active'
                      ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                      : 'bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white shadow-sm dark:shadow-none'
                  }`}
                >
                  <span className={`flex items-center justify-center gap-2 ${isCompleting ? 'opacity-0' : 'opacity-100'}`}>
                    <CheckCircle2 className="w-4 h-4" /> 
                    {status === 'completed' ? 'Completed' : status === 'active' ? 'Complete Task' : 'Start Task'}
                  </span>
                  {isCompleting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-white/30 border-t-slate-700 dark:border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}