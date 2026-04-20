import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';

export function Profile() {
  const { user, signOut } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || 'Autochat');
      setLastName(user.user_metadata?.last_name || 'User');
    }
  }, [user]);

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans pb-12">
      <header>
        <motion.h1 
          className="text-3xl font-bold tracking-tight mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Profile
        </motion.h1>
        <motion.p 
          className="text-white/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Manage your account settings and preferences.
        </motion.p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="overflow-hidden">
          {/* Header Profile Section */}
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gradient-to-br from-white/[0.03] to-transparent">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border border-white/10 shrink-0">
              <span className="text-3xl font-bold text-white">{getInitials()}</span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{firstName} {lastName}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-white/50 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                <Shield className="w-3.5 h-3.5" />
                Verified Account
              </span>
            </div>
            
            <button className="px-5 py-2 rounded-xl bg-white/5 text-white text-sm font-medium border border-white/10 hover:bg-white/10 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-6">
            <h3 className="text-lg font-semibold text-white/90">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/40 mb-2">First Name</label>
                <div className="h-12 px-4 rounded-xl bg-black/40 border border-white/5 flex items-center text-white/90">
                  {firstName}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/40 mb-2">Last Name</label>
                <div className="h-12 px-4 rounded-xl bg-black/40 border border-white/5 flex items-center text-white/90">
                  {lastName}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/40 mb-2">Email Address</label>
                <div className="h-12 px-4 rounded-xl bg-black/40 border border-white/5 flex items-center text-white/90">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-8 border-t border-white/5 bg-red-500/[0.02]">
             <button
                onClick={signOut}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
