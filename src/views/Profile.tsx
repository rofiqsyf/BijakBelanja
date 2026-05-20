import React, { useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext, Settings } from '../store/AppContext';

export const ProfileView = () => {
  const { state, setView, updateSettings, resetApp } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showNeural, setShowNeural] = useState(false);

  const protectedFunds = state.transactions.filter(t => t.status === 'BATAL' || t.status === 'SAVED').reduce((a, b) => a + b.amount, 0);

  const getRank = (funds: number) => {
    if (funds >= 5000000) return 'Dewa Finansial';
    if (funds >= 1000000) return 'Penjaga Kekayaan';
    return 'Pemula Biasa';
  };

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
            {formatIDR(protectedFunds)}
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dana Dilindungi</p>
        </GlassCard>
      </div>

      <div className="mt-8 space-y-4">
        {/* Pangkat Saat Ini */}
        <GlassCard className="flex items-center justify-between p-6 dark:bg-black/20">
          <div className="flex items-center gap-4">
            <Icons.Award size={20} className="text-neon-indigo" />
            <div className="space-y-0.5">
              <span className="text-sm font-bold dark:text-white text-slate-800 uppercase tracking-widest leading-none block">Pangkat Saat Ini</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{getRank(protectedFunds)}</span>
            </div>
          </div>
        </GlassCard>

        {/* Pengaturan Keamanan */}
        <GlassCard className="p-4 dark:bg-black/20 flex flex-col justify-center">
          <div className="flex justify-between items-center cursor-pointer p-2 py-3" onClick={() => setShowSecurity(!showSecurity)}>
            <div className="flex items-center gap-4">
              <Icons.Shield size={20} className="text-slate-500 hover:text-neon-indigo transition-colors" />
              <div className="space-y-0.5">
                <span className="text-sm font-bold dark:text-white text-slate-800 uppercase tracking-widest leading-none block">Pengaturan Keamanan</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Level {(state.settings.securityLevel || 3) === 1 ? 'Santai' : (state.settings.securityLevel || 3) === 2 ? 'Waspada' : 'Maksimal'}</span>
              </div>
            </div>
            <Icons.ChevronDown size={18} className={`text-slate-400 transition-transform ${showSecurity ? 'rotate-180' : ''}`} />
          </div>
          {showSecurity && (
            <div className="pt-4 px-2 pb-2 mt-2 border-t border-slate-200 dark:border-white/10">
              <input 
                type="range" 
                min="1" 
                max="3" 
                value={state.settings.securityLevel || 3}
                onChange={(e) => updateSettings({ securityLevel: parseInt(e.target.value) })}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors ${
                  (state.settings.securityLevel || 3) === 1 ? 'bg-neon-emerald' : 
                  (state.settings.securityLevel || 3) === 2 ? 'bg-yellow-500' : 'bg-neon-red'
                }`}
              />
              <div className="flex justify-between mt-3 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                 <span className={`${(state.settings.securityLevel || 3) === 1 ? 'text-neon-emerald' : ''}`}>Santai</span>
                 <span className={`${(state.settings.securityLevel || 3) === 2 ? 'text-yellow-500' : ''}`}>Waspada</span>
                 <span className={`${(state.settings.securityLevel || 3) === 3 ? 'text-neon-red' : ''}`}>Maksimal</span>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Tema Tampilan */}
        <GlassCard onClick={() => {
            const themes: (Settings['theme'] | undefined)[] = ['default', 'cyberpunk', 'minimalist'];
            const currIdx = themes.indexOf(state.settings.theme || 'default');
            const nextTheme = themes[(currIdx + 1) % themes.length];
            updateSettings({ theme: nextTheme });
        }} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer group dark:bg-black/20 transition-all">
          <div className="flex items-center gap-4">
            <Icons.Palette size={20} className="text-slate-500 group-hover:text-neon-indigo transition-colors" />
            <div className="space-y-0.5">
              <span className="text-sm font-bold dark:text-white text-slate-800 uppercase tracking-widest leading-none block">Tema Tampilan</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{state.settings.theme === 'cyberpunk' ? 'Cyberpunk' : (state.settings.theme === 'minimalist' ? 'Minimalis' : 'Utama')}</span>
            </div>
          </div>
          <Icons.ChevronRight size={18} className="text-slate-400 group-hover:dark:text-white group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
        </GlassCard>

        {/* Preferensi Neural */}
        <GlassCard className="p-4 dark:bg-black/20 flex flex-col justify-center">
          <div className="flex justify-between items-center cursor-pointer p-2 py-3" onClick={() => setShowNeural(!showNeural)}>
            <div className="flex items-center gap-4">
              <Icons.Cpu size={20} className="text-slate-500 hover:text-neon-indigo transition-colors" />
              <div className="space-y-0.5">
                <span className="text-sm font-bold dark:text-white text-slate-800 uppercase tracking-widest leading-none block">Preferensi Neural</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{state.settings.neuralPreference || 'Biasa'}</span>
              </div>
            </div>
            <Icons.ChevronDown size={18} className={`text-slate-400 transition-transform ${showNeural ? 'rotate-180' : ''}`} />
          </div>
          {showNeural && (
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-3 mt-2">
              {[
                { val: 'Biasa', icon: Icons.Smile, desc: 'Normal' },
                { val: 'Sarkastis', icon: Icons.Meh, desc: 'Menyakitkan' },
                { val: 'Kejam', icon: Icons.Frown, desc: 'Mencekam' },
                { val: 'Supportif', icon: Icons.Heart, desc: 'Penyayang' }
              ].map(pref => (
                <button
                  key={pref.val}
                  onClick={() => updateSettings({ neuralPreference: pref.val as any })}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    (state.settings.neuralPreference || 'Biasa') === pref.val 
                      ? 'border-neon-indigo bg-neon-indigo/10 text-neon-indigo shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <pref.icon size={24} />
                  <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest leading-none mt-1">{pref.val}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{pref.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Riwayat Penyebaran */}
        <GlassCard onClick={() => setView('HISTORY')} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer group dark:bg-black/20 transition-all">
          <div className="flex items-center gap-4">
            <Icons.History size={20} className="text-slate-500 group-hover:text-neon-indigo transition-colors" />
            <div className="space-y-0.5">
              <span className="text-sm font-bold dark:text-white text-slate-800 uppercase tracking-widest leading-none block">Riwayat Penyebaran</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Semua Transaksi</span>
            </div>
          </div>
          <Icons.ChevronRight size={18} className="text-slate-400 group-hover:dark:text-white group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
        </GlassCard>
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
