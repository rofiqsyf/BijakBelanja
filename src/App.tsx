import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { useAppContext } from './store/AppContext';
import { BottomNav } from './components/BottomNav';

// Views
import { LoginView } from './views/Login';
import { RegisterView } from './views/Register';
import { OnboardingView } from './views/Onboarding';
import { DashboardView } from './views/Dashboard';
import { ScanView } from './views/Scan';
import { AnalysisView } from './views/Analysis';
import { CapsuleView } from './views/Capsule';
import { VaultView } from './views/Vault';
import { ProfileView } from './views/Profile';
import { AILogView } from './views/AILog';
import { HistoryView } from './views/History';

export default function App() {
  const { view, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Icons.Cpu className="text-neon-indigo animate-pulse" size={64} />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border-2 border-neon-indigo border-t-transparent"
          />
        </div>
        <p className="text-[10px] font-black text-neon-indigo uppercase tracking-[0.5em] animate-pulse italic">Menyinkronkan Neural Link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-neon-indigo/30 text-slate-800 dark:text-slate-300">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(5px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full h-full"
        >
          {view === 'LOGIN' && <LoginView />}
          {view === 'REGISTER' && <RegisterView />}
          {view === 'ONBOARDING' && <OnboardingView />}
          {view === 'DASHBOARD' && <DashboardView />}
          {view === 'SCAN' && <ScanView />}
          {view === 'ANALYSIS' && <AnalysisView />}
          {view === 'CAPSULE' && <CapsuleView />}
          {view === 'VAULT' && <VaultView />}
          {view === 'PROFILE' && <ProfileView />}
          {view === 'AILOG' && <AILogView />}
          {view === 'HISTORY' && <HistoryView />}
        </motion.div>
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
