import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Header, GlassCard } from '../components/ui';
import { useAppContext } from '../store/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StreakCalendar = () => {
  const { state } = useAppContext();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Convert local dates to 'YYYY-MM-DD' formatted strings for easy comparison
  const activeDays = new Set([
    ...state.transactions.map(t => {
      const d = new Date(t.date);
      // ensure we use the local date representation
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }),
    ...(state.settings.scanDates || [])
  ]);

  const days = [];
  // Add empty slots for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isActive = activeDays.has(dateStr);
    const isToday = day === today.getDate();

    days.push(
      <div 
        key={day} 
        className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
          isActive 
            ? 'bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
            : isToday 
              ? 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20' 
              : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        {isActive ? <Icons.Check size={14} strokeWidth={3} /> : day}
      </div>
    );
  }

  return (
    <GlassCard className="mb-8 p-6 space-y-4">
      <div className="flex items-center justify-between pointer-events-none">
        <h3 className="text-sm font-black dark:text-white text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Icons.Flame className="text-orange-500" size={18} />
            Streak Pintar
        </h3>
        <span className="text-xs font-bold text-slate-500">{new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(today)}</span>
      </div>
      <div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
           {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
             <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>
           ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 justify-items-center">
            {days}
        </div>
      </div>
    </GlassCard>
  );
};

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

            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <h4 className="text-sm font-black dark:text-white text-slate-800 uppercase tracking-widest mb-4">Grafik Keuangan Bulanan</h4>
              <div className="h-48 w-full text-xs font-bold font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Income', value: settings.income, fill: '#10b981' }, // emerald
                    { name: 'Expenses', value: settings.expenses + settings.bills, fill: '#ef4444' }, // red
                    { name: 'Savings', value: settings.savings, fill: '#6366f1' }, // indigo
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `Rp${(val/1000000).toFixed(1)}M`} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tw-prose-body, #fff)' }} formatter={(val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          <StreakCalendar />
        </div>

        <div>
          <section className="mb-6 mt-4">
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="font-bold text-xl dark:text-white text-slate-800 tracking-tight">Riwayat Pindai Terbaru</h3>
              <button onClick={() => setView('HISTORY')} className="text-neon-indigo text-[10px] font-black uppercase tracking-widest hover:underline">Lihat Semua</button>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {transactions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="text-center p-8 text-slate-500 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-sm font-bold"
                  >
                    Belum ada riwayat pindai barang. Pindai keranjangmu sekarang!
                  </motion.div>
                ) : (
                  transactions.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                      layout
                    >
                      <GlassCard className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
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
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
