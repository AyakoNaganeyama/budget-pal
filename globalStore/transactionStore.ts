// transactionStore.ts
import { create } from "zustand";

export interface Transaction {
  id: string;
  amount: number;
  category_id?: { name: string }[];
  date: string;
  description?: string;
}

interface TransactionStore {
  transactions: Transaction[];
  setTransactions: (data: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (data) => set({ transactions: data || [] }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  clearTransactions: () => set({ transactions: [] }),
}));
