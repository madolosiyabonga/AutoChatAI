import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'motion/react';
import { Bell, MessageCircle, HelpCircle, Share, Sun, Moon } from 'lucide-react';

export function DashboardLayout() {
  const { user, session, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const avatarPath = user?.user_metadata?.avatar_url;
    if (avatarPath) {
      const getSignedUrl = async () => {
        const { data } = await supabase.storage
          .from('app-files')
          .createSignedUrl(avatarPath, 3600);
        if (data) {
          setAvatarSignedUrl(data.signedUrl);
        }
      };
      getSignedUrl();
    } else {
      setAvatarSignedUrl(null);
    }
  }, [user?.user_metadata?.avatar_url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 relative">
          <motion.div
            className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const initial = (user?.user_metadata?.first_name?.[0] || 'A').toUpperCase();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-black text-slate-900 dark:text-white selection:bg-blue-500/30">
      <Sidebar />
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen relative overflow-hidden transition-colors">
        {/* Apple-inspired Top Bar */}
        <header className="h-16 flex items-center justify-end px-6 sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-black/5 dark:border-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-slate-300" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <MessageCircle className="w-5 h-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <Share className="w-5 h-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-black"></span>
            </button>

            {/* Profile Avatar */}
            <Link to="/profile" className="ml-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-black/10 dark:border-white/10 shrink-0 hover:ring-2 hover:ring-blue-500 transition-all">
                {avatarSignedUrl ? (
                  <img src={avatarSignedUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-700 dark:text-white font-medium text-sm leading-none">{initial}</span>
                )}
              </div>
            </Link>
          </div>
        </header>
        
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}