import React, { useState } from 'react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext } from '../store/AppContext';
import * as Icons from 'lucide-react';

export const RegisterView = () => {
  const { setView, updateSettings } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async () => {
    if (formData.name && formData.email) {
      await updateSettings({ name: formData.name, email: formData.email });
      setView('ONBOARDING');
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md mx-auto">
      <Header title="Daftar" showBack backTo="LOGIN" />

      <section className="mb-8 space-y-3">
        <h2 className="text-3xl font-light dark:text-white text-slate-800 leading-tight italic">Mulai <br/><span className="font-bold">Perjalananmu</span></h2>
        <p className="text-slate-500 max-w-xs leading-relaxed">Bergabung dengan ribuan orang yang telah diselamatkan dari gaya hidup impulsif.</p>
      </section>

      <GlassCard className="space-y-6">
        <div className="relative">
          <Icons.User className="absolute left-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-slate-800 dark:text-white focus:border-neon-indigo focus:ring-1 focus:ring-neon-indigo outline-none transition-all"
          />
        </div>
        
        <div className="relative">
          <Icons.Mail className="absolute left-4 top-4 text-slate-400" size={20} />
          <input 
            type="email" 
            placeholder="Alamat Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-slate-800 dark:text-white focus:border-neon-indigo focus:ring-1 focus:ring-neon-indigo outline-none transition-all"
          />
        </div>

        <div className="relative">
          <Icons.Lock className="absolute left-4 top-4 text-slate-400" size={20} />
          <input 
            type="password" 
            placeholder="Kata Sandi"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-slate-800 dark:text-white focus:border-neon-indigo focus:ring-1 focus:ring-neon-indigo outline-none transition-all"
          />
        </div>

        <NeonButton onClick={handleRegister} disabled={!formData.name || !formData.email}>
          Buat Akun
        </NeonButton>
      </GlassCard>
    </div>
  );
};
