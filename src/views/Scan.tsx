import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext } from '../store/AppContext';

export const ScanView = () => {
  const { setView, setActiveScan, state, addTransaction } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string; price: string; isAnalyzing: boolean } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // Simulate AI loading then prepopulating
      setSelectedImage({ url, name: '', price: '', isAnalyzing: true });
      setTimeout(() => {
        setSelectedImage(prev => prev ? { 
          ...prev, 
          isAnalyzing: false, 
          name: 'Produk Terdeteksi (Edit jika salah)', 
          price: (Math.floor(Math.random() * 5000000) + 100000).toString() 
        } : null);
      }, 1500);
    }
  };

  const handleProceed = async () => {
    if (!selectedImage) return;
    const priceNum = parseInt(selectedImage.price.replace(/\D/g, ''), 10) || 0;
    
    const totalSpent = state.transactions.filter(t => t.status === 'SPENT').reduce((acc, t) => acc + t.amount, 0);
    const totalSisa = state.settings.income - state.settings.expenses - state.settings.bills - totalSpent;
    
    let regretScore = 0;
    if (priceNum >= totalSisa) {
      regretScore = 70 + Math.floor(Math.random() * 30); // 70-100 (Red)
    } else if (priceNum >= totalSisa * 0.5) {
      regretScore = 50 + Math.floor(Math.random() * 19); // 50-69 (Yellow)
    } else {
      regretScore = 10 + Math.floor(Math.random() * 39); // 10-49 (Green)
    }

    setActiveScan({
      fileUrl: selectedImage.url,
      name: selectedImage.name,
      price: priceNum,
      regretScore: regretScore
    });
    setView('ANALYSIS');
  };

  const formatIDR = (val: string) => val ? 'Rp ' + parseInt(val.replace(/\D/g, '') || '0', 10).toLocaleString('id-ID') : '';

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Pindai" />
      
      {!selectedImage ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
          <section className="mb-8 mt-4 flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-indigo-100 dark:bg-neon-indigo/10 text-neon-indigo shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Icons.Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white tracking-tight text-slate-800">AI Interogator Pembelian</h2>
          </section>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-h-[300px] flex flex-col"
          >
            <div className="flex-1 glass-card border-dashed border-2 dark:border-white/10 border-slate-300 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center gap-8 cursor-pointer hover:bg-slate-50 dark:hover:bg-neon-indigo/5 hover:border-neon-indigo/30 transition-all group relative overflow-hidden bg-white/50 dark:bg-black/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-24 h-24 rounded-3xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-neon-indigo border dark:border-white/10 border-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                <Icons.UploadCloud size={48} />
              </div>
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-black dark:text-white text-slate-800 italic">Unggah Bukti</h3>
                <p className="text-slate-500 text-sm px-6 font-medium leading-relaxed uppercase tracking-widest">Kirim screenshot keranjang untuk analisis mendalam oleh neural network.</p>
              </div>
              <div className="mt-8 flex flex-col items-center gap-3">
                 <div className="flex gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-neon-red shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                    <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(168,85,247,0.4)]"></div>
                    <div className="w-2 h-2 rounded-full bg-neon-indigo shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.4em]">Sinkronisasi Instan</p>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <GlassCard onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 p-5 hover:border-slate-300 dark:hover:border-white/10 transition-all cursor-pointer">
                <Icons.Camera size={22} className="text-neon-indigo" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Pindai Optik</span>
             </GlassCard>
             <GlassCard onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 p-5 hover:border-slate-300 dark:hover:border-white/10 transition-all cursor-pointer">
                <Icons.FileText size={22} className="text-neon-purple" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Berkas Data</span>
             </GlassCard>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col pt-4 max-w-md mx-auto w-full">
          <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-white/5 relative mb-6 relative">
            <img src={selectedImage.url} alt="Scanned" className="w-full h-full object-cover" />
            
            {selectedImage.isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
                <Icons.Sparkles className="animate-pulse mb-4 text-neon-emerald" size={48} />
                <h3 className="font-black text-xl italic tracking-widest uppercase text-neon-emerald">AI Sedang Mendeteksi</h3>
                <p className="text-sm mt-2 font-medium opacity-80">Menganalisis objek dan harga...</p>
              </div>
            )}
            
            {!selectedImage.isAnalyzing && (
              <div className="absolute top-4 right-4 bg-neon-emerald text-black py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                <Icons.ScanLine size={14} /> Terdeteksi
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {!selectedImage.isAnalyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Barang</label>
                  <input type="text" value={selectedImage.name} onChange={e => setSelectedImage({...selectedImage, name: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mt-1 font-bold text-slate-800 dark:text-white outline-none focus:border-neon-indigo transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Harga</label>
                  <input type="text" value={formatIDR(selectedImage.price)} onChange={e => setSelectedImage({...selectedImage, price: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mt-1 font-bold text-slate-800 dark:text-white outline-none focus:border-neon-indigo transition-colors text-xl font-black tabular-nums" />
                </div>
                
                <div className="flex gap-3 pt-6">
                  <NeonButton variant="outline" className="flex-1" onClick={() => setSelectedImage(null)}>Batal</NeonButton>
                  <NeonButton className="flex-1" onClick={handleProceed} disabled={!selectedImage.name || !selectedImage.price}>Mulai Analisis</NeonButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />
    </div>
  );
};
