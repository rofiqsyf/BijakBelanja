import React from 'react';
import * as Icons from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const { view, setView } = useAppContext();
  
  if (['LOGIN', 'REGISTER', 'ONBOARDING'].includes(view)) return null;

  const tabs = [
    { id: 'DASHBOARD', icon: Icons.LayoutDashboard, label: 'Beranda' },
    { id: 'SCAN', icon: Icons.ScanLine, label: 'Pindai' },
    { id: 'CAPSULE', icon: Icons.TimerReset, label: 'Pendingin' },
    { id: 'VAULT', icon: Icons.Wallet, label: 'Brankas' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-black/5 dark:border-white/5 pb-safe pt-2 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="max-w-md md:max-w-xl mx-auto flex justify-around items-center px-4 h-20">
        {tabs.map(tab => {
          const isActive = view === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 px-4 rounded-xl transition-all duration-300 ${
                isActive 
                ? 'bg-indigo-100 dark:bg-indigo-600/20 text-neon-indigo scale-110 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                : 'text-slate-500 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-400'
              }`}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
