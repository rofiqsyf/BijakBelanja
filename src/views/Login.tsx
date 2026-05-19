import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { GlassCard } from '../components/ui';
import { useAppContext } from '../store/AppContext';

export const LoginView = () => {
  const { setView } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-12 max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-24 h-32 relative">
           <Icons.MapPin size={96} className="text-neon-indigo drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
           <div className="absolute inset-0 flex items-center justify-center pt-2">
             <Icons.Sparkles size={32} className="text-neon-purple animate-pulse" />
           </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">BijakBelanja</h1>
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-slate-500 mt-1">AI Anti-Impulsive Spending</p>
        </div>
      </motion.div>

      <GlassCard className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Selamat Datang</h3>
          <p className="text-slate-500 text-sm">Ambil kendali atas uangmu hari ini</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => setView('REGISTER')} className="w-full h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-3 font-semibold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
            <Icons.Globe size={20} /> Masuk dengan Google
          </button>
          <button onClick={() => setView('REGISTER')} className="w-full h-12 rounded-xl bg-slate-800 text-white dark:bg-white dark:text-black flex items-center justify-center gap-3 font-semibold hover:bg-slate-700 dark:hover:bg-white/90 transition-colors">
            <Icons.Smartphone size={20} /> Masuk dengan Apple
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/5"></div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Diamankan oleh AI</span>
          <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/5"></div>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Belum punya akun? <button onClick={() => setView('REGISTER')} className="text-neon-indigo font-bold">Daftar Sekarang</button>
        </p>
      </GlassCard>

      <div className="flex gap-8 text-slate-500 dark:text-slate-600">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
          <Icons.ShieldCheck size={14} className="text-neon-emerald" /> Military Grade
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
          <Icons.Lock size={14} className="text-neon-indigo" /> Privacy First
        </div>
      </div>
    </div>
  );
};
