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
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-24 h-32 relative cursor-pointer"
        >
           <Icons.ShoppingCart size={96} className="text-neon-indigo drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
           <div className="absolute inset-0 flex items-center justify-center pt-2">
             <Icons.Sparkles size={32} className="text-neon-purple animate-pulse" />
           </div>
        </motion.div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">BijakBelanja</h1>
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-slate-500 mt-1">AI Anti-Impulsive Spending</p>
        </div>
      </motion.div>

      <GlassCard className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Selamat Datang</h3>
          <div className="relative group inline-block">
            <p className="text-slate-500 text-sm cursor-help border-b border-dashed border-slate-400 pb-0.5">Ambil kendali atas uangmu hari ini</p>
            <div className="absolute top-full mt-2 w-64 md:w-72 bg-slate-900 dark:bg-black text-white text-xs rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 left-1/2 -translate-x-1/2 shadow-2xl border border-slate-800 dark:border-white/20">
              <div className="absolute -top-2 right-1/2 translate-x-1/2 border-8 border-transparent border-b-slate-900 dark:border-b-black"></div>
              <div className="flex items-center gap-2 mb-2 text-neon-emerald">
                <Icons.ShieldCheck size={16} />
                <strong className="uppercase tracking-widest text-[10px]">AI Guardian</strong>
              </div>
              <p className="text-slate-300 leading-relaxed text-left">
                Analisis pintar kami akan mendeteksi tingkat impulsif belanjamu. Dapatkan "Regret Score" dan fitur Kapsul Waktu untuk mengamankan keuanganmu sebelum kamu menyesal!
              </p>
            </div>
          </div>
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
