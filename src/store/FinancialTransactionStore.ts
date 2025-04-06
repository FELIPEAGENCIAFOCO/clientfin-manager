
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentUserId } from '@/integrations/supabase/auth';
import { FinancialTransaction, LoadingState } from './types/StoreTypes';

interface FinancialTransactionState extends LoadingState {
  financialTransactions: FinancialTransaction[];
  fetchFinancialTransactionsForClient: (clientId: string) => Promise<void>;
  addFinancialTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => Promise<boolean>;
  updateFinancialTransaction: (id: string, updates: Partial<FinancialTransaction>) => Promise<boolean>;
  deleteFinancialTransaction: (id: string) => Promise<boolean>;
}

export const useFinancialTransactionStore = create<FinancialTransactionState>((set, get) => ({
  financialTransactions: [],
  isLoading: false,
  error: null,

  // Financial transaction methods
  fetchFinancialTransactionsForClient: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('client_id', clientId)
        .eq('user_id', userId);

      if (error) throw error;
      // Add type assertion to ensure transaction type is correct
      const typedTransactions = (data || []).map(item => ({
        ...item,
        type: item.type as 'income' | 'expense',
        payment_method: item.payment_method as 'credit_card' | 'bank_transfer' | 'cash' | 'other' | undefined
      }));
      
      set({ financialTransactions: typedTransactions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao buscar transações financeiras: ${error.message}`);
    }
  },
  
  addFinancialTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { error } = await supabase
        .from('financial_transactions')
        .insert([{ ...transaction, user_id: userId }]);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Transação financeira adicionada com sucesso');
      await get().fetchFinancialTransactionsForClient(transaction.client_id); // Refresh transactions data
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao adicionar transação financeira: ${error.message}`);
      return false;
    }
  },
  
  updateFinancialTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Transação financeira atualizada com sucesso');
      
      if (updates.client_id) {
        await get().fetchFinancialTransactionsForClient(updates.client_id as string);
      }
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao atualizar transação financeira: ${error.message}`);
      return false;
    }
  },
  
  deleteFinancialTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // First, get the transaction to know its client_id
      const { data: transaction } = await supabase
        .from('financial_transactions')
        .select('client_id')
        .eq('id', id)
        .single();
      
      const clientId = transaction?.client_id;
      
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Transação financeira removida com sucesso');
      
      // Refresh transactions data using the clientId we got earlier
      if (clientId) {
        await get().fetchFinancialTransactionsForClient(clientId);
      }
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao remover transação financeira: ${error.message}`);
      return false;
    }
  },
}));
