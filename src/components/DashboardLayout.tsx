import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'motion/react';

export function DashboardLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
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

  return (
    <div className="min-h-screen flex bg-[#050505] text-white selection:bg-blue-500/30 selection:text-white">
      <Sidebar />
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
        
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
