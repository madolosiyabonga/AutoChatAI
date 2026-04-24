import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Shield, LogOut, Loader2, Camera, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export function Profile() {
  const { user, signOut } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // avatarPath saves the path in storage (e.g., userId/avatars/123.png)
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  // avatarSignedUrl saves the temporary valid signed URL to display
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('users')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setFirstName(data.first_name || user.user_metadata?.first_name || 'Autochat');
          setLastName(data.last_name || user.user_metadata?.last_name || 'User');
          setAvatarPath(data.avatar_url);
          
          if (data.avatar_url) {
            // Generate signed URL
            const { data: signedData, error } = await supabase.storage
              .from('app-files')
              .createSignedUrl(data.avatar_url, 3600);
            
            if (signedData) {
              setAvatarSignedUrl(signedData.signedUrl);
            } else {
              console.error('Error generating signed URL:', error);
            }
          }
        }
      };
      fetchProfile();
    }
  }, [user]);

  const getInitials = () => {
    if (!firstName && !lastName) return 'AU';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !avatarPath) return;
    setUploading(true);
    try {
      // 1. Remove from storage
      const { error: deleteError } = await supabase.storage
        .from('app-files')
        .remove([avatarPath]);
        
      if (deleteError) throw deleteError;
      
      // 2. Remove from database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update metadata to reflect the removal globally
      await supabase.auth.updateUser({
        data: {
          avatar_url: null
        }
      });
      
      setAvatarPath(null);
      setAvatarSignedUrl(null);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      alert('Error removing avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setUploading(true);

    try {
      let newAvatarPath = avatarPath;
      
      // Upload new avatar if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${user.id}/avatars/${Date.now()}.${fileExt}`;
        
        // Remove old file from storage if there was one
        if (avatarPath) {
          await supabase.storage.from('app-files').remove([avatarPath]);
        }
        
        const { error: uploadError } = await supabase.storage
          .from('app-files')
          .upload(filePath, selectedFile, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        newAvatarPath = filePath;
        
        // Update local signed URL instantly
        const { data: signedData } = await supabase.storage
          .from('app-files')
          .createSignedUrl(filePath, 3600);
        if (signedData) {
          setAvatarSignedUrl(signedData.signedUrl);
        }
      }

      // Update public.users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: newAvatarPath
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      // Update auth user metadata so changes reflect in session globally
      await supabase.auth.updateUser({
        data: {
           first_name: firstName,
           last_name: lastName,
           avatar_url: newAvatarPath
        }
      });

      setAvatarPath(newAvatarPath);
      setPreviewUrl(null);
      setSelectedFile(null);
      alert('Profile saved successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert(error.message || 'Error saving profile.');
    } finally {
      setUploading(false);
    }
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
            
            {/* Avatar container */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border border-white/10 shrink-0 relative group overflow-hidden">
                 {(previewUrl || avatarSignedUrl) ? (
                    <img src={previewUrl || avatarSignedUrl as string} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">{getInitials()}</span>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1">
                      <Camera className="w-4 h-4" /> Change
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileSelect} 
                      />
                    </label>
                  </div>
              </div>
              
              {/* Delete Avatar Button */}
              {avatarPath && !uploading && (
                <button 
                  onClick={handleRemoveAvatar}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
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
            
            <button 
              onClick={handleSave}
              disabled={uploading}
              className="px-5 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-6">
            <h3 className="text-lg font-semibold text-white/90">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/40 mb-2">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/40 mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/40 mb-2">Email Address</label>
                <div className="h-12 px-4 rounded-xl bg-black/40 border border-white/5 flex items-center text-white/50 cursor-not-allowed">
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