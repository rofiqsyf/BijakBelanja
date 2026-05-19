import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Header, GlassCard } from '../components/ui';
import { useAppContext } from '../store/AppContext';

export const DashboardView = () => {
  const { state, setView } = useAppContext();
  const { settings, transactions } = state;

  const totalSisa = settings.income - settings.expenses - settings.bills - transactions.filter(t => t.status === 'SPENT').reduce((acc, t) => acc + t.amount, 0);

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Beranda" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <section className="mb-8 mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold dark:text-white text-slate-800 tracking-tighter">Halo, {settings.name || 'User'}</h1>
              <h2 className="text-xl font-bold mt-1 text-slate-700 dark:text-white">Status: <span className="text-neon-emerald italic tracking-tight">ONLINE</span></h2>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald animate-pulse"></span>
              <Icons.Activity size={18} />
            </div>
          </section>

          <GlassCard className="mb-8 p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sisa Saldo Aman</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className="text-3xl md:text-4xl font-black dark:text-white text-slate-900 tracking-tighter">{formatIDR(totalSisa)}</h3>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-neon-indigo/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Icons.Wallet size={24} className="text-neon-indigo" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-neon-emerald">Kebutuhan (Needs)</span>
                <span className="text-neon-indigo">Tabungan (Saving)</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (settings.expenses/settings.income)*100)}%` }}
                  className="h-full bg-neon-emerald shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (settings.savings/settings.income)*100)}%` }}
                  className="h-full bg-neon-indigo shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                />
              </div>
            </div>

            <div 
              onClick={() => setView('AILOG')}
              className="bg-neon-emerald/10 dark:bg-neon-emerald/5 border border-neon-emerald/20 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-neon-emerald/20 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse"></div>
              <p className="text-xs font-bold text-neon-emerald uppercase tracking-widest italic line-clamp-2">Log AI: Klik untuk melihat detail prediksi asetmu bulan ini.</p>
            </div>
          </GlassCard>
        </div>

        <div>
          <section className="mb-6 mt-4">
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="font-bold text-xl dark:text-white text-slate-800 tracking-tight">Riwayat Pindai Terbaru</h3>
              <button onClick={() => setView('VAULT')} className="text-neon-indigo text-[10px] font-black uppercase tracking-widest hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center p-8 text-slate-500 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-sm font-bold">
                  Belum ada riwayat pindai barang. Pindai keranjangmu sekarang!
                </div>
              ) : (
                transactions.slice(0, 4).map((item) => (
                  <GlassCard key={item.id} className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center text-slate-500 shadow-inner">
                        {item.image ? (
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                           <Icons.ShoppingBag size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold dark:text-white text-slate-800 text-sm">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500">{item.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${item.type === 'WANT' ? 'text-neon-red' : 'text-neon-emerald'}`}>{item.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm dark:text-white text-slate-800">{formatIDR(item.amount)}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block ${
                        item.status === 'BATAL' ? 'bg-neon-red/20 text-neon-red' : (['DISIMPAN', 'SAVED'].includes(item.status) ? 'bg-neon-emerald/20 text-neon-emerald' : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400')
                      }`}>
                        {item.status === 'BATAL' ? 'Gagal Dibeli' : item.status}
                      </span>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
