import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const VaultView = () => {
  const { state, updateSettings } = useAppContext();
  const { settings, transactions } = state;

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetForm, setTargetForm] = useState({ name: settings.targetName || '', price: settings.targetPrice ? settings.targetPrice.toString() : '' });
  const [isEditingSavings, setIsEditingSavings] = useState(false);
  const [savingsValue, setSavingsValue] = useState(settings.savings.toString());

  const totalSavedFromTransactions = transactions
    .filter(t => t.status === 'SAVED' || t.status === 'BATAL' || t.status === 'DISIMPAN')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalVault = settings.savings;
  const targetVal = settings.targetPrice || 0;
  const progress = targetVal > 0 ? Math.min(100, Math.round((totalVault / targetVal) * 100)) : 0;

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleSaveTarget = async () => {
    await updateSettings({ targetName: targetForm.name, targetPrice: Number(targetForm.price.replace(/\D/g, '')) || 0 });
    setIsEditingTarget(false);
  };

  const handleSaveSavings = async () => {
    await updateSettings({ savings: Number(savingsValue.replace(/\D/g, '')) || 0 });
    setIsEditingSavings(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Brankas" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <GlassCard className="p-8 space-y-6 bg-gradient-to-br from-indigo-50 dark:from-indigo-950/20 to-transparent shadow-2xl border-slate-200 dark:border-white/10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Total Brankas (Tabungan)</p>
                {isEditingSavings ? (
                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="text" 
                      value={savingsValue ? formatIDR(Number(savingsValue.replace(/\D/g, ''))) : ''} 
                      onChange={e => setSavingsValue(e.target.value)} 
                      className="bg-transparent border-b border-slate-300 dark:border-white/20 py-1 font-black text-slate-800 dark:text-white outline-none w-32 md:w-48 text-xl" 
                    />
                    <NeonButton onClick={handleSaveSavings} className="h-8 text-[10px] px-4">Simpan</NeonButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsEditingSavings(true)}>
                    <h2 className="text-4xl font-black dark:text-white text-slate-800 tracking-tighter group-hover:text-neon-indigo transition-colors">{formatIDR(totalVault)}</h2>
                    <Icons.Edit2 size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-neon-indigo flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Icons.ShieldCheck size={24} className="text-white" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-4">
              {isEditingTarget ? (
                 <div className="space-y-3 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Target</label>
                     <input type="text" value={targetForm.name} onChange={e => setTargetForm({...targetForm, name: e.target.value})} className="w-full bg-transparent border-b border-slate-300 dark:border-white/20 mt-1 py-1 font-bold text-slate-800 dark:text-white outline-none" placeholder="Misal: Liburan Jepang" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Harga Target</label>
                     <input type="text" value={targetForm.price ? formatIDR(Number(targetForm.price.replace(/\D/g, ''))) : ''} onChange={e => setTargetForm({...targetForm, price: e.target.value})} className="w-full bg-transparent border-b border-slate-300 dark:border-white/20 mt-1 py-1 font-bold text-slate-800 dark:text-white outline-none" placeholder="Misal: Rp 15.000.000" />
                   </div>
                   <div className="flex gap-2 pt-2">
                     <NeonButton onClick={() => setIsEditingTarget(false)} variant="outline" className="h-8 text-[10px]">Batal</NeonButton>
                     <NeonButton onClick={handleSaveTarget} className="h-8 text-[10px]">Simpan</NeonButton>
                   </div>
                 </div>
              ) : (
                <>
                  <div className="flex justify-between items-end group">
                    <div className="flex-1 cursor-pointer" onClick={() => setIsEditingTarget(true)}>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">Target Saat Ini <Icons.Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></p>
                      <p className="font-bold dark:text-white text-slate-800 mt-1">{settings.targetName || 'Belum dipilih'}</p>
                      {targetVal > 0 && <p className="text-xs font-bold text-slate-400 mt-0.5">{formatIDR(targetVal)}</p>}
                    </div>
                    {targetVal > 0 && <span className="text-neon-indigo font-black text-2xl italic shrink-0">{progress}%</span>}
                  </div>
                  {targetVal > 0 && (
                    <div className="w-full h-3 bg-slate-200 dark:bg-black/50 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-neon-indigo shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </GlassCard>

          <section className="mt-8 mb-8">
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="p-2 rounded-xl bg-neon-emerald/10 text-neon-emerald">
                <Icons.BarChart2 size={20} />
              </div>
              <h3 className="font-black text-[10px] text-slate-500 uppercase tracking-[0.3em]">Statistik Penyelamatan</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Terselamatkan AI', val: formatIDR(totalSavedFromTransactions), icon: Icons.ShieldCheck, color: 'text-neon-indigo' },
                 { label: 'Total Impulse', val: transactions.filter(t => t.type === 'WANT').length.toString(), icon: Icons.AlertTriangle, color: 'text-neon-red' }
               ].map((stat, i) => (
                 <GlassCard key={i} className="p-5 flex flex-col gap-3 justify-between bg-white/50 dark:bg-black/40">
                    <div className="flex justify-between items-start">
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className={`text-lg font-black tracking-tight leading-none mb-1 ${stat.color}`}>{stat.val}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{stat.label}</p>
                    </div>
                 </GlassCard>
               ))}
            </div>
          </section>
        </div>

        <div>
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="p-2 rounded-xl bg-neon-purple/10 text-neon-purple">
                <Icons.Award size={20} />
              </div>
              <h3 className="font-black text-[10px] text-slate-500 uppercase tracking-[0.3em]">Lencana Kehormatan</h3>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Pejuang Anti-FOMO', desc: `Mengabaikan ${transactions.filter(t=>t.status === 'BATAL').length} peringatan produk viral.`, icon: Icons.Shield, unlocked: transactions.filter(t=>t.status === 'BATAL').length > 0 },
                 { label: 'Pedagang Kompon', desc: 'Mencapai target awal tabungan.', icon: Icons.Gem, unlocked: progress >= 10 },
                 { label: 'Pemula Zen', desc: 'Berdiam selama >24 jam.', icon: Icons.Flower2, border: 'border-slate-200 dark:border-white/5 text-slate-500' }
               ].map((badge, i) => (
                 <GlassCard key={i} className={`flex items-center gap-5 p-5 transition-all ${badge.unlocked ? 'border-neon-emerald/30 bg-emerald-50 dark:bg-neon-emerald/5' : 'opacity-60 grayscale'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${badge.unlocked ? 'bg-neon-emerald text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                       <badge.icon size={24} />
                    </div>
                    <div>
                       <h4 className={`font-black text-sm uppercase tracking-wider ${badge.unlocked ? 'text-neon-emerald' : 'text-slate-500'}`}>{badge.label}</h4>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{badge.desc}</p>
                    </div>
                 </GlassCard>
               ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
