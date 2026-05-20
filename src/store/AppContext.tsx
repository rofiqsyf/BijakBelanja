import React, { createContext, useContext, useState, useEffect } from "react";

export type AppView = 'LOGIN' | 'REGISTER' | 'ONBOARDING' | 'DASHBOARD' | 'SCAN' | 'ANALYSIS' | 'CAPSULE' | 'VAULT' | 'PROFILE' | 'AILOG' | 'HISTORY';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'WANT' | 'NEED';
  status: 'SPENT' | 'SAVED' | 'VAULTED' | 'DICHECKOUT' | 'BATAL' | 'DISIMPAN';
  date: string;
  image?: string;
  capsuleEndTime?: string;
  capsuleReason?: string;
}

export interface Settings {
  name: string;
  email: string;
  income: number;
  savings: number;
  expenses: number;
  bills: number;
  darkMode: boolean;
  theme?: 'default' | 'cyberpunk' | 'minimalist';
  securityLevel?: number;
  neuralPreference?: 'Biasa' | 'Sarkastis' | 'Kejam' | 'Supportif';
  profilePic: string;
  targetName: string;
  targetPrice: number;
  scanDates?: string[];
}

interface AppState {
  transactions: Transaction[];
  settings: Settings;
  activeScan: { fileUrl: string; name: string; price: number; regretScore: number; answer90Days?: 'Pasti' | 'Mungkin' | 'Tidak' | null; capsuleDuration?: number; capsuleReason?: string; } | null;
}

interface AppContextType {
  state: AppState;
  view: AppView;
  setView: (v: AppView) => void;
  updateSettings: (s: Partial<Settings>) => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  bulkDeleteTransactions: (ids: string[]) => Promise<void>;
  bulkUpdateTransactions: (ids: string[], t: Partial<Transaction>) => Promise<void>;
  bulkAddTransactions: (txs: Omit<Transaction, 'id' | 'date'>[]) => Promise<void>;
  setActiveScan: (scan: AppState['activeScan']) => void;
  resetApp: () => void;
  isLoading: boolean;
}

const defaultSettings: Settings = {
  name: '',
  email: '',
  income: 0,
  savings: 0,
  expenses: 0,
  bills: 0,
  darkMode: true,
  profilePic: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Lucky',
  targetName: '',
  targetPrice: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    transactions: [],
    settings: defaultSettings,
    activeScan: null
  });
  const [view, setViewState] = useState<AppView>('LOGIN');
  const [isLoading, setIsLoading] = useState(true);

  // Sync dark mode class
  useEffect(() => {
    // Apply styling to root element
    if (state.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply theme
    document.documentElement.classList.remove('theme-cyberpunk', 'theme-minimalist');
    if (state.settings.theme === 'cyberpunk') document.documentElement.classList.add('theme-cyberpunk');
    if (state.settings.theme === 'minimalist') document.documentElement.classList.add('theme-minimalist');
  }, [state.settings.darkMode, state.settings.theme]);

  const loadData = async () => {
    try {
      const resetData = { users: [], transactions: [], settings: {} };
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      });
      setState(prev => ({
        ...prev,
        transactions: [],
        settings: defaultSettings,
        activeScan: null
      }));
      setViewState('LOGIN');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const setView = (v: AppView) => {
    setViewState(v);
    window.scrollTo(0, 0);
  };

  const updateSettings = async (s: Partial<Settings>) => {
    const newSettings = { ...state.settings, ...s };
    setState(prev => ({ ...prev, settings: newSettings }));
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...t,
      id: Math.random().toString(36).substring(7),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    };
    const newTxList = [newTx, ...state.transactions];
    setState(prev => ({ ...prev, transactions: newTxList }));
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(tx => tx.id === id ? { ...tx, ...updates } : tx)
    }));
    try {
      await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTransaction = async (id: string) => {
    const newTxList = state.transactions.filter(x => x.id !== id);
    setState(prev => ({ ...prev, transactions: newTxList }));
    try {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const bulkDeleteTransactions = async (ids: string[]) => {
    const newTxList = state.transactions.filter(x => !ids.includes(x.id));
    setState(prev => ({ ...prev, transactions: newTxList }));
    try {
      // In a real app we'd probably have a bulk api or Promise.all
      await Promise.all(ids.map(id => fetch(`/api/transactions/${id}`, { method: 'DELETE' })));
    } catch (e) {
      console.error(e);
    }
  };

  const bulkUpdateTransactions = async (ids: string[], updates: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(tx => ids.includes(tx.id) ? { ...tx, ...updates } : tx)
    }));
    try {
      await Promise.all(ids.map(id => fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const bulkAddTransactions = async (txs: Omit<Transaction, 'id' | 'date'>[]) => {
    const newTxs: Transaction[] = txs.map(tx => ({
      ...tx,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    }));
    
    setState(prev => ({
      ...prev,
      transactions: [...newTxs, ...prev.transactions]
    }));
    
    try {
      await fetch('/api/transactions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTxs)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const setActiveScan = (scan: AppState['activeScan']) => {
    setState(prev => ({ ...prev, activeScan: scan }));
  };

  const resetApp = async () => {
    setState({ transactions: [], settings: defaultSettings, activeScan: null });
    setView('LOGIN');
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultSettings)
      });
      // optionally clear transactions on backend too, or just mock it here
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider value={{ state, view, setView, updateSettings, addTransaction, updateTransaction, deleteTransaction, bulkDeleteTransactions, bulkUpdateTransactions, bulkAddTransactions, setActiveScan, resetApp, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
