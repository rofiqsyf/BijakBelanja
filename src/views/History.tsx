import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Header, GlassCard, NeonButton } from '../components/ui';
import { useAppContext, Transaction } from '../store/AppContext';

export const HistoryView = () => {
  const { state, setView, bulkDeleteTransactions, bulkUpdateTransactions, bulkAddTransactions, updateTransaction } = useAppContext();
  const { transactions } = state;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('DATE_DESC');
  const [showFilters, setShowFilters] = useState(false);

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredTransactions.length && filteredTransactions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTransactions.map(t => t.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await bulkDeleteTransactions(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkSave = async () => {
    if (selectedIds.size === 0) return;
    await bulkUpdateTransactions(Array.from(selectedIds), { status: 'SAVED' });
    setSelectedIds(new Set());
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') return;
      
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) return; // Need header and at least one row
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const newTxs: Omit<Transaction, 'id' | 'date'>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const tx: any = { status: 'SPENT', type: 'WANT', amount: 0, name: 'Imported Item' };
        
        headers.forEach((header, index) => {
          if (header === 'name') tx.name = values[index];
          if (header === 'amount') tx.amount = Number(values[index]) || 0;
          if (header === 'type') {
            const val = values[index].toUpperCase();
            tx.type = (val === 'WANT' || val === 'NEED') ? val : 'WANT';
          }
          if (header === 'status') {
             const val = values[index].toUpperCase();
             const validStatuses = ['SPENT', 'SAVED', 'VAULTED', 'DICHECKOUT', 'BATAL', 'DISIMPAN'];
             tx.status = validStatuses.includes(val) ? val : 'SPENT';
          }
        });
        newTxs.push(tx);
      }
      
      if (newTxs.length > 0) {
        await bulkAddTransactions(newTxs);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const filteredForTypes = transactions.filter(t => filterStatus === 'ALL' || t.status === filterStatus);
  const availableTypes = Array.from(new Set(filteredForTypes.map(t => t.type)));

  const filteredForStatuses = transactions.filter(t => filterType === 'ALL' || t.type === filterType);
  const availableStatuses = Array.from(new Set(filteredForStatuses.map(t => t.status)));

  const filteredTransactions = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .filter(t => filterStatus === 'ALL' || t.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'DATE_DESC') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'DATE_ASC') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'AMOUNT_DESC') return b.amount - a.amount;
      if (sortBy === 'AMOUNT_ASC') return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-40 max-w-md md:max-w-6xl mx-auto">
      <Header title="Riwayat Pindai" showBack backTo="DASHBOARD" />

      <section className="mb-6 mt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-indigo/10 text-neon-indigo">
              <Icons.List size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xl dark:text-white text-slate-800 tracking-tight">Semua Transaksi</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{filteredTransactions.length} Item Ditampilkan</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div>
              <label 
                htmlFor="csv-import"
                className="p-2 h-full rounded-xl border flex items-center justify-center transition-colors cursor-pointer bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-neon-emerald/50 hover:text-neon-emerald"
                title="Import CSV"
              >
                <Icons.Upload size={18} />
              </label>
              <input 
                id="csv-import"
                type="file" 
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border flex items-center justify-center transition-colors ${showFilters ? 'bg-neon-indigo/10 text-neon-indigo border-neon-indigo/30' : 'bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-neon-indigo/50 hover:text-neon-indigo'}`}
            >
              <Icons.Filter size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <GlassCard className="p-4 space-y-4 bg-white/40 dark:bg-black/20 border border-slate-200 dark:border-white/10 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Tipe</label>
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-neon-indigo transition-colors"
                    >
                      <option value="ALL">Semua Tipe</option>
                      {availableTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Status</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-neon-indigo transition-colors"
                    >
                      <option value="ALL">Semua Status</option>
                      {availableStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Urutkan</label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-neon-indigo transition-colors"
                    >
                      <option value="DATE_DESC">Tanggal (Terbaru)</option>
                      <option value="DATE_ASC">Tanggal (Terlama)</option>
                      <option value="AMOUNT_DESC">Harga (Tertinggi)</option>
                      <option value="AMOUNT_ASC">Harga (Terendah)</option>
                    </select>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
        
        {filteredTransactions.length > 0 && (
          <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/10 mb-6 w-full max-w-fit">
             <button onClick={selectAll} className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 px-3 hover:text-neon-indigo transition-colors flex items-center gap-2">
               {selectedIds.size === filteredTransactions.length ? <Icons.CheckSquare size={14} /> : <Icons.Square size={14} />}
                 Pilih Semua
               </button>
               {selectedIds.size > 0 && (
                 <div className="flex items-center gap-2 pl-3 border-l border-slate-300 dark:border-white/10">
                   <button onClick={handleBulkSave} className="flex items-center justify-center p-2 rounded-xl bg-neon-emerald/10 text-neon-emerald hover:bg-neon-emerald/20 transition-colors" title="Tandai Tersimpan">
                     <Icons.Bookmark size={16} />
                   </button>
                   <button onClick={handleBulkDelete} className="flex items-center justify-center p-2 rounded-xl bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-colors" title="Hapus">
                     <Icons.Trash2 size={16} />
                   </button>
                 </div>
               )}
          </div>
        )}
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center p-12 text-slate-500 border border-dashed border-slate-300 dark:border-white/10 rounded-3xl text-sm font-bold bg-white/30 dark:bg-black/10"
              >
                <Icons.ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                Belum ada riwayat pindai barang. Pindai keranjangmu sekarang!
              </motion.div>
            ) : (
              filteredTransactions.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                  layout
                >
                  <GlassCard 
                    className={`flex items-center gap-4 p-4 transition-all ${
                      selectedIds.has(item.id) 
                        ? 'bg-neon-indigo/10 border border-neon-indigo/30 dark:bg-neon-indigo/20' 
                        : 'bg-white/40 dark:bg-black/20 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(item.id);
                      }}
                      className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors shrink-0 ${
                      selectedIds.has(item.id) 
                        ? 'border-neon-indigo bg-neon-indigo text-white' 
                        : 'border-slate-300 dark:border-white/30'
                    }`}>
                      {selectedIds.has(item.id) && <Icons.Check size={14} strokeWidth={3} />}
                    </button>

                    <div 
                      className="flex-1 flex justify-between items-center overflow-hidden cursor-pointer"
                      onClick={() => setSelectedTransaction(item)}
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center text-slate-500 shadow-inner shrink-0">
                          {item.image ? (
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                             <Icons.ShoppingBag size={20} />
                          )}
                        </div>

                        <div className="min-w-0 pr-4">
                          <h4 className="font-bold dark:text-white text-slate-800 text-sm truncate">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.type === 'WANT' ? 'text-neon-red' : 'text-neon-emerald'}`}>{item.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-sm dark:text-white text-slate-800">{formatIDR(item.amount)}</p>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block ${
                          item.status === 'BATAL' ? 'bg-neon-red/20 text-neon-red' : (['DISIMPAN', 'SAVED'].includes(item.status) ? 'bg-neon-emerald/20 text-neon-emerald' : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400')
                        }`}>
                          {item.status === 'BATAL' ? 'Gagal Dibeli' : item.status}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <GlassCard className="p-6 relative">
                <button onClick={() => setSelectedTransaction(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <Icons.X size={20} />
                </button>
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center text-slate-500 shadow-inner mb-4">
                   {selectedTransaction.image ? (
                      <img src={selectedTransaction.image} alt={selectedTransaction.name} className="w-full h-full object-cover" />
                   ) : (
                      <Icons.ShoppingBag size={28} />
                   )}
                </div>
                <h2 className="text-xl font-bold dark:text-white text-slate-800 mb-1">{selectedTransaction.name}</h2>
                <div className="text-2xl font-black text-neon-indigo mb-4">{formatIDR(selectedTransaction.amount)}</div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      selectedTransaction.status === 'BATAL' ? 'bg-neon-red/20 text-neon-red' : (['DISIMPAN', 'SAVED'].includes(selectedTransaction.status) ? 'bg-neon-emerald/20 text-neon-emerald' : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400')
                    }`}>
                      {selectedTransaction.status === 'BATAL' ? 'Gagal Dibeli' : selectedTransaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipe</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTransaction.type === 'WANT' ? 'text-neon-red' : 'text-neon-emerald'}`}>{selectedTransaction.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tanggal</span>
                    <span className="text-xs font-bold dark:text-white text-slate-800">{new Date(selectedTransaction.date).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 text-center">Ubah Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => {
                        updateTransaction(selectedTransaction.id, { status: 'SAVED' });
                        setSelectedTransaction({ ...selectedTransaction, status: 'SAVED' });
                      }}
                      className="py-2 text-[10px] uppercase font-bold tracking-widest rounded-xl bg-neon-emerald/10 text-neon-emerald hover:bg-neon-emerald/20 transition-colors"
                    >
                      SAVED
                    </button>
                    <button 
                      onClick={() => {
                        updateTransaction(selectedTransaction.id, { status: 'VAULTED' });
                        setSelectedTransaction({ ...selectedTransaction, status: 'VAULTED' });
                      }}
                      className="py-2 text-[10px] uppercase font-bold tracking-widest rounded-xl bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20 transition-colors"
                    >
                      VAULTED
                    </button>
                    <button 
                      onClick={() => {
                        updateTransaction(selectedTransaction.id, { status: 'BATAL' });
                        setSelectedTransaction({ ...selectedTransaction, status: 'BATAL' });
                      }}
                      className="py-2 text-[10px] uppercase font-bold tracking-widest rounded-xl bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-colors"
                    >
                      BATAL
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
