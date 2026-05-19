import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, message, variant = 'primary' }: { isOpen: boolean, onClose: () => void, title: string, message: string, variant?: 'primary' | 'danger' }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-sm glass-card p-8 space-y-6 relative border-white/10 shadow-2xl dark:bg-[#0a0a0a] bg-white text-slate-800 dark:text-white"
        >
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-xl ${variant === 'danger' ? 'bg-neon-red/10 text-neon-red' : 'bg-neon-indigo/10 text-neon-indigo'}`}>
              {variant === 'danger' ? <Icons.AlertTriangle size={24} /> : <Icons.ShieldCheck size={24} />}
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
              <Icons.X size={20} />
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
          </div>
          <NeonButton onClick={onClose} variant={variant === 'danger' ? 'danger' : 'primary'}>
            Mengerti
          </NeonButton>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const GlassCard = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: React.Key }) => (
  <motion.div 
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={`glass-card rounded-2xl p-5 relative overflow-hidden bg-white/60 dark:bg-black/20 text-slate-800 dark:text-slate-300 dark:border-white/10 border-black/5 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

export const NeonButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  icon: Icon
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'emerald',
  className?: string,
  disabled?: boolean,
  icon?: any
}) => {
  const themes = {
    primary: 'bg-neon-indigo text-white hover:bg-neon-indigo/90 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
    secondary: 'bg-neon-purple text-white hover:bg-neon-purple/90 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    emerald: 'bg-neon-emerald text-white hover:bg-neon-emerald/90 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    danger: 'bg-neon-red text-white hover:bg-neon-red/90 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    outline: 'border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`h-12 w-full rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${themes[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
};

import { useAppContext } from '../store/AppContext';

export const Header = ({ title, showBack = false, backTo = 'DASHBOARD' as any }: { title: string, showBack?: boolean, backTo?: any }) => {
  const { setView, state, updateSettings } = useAppContext();

  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-8 h-20">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Icons.ArrowLeft onClick={() => setView(backTo)} className="text-neon-indigo cursor-pointer hover:scale-110 transition-transform" />
          ) : (
            <div className="w-8 h-8 bg-neon-indigo rounded shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
          )}
          <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tighter uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => updateSettings({ darkMode: !state.settings.darkMode })}
            className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            {state.settings.darkMode ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
          </button>
          {state.settings.name && (
            <div 
              onClick={() => setView('PROFILE')}
              className="flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-800 dark:text-white">{state.settings.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 uppercase">Agent</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-neon-indigo/50 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <img src={state.settings.profilePic} className="rounded-full w-full h-full bg-slate-200 dark:bg-slate-800 object-cover" alt="Avatar" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
