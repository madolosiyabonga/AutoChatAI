import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CheckSquare, Wallet, User as UserIcon, LogOut, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Notes', path: '/notes', icon: FileText },
  { name: 'Wallet', path: '/wallet', icon: Wallet },
  { name: 'Profile', path: '/profile', icon: UserIcon },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);
  
  const firstName = user?.user_metadata?.first_name || 'Auto';
  const initial = firstName.charAt(0).toUpperCase();

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

  return (
    <aside className="w-64 border-r border-white/5 bg-[#050505]/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-40 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center overflow-hidden border border-white/10 shrink-0">
            {avatarSignedUrl ? (
              <img src={avatarSignedUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-lg leading-none">{initial}</span>
            )}
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">AutoChat</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-navIndicator"
                      className="absolute inset-0 border border-white/10 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
