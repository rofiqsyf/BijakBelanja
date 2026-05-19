import React, { useRef } from 'react';
import * as Icons from 'lucide-react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext } from '../store/AppContext';

export const ProfileView = () => {
  const { state, setView, updateSettings, resetApp } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateSettings({ profilePic: url });
    }
  };

  const handleLogout = () => {
    resetApp();
  };

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Profil Agen" showBack />
      
      <div className="flex flex-col items-center gap-6 mt-8">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 rounded-full border-4 border-neon-indigo p-1 shadow-[0_0_30px_rgba(99,102,241,0.4)] relative cursor-pointer hover:scale-105 transition-transform group"
        >
          <img src={state.settings.profilePic} className="rounded-full w-full h-full bg-slate-800 object-cover" alt="Avatar" />
          <div className="absolute inset-2 rounded-full bg-black/50 hidden group-hover:flex items-center justify-center">
            <Icons.Camera size={24} className="text-white" />
          </div>
          <div className="absolute -bottom-2 right-4 bg-neon-indigo text-white p-1.5 rounded-full border-2 border-slate-50 dark:border-black">
            <Icons.ShieldCheck size={16} />
          </div>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
        />
        <div className="text-center group cursor-pointer relative">
          <input 
            type="text" 
            value={state.settings.name}
            onChange={(e) => updateSettings({ name: e.target.value })}
            className="text-3xl font-black dark:text-white text-slate-800 italic tracking-tighter uppercase bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:border-neon-indigo outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-12">
        <GlassCard className="p-6 text-center space-y-2 dark:bg-black/40">
          <p className="text-2xl font-black dark:text-white text-slate-800 italic tracking-tighter">{state.transactions.filter(t => t.status === 'BATAL').length}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impuls Diblokir</p>
        </GlassCard>
        <GlassCard className="p-6 text-center space-y-2 dark:bg-black/40">
          <p className="text-2xl font-black text-neon-emerald italic tracking-tighter">
            {formatIDR(state.transactions.filter(t => t.status === 'BATAL' || t.status === 'SAVED').reduce((a, b) => a + b.amount, 0))}
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dana Dilindungi</p>
        </GlassCard>
      </div>

      <div className="mt-8 space-y-4">
        {[
          { label: 'Pangkat Saat Ini', icon: Icons.Award, value: 'Penjaga Kekayaan' },
          { label: 'Pengaturan Keamanan', icon: Icons.Shield, value: 'MAKSIMAL' },
          { label: 'Akun Tertaut', icon: Icons.Link, value: '3 Aktif' },
          { label: 'Preferensi Neural', icon: Icons.Cpu, value: 'Konservatif' },
          { label: 'Riwayat Penyebaran', icon: Icons.History, value: 'Bersih' },
        ].map(item => (
          <GlassCard key={item.label} onClick={() => alert('Fitur ini akan segera hadir.')} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer group dark:bg-black/20 transition-all">
            <div className="flex items-center gap-4">
              <item.icon size={20} className="text-slate-500 group-hover:text-neon-indigo transition-colors" />
              <div className="space-y-0.5">
                <span className="text-sm font-bold dark:text-white text-slate-800 uppercase tracking-widest leading-none block">{item.label}</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.value}</span>
              </div>
            </div>
            <Icons.ChevronRight size={18} className="text-slate-400 group-hover:dark:text-white group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
          </GlassCard>
        ))}
      </div>

      <NeonButton 
        variant="danger" 
        onClick={handleLogout}
        className="mt-12 py-4 h-auto text-xs font-black uppercase tracking-[0.4em] italic rounded-2xl"
      >
        NONAKTIFKAN AGEN (LOGOUT)
      </NeonButton>
    </div>
  );
};
