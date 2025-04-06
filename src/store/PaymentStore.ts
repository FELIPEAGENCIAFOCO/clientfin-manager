
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentUserId } from '@/integrations/supabase/auth';
import { Payment, LoadingState } from './types/StoreTypes';

interface PaymentState extends LoadingState {
  payments: Payment[];
  fetchPaymentsForClient: (clientId: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<boolean>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<boolean>;
  deletePayment: (id: string) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,

  // Payment-related methods
  fetchPaymentsForClient: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', clientId)
        .eq('user_id', userId);

      if (error) throw error;
      // Add type assertion to ensure the payment status is of the correct type
      const typedPayments = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'paid' | 'overdue',
        method: item.method as 'credit_card' | 'bank_transfer' | 'cash' | 'other'
      }));
      
      set({ payments: typedPayments, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao buscar pagamentos: ${error.message}`);
    }
  },

  // Add payment
  addPayment: async (payment) => {
    try {
      const userId = await getCurrentUserId();
      
      const { error } = await supabase
        .from('payments')
        .insert({
          client_id: payment.client_id,
          amount: payment.amount,
          due_date: payment.due_date,
          status: payment.status,
          method: payment.method,
          user_id: userId
        });

      if (error) throw error;
      
      toast.success('Pagamento adicionado com sucesso');
      
      // Refresh payments data
      await get().fetchPaymentsForClient(payment.client_id);
      
      return true;
    } catch (error: any) {
      toast.error(`Erro ao adicionar pagamento: ${error.message}`);
      return false;
    }
  },

  updatePayment: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Pagamento atualizado com sucesso');
      
      if (updates.client_id) {
        await get().fetchPaymentsForClient(updates.client_id as string);
      }
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao atualizar pagamento: ${error.message}`);
      return false;
    }
  },
  
  deletePayment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // First, get the payment to know its client_id
      const { data: payment } = await supabase
        .from('payments')
        .select('client_id')
        .eq('id', id)
        .single();
      
      const clientId = payment?.client_id;
      
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Pagamento removido com sucesso');
      
      // Refresh payments data using the clientId we got earlier
      if (clientId) {
        await get().fetchPaymentsForClient(clientId);
      }
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao remover pagamento: ${error.message}`);
      return false;
    }
  },
}));
