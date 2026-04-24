import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, Activity, Zap, Target, Lock, Brain, CornerDownRight, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { session, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // If user hits the landing page but is logged in, Auto-redirect them to the dashboard 
    // to match standard SaaS behavior requested by user.
    if (session && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, loading, navigate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white font-sans overflow-hidden transition-colors">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20" />
        <div className="absolute inset-0 bg-white/80 dark:bg-black/80" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-black/5 dark:border-white/[0.05] bg-white/50 dark:bg-black/50 backdrop-blur-2xl transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-blue-500 flex flex-col items-center justify-center shadow-sm">
              <span className="text-white font-bold tracking-tight leading-none">A</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">AutoChat AI</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-slate-300" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="text-[13px] font-semibold bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors shadow-sm">
              Start Earning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main 
        className="relative z-10 pt-40 pb-20 px-6 flex justify-center perspective-[2000px]"
        onMouseMove={handleMouseMove}
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] mb-8 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-widest">Platform v2.0 Live</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-center leading-[1.05]"
          >
            Train AI.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 dark:from-blue-400 dark:via-indigo-400 dark:to-white">
              Earn Capital.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-slate-600 dark:text-white/50 max-w-2xl text-center mb-10"
          >
            AutoChat AI is the premium data labeling infrastructure layer. Provide high-quality inputs 
            to next-generation models and get paid instantly for your precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Link to="/signup" className="group flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-all shadow-sm">
              Initialize Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Eye-catching Interactive Hero Image / Component */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="w-full max-w-5xl relative"
            style={{ 
              perspective: '1200px',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Ambient glow behind the interactive card */}
            <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

            {/* The tilting card */}
            <motion.div
              className="relative w-full rounded-[24px] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-2xl shadow-xl overflow-hidden aspect-[16/9] flex flex-col cursor-crosshair"
              animate={{
                rotateX: mousePosition.y * -15, // Tilt up/down
                rotateY: mousePosition.x * 15,  // Tilt left/right
              }}
              transition={{ type: "spring", stiffness: 75, damping: 20 }}
            >
              {/* Header bar */}
              <div className="h-12 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/20" />
                </div>
                <div className="mx-auto flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-white/40">
                  <Lock className="w-3 h-3" /> autochat-ai-session
                </div>
              </div>

              {/* Terminal / Task interface body */}
              <div className="flex-1 p-6 relative flex flex-col md:flex-row gap-6">
                
                {/* Left col - tasks */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="text-blue-500 w-5 h-5" />
                    <span className="font-mono text-sm tracking-wider uppercase text-slate-700 dark:text-white/80 font-medium">Incoming Task Stream</span>
                  </div>
                  
                  {[
                    { id: 'TSK-892', reward: '+$0.80', type: 'NLP Classification', active: true },
                    { id: 'TSK-893', reward: '+$1.50', type: 'Image Bounding Box', active: false },
                    { id: 'TSK-894', reward: '+$2.00', type: 'Logic Verification', active: false },
                  ].map((task, i) => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + (i * 0.2) }}
                      className={`p-4 rounded-xl border ${task.active ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5'} flex justify-between items-center`}
                    >
                      <div>
                        <div className="font-mono text-xs text-slate-500 dark:text-white/40 mb-1">{task.id}</div>
                        <div className={`font-semibold text-[14px] ${task.active ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-white/70'}`}>{task.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-green-600 dark:text-green-400 font-medium">{task.reward}</div>
                        {task.active && <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" /> IN PROGRESS</div>}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Right col - visualization */}
                <div className="hidden md:flex flex-1 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-black/40 p-4 flex-col relative overflow-hidden">
                  {/* Grid background inside */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                  
                  <div className="relative z-10 flex items-center gap-2 mb-4">
                     <Brain className="text-purple-500 w-5 h-5" />
                     <span className="font-mono text-sm tracking-wider uppercase text-slate-700 dark:text-white/80 font-medium">Model Inference</span>
                  </div>

                  {/* Floating particles inside the interface */}
                  <div className="flex-1 relative flex items-center justify-center">
                    <motion.div 
                      className="absolute w-32 h-32 border-2 border-indigo-400/50 dark:border-indigo-500/30 rounded-full"
                      animate={{ rotateX: [0, 180, 360], rotateY: [0, 360, 0] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      style={{ transformStyle: 'preserve-3d' }}
                    />
                    <motion.div 
                      className="absolute w-24 h-24 border-2 border-blue-400/60 dark:border-blue-500/50 rounded-full"
                      animate={{ rotateX: [360, 180, 0], rotateY: [0, 180, 360] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                      style={{ transformStyle: 'preserve-3d' }}
                    />
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Terminal className="text-slate-900 w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-3 rounded-lg font-mono text-xs text-slate-600 dark:text-white/60 shadow-sm">
                    <span className="text-blue-600 dark:text-blue-400">worker</span><span className="text-slate-400 dark:text-white/30">:~#</span> verifying parameter gradients... [OK]
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </main>

      {/* Feature Section */}
      <section className="relative z-10 py-32 px-6 border-t border-black/5 dark:border-white/[0.05] bg-slate-50 dark:bg-black transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Engineered for humans.</h2>
            <p className="text-slate-600 dark:text-white/50 text-lg max-w-xl">
              We abstracted away the complex tooling. Just log in, complete intelligent tasks, and 
              withdraw your capital instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Precision Matching", 
                desc: "Our neural router instantly matches you with tasks perfectly suited for your historical accuracy.", 
                icon: Target,
                color: "group-hover:text-pink-500 dark:group-hover:text-pink-400"
              },
              { 
                title: "Instant Liquidity", 
                desc: "No waiting periods. No bizarre points systems. Withdraw real dollars directly to your primary bank.", 
                icon: Zap,
                color: "group-hover:text-blue-500 dark:group-hover:text-blue-400"
              },
              { 
                title: "Dark Mode Native", 
                desc: "Hand-crafted typography and structural depth optimized to reduce eye strain during deep work.", 
                icon: CornerDownRight,
                color: "group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group p-8 rounded-[20px] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-default shadow-sm dark:shadow-none">
                  <div className="mb-6">
                    <Icon className={`w-8 h-8 text-slate-400 dark:text-white/30 transition-colors ${feature.color}`} />
                  </div>
                  <h3 className="text-[18px] font-semibold mb-3 text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-white/50 leading-relaxed text-[14px]">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  );
}