import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CheckSquare, Wallet, LogOut, FileText, Search, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Notes', path: '/notes', icon: FileText },
  { name: 'Wallet', path: '/wallet', icon: Wallet },
];

export function Sidebar() {
  const { signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <aside className="w-[240px] border-r border-black/5 dark:border-white/5 bg-slate-50/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl h-screen flex flex-col fixed left-0 top-0 z-40 hidden md:flex transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-[10px] bg-blue-500 flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg leading-none">A</span>
            </div>
            <span className="text-slate-900 dark:text-white font-semibold text-xl tracking-tight">AutoChat AI</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-200/50 dark:bg-black/40 text-slate-900 dark:text-white border border-transparent dark:border-white/5 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 group relative text-sm font-medium",
                  isActive ? "text-slate-900 dark:text-white bg-slate-200/70 dark:bg-white/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-white/5"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="active-navIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                    <span className="relative z-10 tracking-tight">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        
        {/* Upgrade Box */}
        <div className="px-4 py-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-500/20 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-12 h-12 text-blue-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 relative z-10">Pro Automation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 relative z-10 mt-1">Unlock high paying tasks and AI packs.</p>
            <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-[10px] text-xs font-semibold transition-colors relative z-10 shadow-sm">
              Upgrade Now
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-200/40 dark:hover:bg-red-500/10 rounded-[10px] transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span className="tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 z-40 px-6 py-3 flex justify-between items-center pb-safe">
        {navItems.map((item) => {
           const Icon = item.icon;
           return (
             <NavLink
               key={item.path}
               to={item.path}
               className={({ isActive }) => cn(
                 "flex flex-col items-center gap-1 transition-colors",
                 isActive ? "text-blue-500" : "text-slate-500 dark:text-slate-400"
               )}
             >
               <Icon className="w-6 h-6" strokeWidth={1.5} />
               <span className="text-[10px] font-medium">{item.name}</span>
             </NavLink>
           );
        })}
      </nav>
    </>
  );
}
