import React, { useState } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Header, GlassCard, NeonButton, Modal } from '../components/ui';
import { useAppContext } from '../store/AppContext';

export const AnalysisView = () => {
  const { setView, state, addTransaction, setActiveScan } = useAppContext();
  const { activeScan, settings, transactions } = state;
  const [modalOpen, setModalOpen] = useState(false);

  if (!activeScan) return null;

  const totalSpent = transactions.filter(t => t.status === 'SPENT').reduce((acc, t) => acc + t.amount, 0);
  const totalSisa = settings.income - settings.expenses - settings.bills - totalSpent;

  // Compute colors based directly on regret score which was assigned based on remaining balance logic
  const isRed = activeScan.regretScore >= 70;
  const isYellow = activeScan.regretScore >= 50 && activeScan.regretScore < 70;
  const isGreen = activeScan.regretScore < 50;

  const handleBuy = async () => {
    if (isRed) return;
    await addTransaction({
      name: activeScan.name,
      amount: activeScan.price,
      type: isGreen ? 'NEED' : 'WANT',
      status: 'SPENT',
      image: activeScan.fileUrl
    });
    setActiveScan(null);
    setView('DASHBOARD');
  };

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const dashOffset = 251 - (251 * activeScan.regretScore) / 100;

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Analisis" showBack backTo="SCAN" />

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <GlassCard className="p-8 space-y-8 bg-white/70 dark:bg-black/20 shadow-2xl">
          <div className="flex justify-between items-start gap-6">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 shadow-2xl relative group">
                <div className="absolute inset-0 bg-neon-indigo/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src={activeScan.fileUrl} 
                  alt="Product" 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-black dark:text-white text-slate-800 italic tracking-tight leading-loose mb-2">{activeScan.name}</h3>
                <p className="text-neon-red font-black text-xl italic drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">{formatIDR(activeScan.price)}</p>
              </div>
            </div>
            <div className="bg-neon-red text-white text-[9px] font-black px-4 py-1.5 rounded-full animate-pulse tracking-[0.3em] shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-neon-red/30 italic">
              WANT
            </div>
          </div>

          <div className="border-t border-b border-black/5 dark:border-white/5 py-8 space-y-4">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Analisis Penyesalan Neural</p>
              <div className="relative w-48 h-24 mx-auto overflow-hidden">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="96" cy="96" r="80" 
                    fill="transparent" 
                    stroke="rgba(128,128,128,0.2)" 
                    strokeWidth="14" 
                    strokeDasharray="251" 
                    strokeDashoffset="0"
                    className="transform rotate-90"
                  />
                  <motion.circle 
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 2, ease: 'circOut' }}
                    cx="96" cy="96" r="80" 
                    fill="transparent" 
                    stroke="url(#gaugeGradient)" 
                    strokeWidth="16" 
                    strokeDasharray="251"
                    strokeLinecap="round"
                    className="transform rotate-90"
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-2">
                  <span className={`text-3xl font-black italic shadow-sm ${isRed ? 'text-neon-red drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]' : isYellow ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'text-neon-emerald drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`}>
                    {Math.round(activeScan.regretScore / 10)}/10
                  </span>
                </div>
              </div>
              <p className="text-xs font-bold mt-6 text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">
                {isRed ? '"Sangat berbahaya! Pasti menyesal parah."' : isYellow ? '"Keraguan tinggi. Coba pikirkan lagi."' : '"Aman! Pembelian terkendali."'}
              </p>
            </div>
          </div>

          <div className={`border rounded-2xl p-5 flex gap-5 shadow-sm ${isRed ? 'bg-neon-red/5 border-neon-red/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]' : isYellow ? 'bg-yellow-500/5 border-yellow-500/20 shadow-[inset_0_0_15px_rgba(234,179,8,0.05)]' : 'bg-neon-emerald/5 border-neon-emerald/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]'}`}>
            <Icons.AlertTriangle className={`shrink-0 ${isRed ? 'text-neon-red' : isYellow ? 'text-yellow-500' : 'text-neon-emerald'}`} size={26} />
            <p className="text-xs font-black dark:text-white/80 text-slate-800 leading-relaxed uppercase tracking-wider italic">
              {isRed ? '🚨 Bahaya: Membeli ini akan menembus batas keamanan saldo bulanan kamu!' : 
               isYellow ? '⚠️ Peringatan: Pembelian ini cukup menguras saldo. Lanjutkan dengan hati-hati.' : 
               '✅ Aman: Pembelian ini masih dalam batas aman saldo bulanan kamu.'}
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <NeonButton 
              variant="secondary" 
              icon={Icons.Hourglass} 
              onClick={() => setView('CAPSULE')}
              className="py-4 h-auto text-xs uppercase tracking-[0.2em] font-black italic"
            >
              MULAI PENDINGINAN (48 JAM)
            </NeonButton>
            
            {isRed ? (
              <button 
                onClick={() => {
                  const btn = document.getElementById('buy-anyway');
                  btn?.classList.add('shake', 'bg-neon-red/10');
                  setTimeout(() => {
                    btn?.classList.remove('shake', 'bg-neon-red/10');
                    setModalOpen(true);
                  }, 500);
                }}
                id="buy-anyway"
                className="w-full h-14 rounded-2xl border border-neon-red/30 text-neon-red font-black text-[10px] uppercase tracking-[0.4em] hover:bg-neon-red/10 transition-all italic tracking-widest"
              >
                TETAP BELI (BAHAYA)
              </button>
            ) : (
              <button 
                onClick={handleBuy}
                className={`w-full h-14 rounded-2xl border font-black text-[10px] uppercase tracking-[0.4em] transition-all italic tracking-widest ${isYellow ? 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10' : 'border-neon-emerald/30 text-neon-emerald hover:bg-neon-emerald/10'}`}
              >
                BELI SEKARANG (AMAN)
              </button>
            )}
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-6 py-6 px-8 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/40">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 text-neon-indigo flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Icons.TrendingUp size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Trajektori Brankas</p>
            <p className="text-sm font-bold dark:text-white text-slate-800 italic mt-1 leading-none tracking-tight">Batal = +15% Selaras dengan <span className="text-neon-indigo">Target Tabunganmu</span>.</p>
          </div>
        </GlassCard>
      </motion.div>
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title="Otorisasi Gagal"
        message="Saldo kritis. Membeli barang ini membahayakan cadangan dan operasional pokok. AI memblokir transaksi demi perlindungan asetmu."
        variant="danger"
      />
    </div>
  );
};
