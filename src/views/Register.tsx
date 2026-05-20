import React, { useState } from 'react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext } from '../store/AppContext';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

export const RegisterView = () => {
  const { setView, updateSettings } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|co|id|net|org)(\.[a-z]{2})?$/i;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (formData.name && isValidEmail(formData.email) && formData.password) {
      setIsError(false);
      await updateSettings({ name: formData.name, email: formData.email });
      setView('ONBOARDING');
    } else {
      setIsError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md mx-auto">
      <Header title="Daftar" showBack backTo="LOGIN" />

      <section className="mb-8 space-y-3">
        <h2 className="text-3xl font-light dark:text-white text-slate-800 leading-tight italic">Mulai <br/><span className="font-bold">Perjalananmu</span></h2>
        <p className="text-slate-500 max-w-xs leading-relaxed">Bergabung dengan ribuan orang yang telah diselamatkan dari gaya hidup impulsif.</p>
      </section>

      <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
        <GlassCard className="space-y-6">
          <div className="relative">
            <Icons.User className={`absolute left-4 top-4 ${isError && !formData.name ? 'text-neon-red' : 'text-slate-400'}`} size={20} />
            <input 
              type="text" 
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                setIsError(false);
              }}
              className={`w-full bg-slate-50 dark:bg-black/50 border rounded-xl py-4 pl-12 pr-4 text-slate-800 dark:text-white outline-none transition-all ${isError && !formData.name ? 'border-neon-red focus:border-neon-red focus:ring-1 focus:ring-neon-red shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-200 dark:border-white/10 focus:border-neon-indigo focus:ring-1 focus:ring-neon-indigo'}`}
            />
          </div>
          
          <div className="relative">
            <Icons.Mail className={`absolute left-4 top-4 ${isError && !isValidEmail(formData.email) ? 'text-neon-red' : 'text-slate-400'}`} size={20} />
            <input 
              type="email" 
              placeholder="Alamat Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setIsError(false);
              }}
              className={`w-full bg-slate-50 dark:bg-black/50 border rounded-xl py-4 pl-12 pr-4 text-slate-800 dark:text-white outline-none transition-all ${isError && !isValidEmail(formData.email) ? 'border-neon-red focus:border-neon-red focus:ring-1 focus:ring-neon-red shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-200 dark:border-white/10 focus:border-neon-indigo focus:ring-1 focus:ring-neon-indigo'}`}
            />
          </div>

          <div className="relative">
            <Icons.Lock className={`absolute left-4 top-4 ${isError && !formData.password ? 'text-neon-red' : 'text-slate-400'}`} size={20} />
            <input 
              type="password" 
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setIsError(false);
              }}
              className={`w-full bg-slate-50 dark:bg-black/50 border rounded-xl py-4 pl-12 pr-4 text-slate-800 dark:text-white outline-none transition-all ${isError && !formData.password ? 'border-neon-red focus:border-neon-red focus:ring-1 focus:ring-neon-red shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-200 dark:border-white/10 focus:border-neon-indigo focus:ring-1 focus:ring-neon-indigo'}`}
            />
          </div>

          {isError && (
            <p className="text-[10px] font-bold text-neon-red uppercase tracking-widest text-center italic drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
               Pastikan semua field diisi dengan format yang benar.
            </p>
          )}

          <NeonButton onClick={handleRegister}>
            Buat Akun
          </NeonButton>
        </GlassCard>
      </motion.div>
    </div>
  );
};
