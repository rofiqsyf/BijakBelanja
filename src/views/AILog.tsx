import React, { useMemo } from 'react';
import { Header, GlassCard } from '../components/ui';
import { useAppContext } from '../store/AppContext';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const AILogView = () => {
  const { state } = useAppContext();
  const { settings, transactions } = state;

  const totalSpent = transactions.filter(t => t.status === 'SPENT').reduce((acc, t) => acc + t.amount, 0);
  const totalSaved = transactions.filter(t => t.status === 'SAVED' || t.status === 'BATAL' || t.status === 'DISIMPAN').reduce((acc, t) => acc + t.amount, 0);
  const totalSisa = settings.income - settings.expenses - settings.bills - totalSpent;

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const chartData = [
    { name: 'Pengeluaran Tetap', value: settings.expenses, color: '#64748b' }, // slate-500
    { name: 'Tagihan/Paylater', value: settings.bills, color: '#ef4444' }, // neon-red
    { name: 'Titik Tabungan', value: settings.savings, color: '#6366f1' }, // neon-indigo
    { name: 'Dana Terselamatkan', value: totalSaved, color: '#a855f7' }, // neon-purple
    { name: 'Sisa Saldo Aman', value: Math.max(0, totalSisa), color: '#10b981' }, // neon-emerald
  ].filter(d => d.value > 0);

  const getRecommendation = () => {
    const sisaRatio = totalSisa / (settings.income || 1);
    if (sisaRatio < 0.15) {
      return "Dengan sisa dana kamu yang sangat rendah, AI menyarankan untuk fokus mempertahankan sisa dana ini untuk kebutuhan primer saja. Hindari semua pembelian yang bersifat keinginan (WANTS).";
    } else if (sisaRatio < 0.4) {
      return "Sisa saldo dalam ambang batas peringatan. Kurangi pembelian impulsif, pertimbangkan setiap belanja tersier dengan sangat matang.";
    } else {
      return "Manajemen keuanganmu bulan ini berjalan sangat efisien! Sisa saldomu melimpah. Pertahankan tren ini atau alokasikan untuk menambah porsi pertumbuhan aset jangka panjangmu.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Log Prediksi AI" showBack backTo="DASHBOARD" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <section className="mb-8 mt-4 flex items-center gap-4">
          <div className="p-2 rounded-2xl bg-neon-emerald/10 text-neon-emerald shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-neon-emerald/20">
            <Icons.Cpu size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white tracking-tight text-slate-800">Detail Prediksi Aset</h2>
        </section>

        <GlassCard className="p-6 md:p-8 mb-6 border-slate-200 dark:border-white/5 shadow-xl bg-white/60 dark:bg-black/40">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Distribusi Keuangan Bulanan</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatIDR(value)} 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: data.color }}></div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{data.name}</span>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">{formatIDR(data.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 border-slate-200 dark:border-white/5 space-y-2 relative overflow-hidden bg-white/60 dark:bg-black/20">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-emerald/5 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Pendapatan</p>
            <h3 className="text-2xl font-black dark:text-white text-slate-800">{formatIDR(settings.income)}</h3>
          </GlassCard>
          
          <GlassCard className="p-6 border-neon-emerald/30 space-y-2 relative overflow-hidden bg-neon-emerald/5">
            <div className="absolute right-2 top-2 text-neon-emerald animate-pulse">
              <Icons.ShieldCheck size={20} />
            </div>
            <p className="text-[10px] font-black text-neon-emerald uppercase tracking-[0.3em]">Sisa Saldo Aman</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{formatIDR(totalSisa)}</h3>
          </GlassCard>
        </div>

        <GlassCard className="p-6 border-neon-indigo/30 bg-indigo-50 dark:bg-neon-indigo/5 mt-6 relative overflow-hidden flex gap-4 md:gap-6 items-start">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-100 dark:bg-neon-indigo/20 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] text-neon-indigo">
             <Icons.Bot size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
              Saran AI <Icons.Sparkles size={14} className="text-neon-indigo" />
            </h4>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic pr-4">
              "{getRecommendation()}"
            </p>
          </div>
        </GlassCard>

      </motion.div>
    </div>
  );
};
