import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <span className="text-white font-bold tracking-tight">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">AutoChat</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative pt-32 pb-20 px-6">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">The Future of AI Task Earning</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            Earn Money Completing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Simple AI Tasks
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10"
          >
            Turn your free time into revenue. Help train the next generation of AI models by completing micro-tasks directly from your dashboard.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white/90 hover:scale-105 transition-all w-full sm:w-auto justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Start Earning Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-32 grid md:grid-cols-3 gap-6 relative z-10">
          {[
            { title: "Instant Payouts", desc: "Withdraw earnings instantly to your wallet. No minimum thresholds.", icon: Zap, glow: "blue" },
            { title: "Simple Tasks", desc: "Data labeling, text categorization, and short surveys.", icon: CheckCircle2, glow: "purple" },
            { title: "AI Powered", desc: "Our platform matches you with the highest paying tasks suited for you.", icon: Sparkles, glow: "success" }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
              >
                <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform" glow={feature.glow as 'blue'|'purple'|'success'}>
                  <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  );
}
