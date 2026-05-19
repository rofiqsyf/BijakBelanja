import React, { useState } from 'react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext } from '../store/AppContext';
import * as Icons from 'lucide-react';

export const OnboardingView = () => {
  const { setView, updateSettings } = useAppContext();
  const [data, setData] = useState({ income: '', savings: '', expenses: '', bills: '' });

  const handleChange = (key: string, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    setData({ ...data, [key]: cleanVal });
  };

  const handleComplete = async () => {
    await updateSettings({
      income: Number(data.income) || 0,
      savings: Number(data.savings) || 0,
      expenses: Number(data.expenses) || 0,
      bills: Number(data.bills) || 0
    });
    setView('DASHBOARD');
  };

  const formatIDR = (val: string) => val ? 'Rp ' + parseInt(val, 10).toLocaleString('id-ID') : '';

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md mx-auto">
      <Header title="Persiapan Data" />

      <section className="mt-4 mb-8 space-y-3">
        <h2 className="text-4xl font-bold dark:text-white text-slate-800 leading-tight italic">Yuk, kenalan <br/>sama dompetmu dulu! 💸</h2>
        <p className="text-slate-500 max-w-xs leading-relaxed">Biar AI kami bisa jagain kamu dari boncos yang nggak perlu.</p>
      </section>

      <div className="space-y-6 pb-8">
        {[
          { key: 'income', label: 'Pendapatan Bulanan', icon: Icons.Wallet },
          { key: 'savings', label: 'Total Tabungan', icon: Icons.CircleDollarSign },
          { key: 'expenses', label: 'Pengeluaran Tetap', icon: Icons.ShoppingBag }
        ].map((item) => (
          <GlassCard key={item.key} className="group focus-within:border-neon-indigo/50 transition-all">
            <div className="absolute top-4 right-4 opacity-10 group-focus-within:opacity-40 transition-opacity">
              <item.icon size={32} className="text-neon-indigo" />
            </div>
            <div className="relative pt-2">
              <input 
                type="text" 
                value={formatIDR(data[item.key as keyof typeof data])}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder=" "
                className="w-full bg-transparent border-0 border-b border-slate-200 dark:border-white/10 focus:border-neon-indigo focus:ring-0 pt-6 pb-2 text-xl font-bold dark:text-white text-slate-800 transition-all peer outline-none"
              />
              <label className="absolute left-0 top-1 text-xs font-bold uppercase tracking-widest text-slate-500 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:text-neon-indigo transition-all">
                {item.label}
              </label>
            </div>
          </GlassCard>
        ))}

        <GlassCard className="border-neon-red/20 bg-neon-red/5 shadow-[0_0_30px_rgba(239,68,68,0.05)] group focus-within:border-neon-red/50 transition-all">
          <div className="absolute top-4 right-4 opacity-20 group-focus-within:opacity-50 transition-opacity text-neon-red">
            <Icons.AlertTriangle size={32} />
          </div>
          <div className="mb-4">
            <span className="text-[10px] font-bold bg-neon-red text-white py-1 px-3 rounded-full animate-pulse tracking-widest">AREA KRITIS</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={formatIDR(data.bills)}
              onChange={(e) => handleChange('bills', e.target.value)}
              placeholder=" "
              className="w-full bg-transparent border-0 border-b border-neon-red/30 focus:border-neon-red focus:ring-0 pt-6 pb-2 text-xl font-black text-neon-red transition-all peer outline-none"
            />
            <label className="absolute left-0 top-1 text-xs font-bold uppercase tracking-widest text-neon-red/70 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase transition-all">
              Tagihan & PayLater
            </label>
          </div>
        </GlassCard>

        <NeonButton 
          onClick={handleComplete} 
          icon={Icons.Power} 
          className="mt-8"
        >
          Aktifkan AI Guardian
        </NeonButton>
      </div>
    </div>
  );
};
