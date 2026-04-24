import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { Clock, DollarSign, CheckCircle2, Zap, BrainCircuit, Type } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

// Standard tasks for demo purposes if DB is empty
const DEMO_TASKS = [
  { id: '1', title: 'Sentiment Analysis', description: 'Read short product reviews and classify them as positive, negative, or neutral.', reward: 0.50, duration: '2 mins', difficulty: 'Easy', icon: Type },
  { id: '2', title: 'Image Bounding Boxes', description: 'Draw bounding boxes around vehicles in street scenes to train autonomous driving models.', reward: 1.20, duration: '5 mins', difficulty: 'Medium', icon: Zap },
  { id: '3', title: 'Audio Transcription', description: 'Listen to short AI voice generations and correct the generated text transcripts.', reward: 2.50, duration: '10 mins', difficulty: 'Medium', icon: BrainCircuit },
  { id: '4', title: 'Logic Verification', description: 'Review AI-generated code snippets and verify them for logical consistency and bugs.', reward: 5.00, duration: '15 mins', difficulty: 'Hard', icon: Zap },
];

export function Tasks() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState<string | null>(null);

  const handleCompleteTask = async (task: any) => {
    if (!user) return;
    
    setLoading(task.id);
    
    try {
      // 1. Record completed task
      await supabase.from('user_tasks').insert({
        user_id: user.id,
        task_id: task.id,
        status: 'completed'
      });

      // 2. Fetch current balance
      const { data: userData } = await supabase
        .from('users')
        .select('balance')
        .eq('id', user.id)
        .single();

      // 3. Update balance
      if (userData) {
        await supabase
          .from('users')
          .update({ balance: userData.balance + task.reward })
          .eq('id', user.id);
      }
      
      // Simulate network delay for UX
      await new Promise(r => setTimeout(r, 800));
      
      // In a real app we'd remove it from the list or show completed state
      alert(`Successfully earned $${task.reward.toFixed(2)}!`);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const filteredTasks = DEMO_TASKS.filter(t => filter === 'All' || t.difficulty === filter);

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-bold tracking-tight mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Available Tasks
          </motion.h1>
          <motion.p 
            className="text-white/50"
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
          className="flex space-x-2 bg-black/40 p-1 rounded-full border border-white/10 w-fit"
        >
          {['All', 'Easy', 'Medium', 'Hard'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, i) => {
          const Icon = task.icon;
          const isCompleting = loading === task.id;
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
            >
              <GlassCard className="p-6 h-full flex flex-col group hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors`}>
                    <Icon className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full border border-green-500/20">
                      <DollarSign className="w-3 h-3" /> {task.reward.toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 text-white/70 px-2.5 py-1 rounded-full border border-white/10">
                      <Clock className="w-3 h-3" /> {task.duration}
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{task.description}</p>
                </div>

                <button
                  onClick={() => handleCompleteTask(task)}
                  disabled={isCompleting}
                  className="w-full relative overflow-hidden group/btn bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  <span className={`flex items-center justify-center gap-2 ${isCompleting ? 'opacity-0' : 'opacity-100'}`}>
                    <CheckCircle2 className="w-4 h-4" /> Start Task
                  </span>
                  {isCompleting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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