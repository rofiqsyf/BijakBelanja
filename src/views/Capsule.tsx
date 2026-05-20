import React, { useState, useEffect } from 'react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext, Transaction } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const CapsuleItem = ({ tx }: { tx: Transaction }) => {
  const { updateTransaction } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editDuration, setEditDuration] = useState(48);
  const [editReason, setEditReason] = useState(tx.capsuleReason || '');

  useEffect(() => {
    if (!tx.capsuleEndTime) return;
    const update = () => {
      const remaining = Math.max(0, Math.floor((new Date(tx.capsuleEndTime!).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [tx.capsuleEndTime]);

  const handleSaveEdit = () => {
    const newEndTime = new Date(Date.now() + editDuration * 3600 * 1000).toISOString();
    updateTransaction(tx.id, { capsuleEndTime: newEndTime, capsuleReason: editReason });
    setIsEditing(false);
  };

  const handleAbort = () => {
    updateTransaction(tx.id, { status: 'BATAL' });
  };

  return (
    <GlassCard className="mb-6 space-y-6 shadow-2xl bg-white/70 dark:bg-black/20 p-6 md:p-8 relative">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 mx-auto md:mx-0 flex flex-col items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-white/5"></div>
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-0 rounded-full border-[6px] border-neon-purple border-t-transparent shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            />
            <div className="z-10 bg-white/80 dark:bg-black/40 backdrop-blur-2xl rounded-full w-24 h-24 md:w-36 md:h-36 flex flex-col items-center justify-center border border-slate-200 dark:border-white/10 shadow-inner">
               <span className="text-xl md:text-3xl font-black tabular-nums tracking-tighter dark:text-white text-slate-900 italic">{formatTime(timeLeft)}</span>
               <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 md:mt-3">Sisa Waktu</span>
            </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-xl">
                 {tx.image ? (
                    <img src={tx.image} alt="Product" className="w-full h-full object-cover grayscale opacity-70" />
                 ) : (
                    <Icons.ShoppingBag size={24} className="mx-auto mt-4 text-slate-400" />
                 )}
              </div>
              <div>
                <h4 className="font-black dark:text-white text-slate-800 italic tracking-tighter text-lg leading-none mb-1">{tx.name}</h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rp {(tx.amount).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Ubah Durasi (Jam Dihitung Ulang)</label>
                <select 
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                  className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-neon-purple transition-colors"
                >
                  <option value={24}>24 Jam (Penundaan Biasa)</option>
                  <option value={48}>48 Jam (Standar AI)</option>
                  <option value={168}>7 Hari (Impulse Kuat)</option>
                  <option value={720}>30 Hari (Makan Ruang)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Alasan</label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-neon-purple transition-colors"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 border border-slate-300 dark:border-white/10 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-white/5 transition-colors">Batal</button>
                <button onClick={handleSaveEdit} className="flex-1 py-2 bg-neon-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.4)]">Simpan</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10 relative group">
                <p className="text-xs font-bold text-slate-500 italic">"{tx.capsuleReason || 'Tidak ada alasan'}"</p>
                <button onClick={() => setIsEditing(true)} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg text-slate-400 hover:text-neon-purple dark:hover:text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icons.Edit2 size={12} />
                </button>
              </div>
              <div className="flex gap-3">
                <NeonButton 
                  variant="danger" 
                  onClick={handleAbort}
                  className="flex-1 py-3 text-[10px] uppercase tracking-widest font-black italic rounded-xl"
                >
                  BATAL BELI
                </NeonButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export const CapsuleView = () => {
  const { state, setView } = useAppContext();
  const [showAITip, setShowAITip] = useState(false);
  
  const vaultedItems = state.transactions.filter(t => t.status === 'VAULTED').sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const emptyState = (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Kapsul Waktu" showBack backTo="DASHBOARD" />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20">
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
          <Icons.TimerReset size={48} />
        </div>
        <h2 className="text-2xl font-black italic text-slate-800 dark:text-white mb-2">Semua Kosong</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-xs">Tidak ada barang yang sedang dalam masa penundaan. Pengeluaranmu terkendali.</p>
      </div>
    </div>
  );

  if (vaultedItems.length === 0) return emptyState;

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto relative">
      <Header title="Kapsul Waktu" showBack backTo="DASHBOARD" />

      <section className="mb-8 mt-4 flex justify-between items-end">
        <div>
           <h2 className="text-4xl md:text-5xl font-black dark:text-white text-slate-800 italic tracking-tighter leading-none">Status Penundaan</h2>
           <p className="text-[10px] md:text-xs font-black text-neon-purple uppercase tracking-[0.3em] mt-3 italic drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">{vaultedItems.length} Siklus Aktif</p>
        </div>
        <div className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-neon-purple/10 text-neon-purple border-slate-200 dark:border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0">
           <Icons.Timer size={28} />
        </div>
      </section>

      <div className="space-y-6">
        <AnimatePresence>
          {vaultedItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <CapsuleItem tx={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-8 text-center bg-neon-emerald/5 border border-neon-emerald/20 rounded-2xl p-5 flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <Icons.ShieldCheck className="text-neon-emerald" size={24} />
        <p className="text-[10px] md:text-xs font-black text-neon-emerald uppercase tracking-[0.25em] italic leading-tight">Membatalkan Impulse = +100 SKOR INTEGRITAS</p>
      </div>

      {/* Floating AI Tip Button */}
      <div className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-4 pointer-events-none">
        <AnimatePresence>
          {showAITip && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="bg-slate-900 dark:bg-black border border-neon-indigo/50 p-4 rounded-2xl shadow-2xl max-w-[200px] md:max-w-xs pointer-events-auto"
            >
              <p className="text-xs text-white leading-relaxed">
                <span className="font-bold text-neon-emerald inline-block mb-1">Renungkan kembali:</span><br/>
                Apakah barang ini menyelesaikan masalah nyata? Ataukah hanya rasa penasaran sementara? Tunggu minimal 24 jam. Jika rasa menggebu itu hilang, batalkan!
              </p>
              <button 
                onClick={() => setShowAITip(false)}
                className="mt-3 w-full border border-slate-700 bg-slate-800 text-slate-300 rounded-lg py-1.5 text-[10px] uppercase tracking-widest font-bold"
              >
                Paham
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setShowAITip(prev => !prev)}
          className="w-14 h-14 bg-neon-indigo text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-bounce pointer-events-auto border-2 border-indigo-300"
        >
          <Icons.Bot size={24} />
        </button>
      </div>
    </div>
  );
};
