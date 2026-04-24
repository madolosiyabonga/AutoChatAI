import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, FileText, Loader2 } from 'lucide-react';

export function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) {
        setNotes(data);
      }
      setLoading(false);
    };
    fetchNotes();
  }, [user]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Get Current User (AutoChat Standard)
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;
    
    // 2. Count User Notes & Enforce Free Plan Limit (Frontend Guard)
    const { count } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', currentUser.id);
      
    // 3. Prevent creation if limit reached
    if (count !== null && count >= 3) {
      alert('Free plan limit reached. Upgrade to Pro to create unlimited notes.');
      return;
    }

    setCreating(true);
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: currentUser.id,
          title: newTitle || 'Untitled Note',
          content: newContent
        })
        .select()
        .single();
        
      if (error) {
        if (error.message.includes('new row violates row-level security policy')) {
          alert('Free plan limit reached. Upgrade to Pro to create unlimited notes.');
        } else {
          console.error(error);
          alert('Error creating note.');
        }
      } else if (data) {
        setNotes([data, ...notes]);
        setNewTitle('');
        setNewContent('');
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6">
        <div>
          <motion.h1 
            className="text-[26px] font-bold tracking-tight mb-2 text-slate-900 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            AI Notes
          </motion.h1>
          <motion.p 
            className="text-slate-500 dark:text-white/50 text-[15px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Manage your AI-generated insights. Free users can create up to 3 notes.
          </motion.p>
        </div>
        
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors shadow-sm text-[14px]"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Note'}
        </motion.button>
      </header>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 shadow-sm">
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Note Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-100 dark:bg-black/40 border border-transparent dark:border-white/10 rounded-[12px] px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-colors text-[14px] shadow-sm inset-0"
                />
              </div>
              <div>
                <textarea
                  placeholder="Start typing your note here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-slate-100 dark:bg-black/40 border border-transparent dark:border-white/10 rounded-[12px] px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y focus:bg-white transition-colors text-[14px] leading-relaxed shadow-sm inset-0"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-[12px] font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm text-[14px]"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {creating ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 dark:text-white/30" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="w-16 h-16 rounded-[16px] bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10">
            <FileText className="w-8 h-8 text-slate-400 dark:text-white/30" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white tracking-tight">No Notes Yet</h3>
          <p className="text-slate-500 dark:text-white/50 mb-6 text-[15px]">Create your first AI note to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="h-full"
            >
              <GlassCard className="p-6 h-full flex flex-col group hover:border-slate-300 dark:hover:border-white/20 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-slate-400 dark:text-white/50">
                  <FileText className="w-4 h-4" />
                  <span className="text-[12px] font-medium">{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-[17px] font-semibold mb-3 text-slate-900 dark:text-white tracking-tight leading-snug">{note.title}</h3>
                <p className="text-slate-600 dark:text-white/60 text-[14px] flex-1 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
