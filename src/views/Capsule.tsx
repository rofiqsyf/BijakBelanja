import React, { useState, useEffect } from 'react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

export const CapsuleView = () => {
  const { state, setView, addTransaction, setActiveScan } = useAppContext();
  const { activeScan } = state;
  const [timeLeft, setTimeLeft] = useState(48 * 3600);

  useEffect(() => {
    // Mock simple countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAbort = async () => {
    if (!activeScan) return;
    await addTransaction({
      name: activeScan.name,
      amount: activeScan.price,
      type: 'WANT',
      status: 'BATAL',
      image: activeScan.fileUrl
    });
    setActiveScan(null);
    setView('DASHBOARD');
  };

  const handleAnswer = (answer: 'Pasti' | 'Mungkin' | 'Tidak') => {
    if (activeScan) {
      setActiveScan({ ...activeScan, answer90Days: answer });
    }
  };

  if (!activeScan) {
    return (
      <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
        <Header title="Pendinginan Neural" />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
            <Icons.TimerReset size={48} />
          </div>
          <h2 className="text-2xl font-black italic text-slate-800 dark:text-white mb-2">Semua Aman</h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-xs">Tidak ada barang yang sedang dalam masa pendinginan. Pengeluaranmu terkendali.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Pendinginan Neural" showBack backTo="ANALYSIS" />

      <section className="mb-8 mt-4 flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-black dark:text-white text-slate-800 italic tracking-tighter leading-none">Status Dingin</h2>
           <p className="text-[10px] font-black text-neon-purple uppercase tracking-[0.3em] mt-3 italic drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">Siklus Aktif</p>
        </div>
        <div className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-neon-purple/10 text-neon-purple border-slate-200 dark:border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
           <Icons.Timer size={28} />
        </div>
      </section>

      <GlassCard className="mb-8 p-10 text-center space-y-8 shadow-2xl bg-white/70 dark:bg-black/20">
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-white/5"></div>
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-0 rounded-full border-[6px] border-neon-purple border-t-transparent shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            />
            <div className="z-10 bg-white/80 dark:bg-black/40 backdrop-blur-2xl rounded-full w-44 h-44 flex flex-col items-center justify-center border border-slate-200 dark:border-white/10 shadow-inner">
               <span className="text-5xl font-black tabular-nums tracking-tighter dark:text-white text-slate-900 italic">{formatTime(timeLeft)}</span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Sisa Waktu</span>
            </div>
        </div>
        
        <p className="text-base font-black text-neon-purple uppercase tracking-widest italic leading-none drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">Berkas dikunci selama 48 Jam</p>

        <div className="space-y-3 px-4">
          <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
             <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '5%' }}
                className="h-full bg-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.8)]"
             />
          </div>
          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <span>MULAI</span>
            <span>SELESAI</span>
          </div>
        </div>
      </GlassCard>

      <section className="mb-10">
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="p-2 rounded-xl bg-neon-emerald/10 text-neon-emerald">
            <Icons.Brain size={20} />
          </div>
          <h3 className="font-black text-[10px] text-slate-500 uppercase tracking-[0.3em]">Interogasi Sokrates</h3>
        </div>
        <GlassCard className="p-8 space-y-10 border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative">
           {activeScan.answer90Days ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Jawabanmu: <span className="text-slate-800 dark:text-white">{activeScan.answer90Days}</span></p>
                {activeScan.answer90Days === 'Pasti' && (
                  <div className="bg-neon-emerald/10 border border-neon-emerald/30 p-6 rounded-2xl text-center">
                     <p className="text-sm font-bold text-neon-emerald leading-relaxed">Bagus! Ini adalah pembelian fungsional yang wajar. Namun, pendinginan 48 Jam tetap berjalan untuk menangkal efek hype sesaat.</p>
                  </div>
                )}
                {activeScan.answer90Days === 'Mungkin' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-2xl text-center">
                     <p className="text-sm font-bold text-yellow-500 leading-relaxed">Hati-hati, keraguan adalah musuh efisiensi. AI mendeteksi 60% probabilitas ini berakhir di gudang berdebu.</p>
                  </div>
                )}
                {activeScan.answer90Days === 'Tidak' && (
                  <div className="bg-neon-red/10 border border-neon-red/30 p-6 rounded-2xl text-center">
                     <p className="text-sm font-bold text-neon-red leading-relaxed">Terdeteksi Impulse Buy yang parah! Segera batalkan untuk menyelamatkan aset dan integritas finansialmu.</p>
                  </div>
                )}
              </motion.div>
           ) : (
                <>
                  <p className="text-2xl font-light text-center italic dark:text-white text-slate-800 leading-snug">"Apakah barang ini akan tetap berguna dalam <span className="font-bold text-neon-indigo">90 hari</span> ke depan?"</p>
                  <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: Icons.CheckCircle2, label: 'Pasti', color: 'hover:text-neon-emerald group-hover:bg-neon-emerald/10 text-neon-emerald', name: 'AFFIRM', val: 'Pasti' as const },
                        { icon: Icons.HelpCircle, label: 'Mungkin', color: 'hover:text-yellow-500 group-hover:bg-yellow-400/10 text-yellow-500', name: 'LATENT', val: 'Mungkin' as const },
                        { icon: Icons.XCircle, label: 'Tidak', color: 'hover:text-neon-red group-hover:bg-neon-red/10 text-neon-red', name: 'ABORT', val: 'Tidak' as const }
                      ].map(opt => (
                        <button key={opt.name} onClick={() => handleAnswer(opt.val)} className="group p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all">
                          <opt.icon size={26} className={`text-slate-500 transition-colors duration-300 ${opt.color.split(' ')[0]}`} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{opt.label}</span>
                        </button>
                      ))}
                  </div>
                </>
           )}
        </GlassCard>
      </section>

      <GlassCard className="mb-10 flex items-center gap-6 p-6 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/40">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0 shadow-2xl relative group">
          <div className="absolute inset-0 bg-neon-indigo/20 opacity-30"></div>
          <img 
            src={activeScan.fileUrl} 
            alt="Product" 
            className="w-full h-full object-cover grayscale opacity-60"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-black dark:text-white text-slate-800 italic tracking-tighter text-lg leading-none mb-2">{activeScan.name}</h4>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rp {(activeScan.price).toLocaleString('id-ID')}</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded bg-neon-red/10 border border-neon-red/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse"></div>
            <span className="text-[10px] font-black text-neon-red uppercase tracking-tighter italic">DITAHAN</span>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4 pb-12">
        <div className="bg-neon-emerald/5 border border-neon-emerald/20 rounded-2xl p-5 flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <Icons.Stars className="text-neon-emerald" size={24} />
          <p className="text-[10px] font-black text-neon-emerald uppercase tracking-[0.25em] italic leading-tight">BATAL = +100 SKOR INTEGRITAS</p>
        </div>
        <NeonButton 
          variant="danger" 
          icon={Icons.Trash2}
          onClick={handleAbort}
          className="py-5 h-auto text-xs uppercase tracking-[0.3em] font-black italic rounded-2xl"
        >
          BATALKAN PEMBELIAN
        </NeonButton>
        <button 
          onClick={() => setView('DASHBOARD')}
          className="w-full text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors duration-300 italic py-4"
        >
          KEMBALI KE BERANDA (TETAP TAHAN)
        </button>
      </div>
    </div>
  );
};
