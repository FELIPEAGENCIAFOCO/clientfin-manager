import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentUserId } from '@/integrations/supabase/client';

// Define types and interfaces
export interface Client {
  id: string;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company_name?: string;
  tax_id?: string;
  website?: string;
  notes?: string;
  user_id?: string;
}

export interface Payment {
  id?: string;
  created_at?: string;
  client_id: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  transaction_id?: string;
  notes?: string;
  user_id?: string;
}

export interface FinancialTransaction {
  id?: string;
  created_at?: string;
  client_id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  payment_method?: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  notes?: string;
  user_id?: string;
}

export interface Lead {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
  notes?: string;
  user_id?: string;
}

// Define the store's state
interface ClientState {
  clients: Client[];
  payments: Payment[];
  financialTransactions: FinancialTransaction[];
  leads: Lead[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  fetchClient: (id: string) => Promise<void>;
  createClient: (client: Omit<Client, 'id'>) => Promise<boolean>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
  setSelectedClient: (client: Client | null) => void;
  fetchPaymentsForClient: (clientId: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<boolean>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<boolean>;
  deletePayment: (id: string) => Promise<boolean>;
  fetchFinancialTransactionsForClient: (clientId: string) => Promise<void>;
  addFinancialTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => Promise<boolean>;
  updateFinancialTransaction: (id: string, updates: Partial<FinancialTransaction>) => Promise<boolean>;
  deleteFinancialTransaction: (id: string) => Promise<boolean>;
  fetchLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id'>) => Promise<boolean>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<boolean>;
  deleteLead: (id: string) => Promise<boolean>;
}

// Create the store
export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  payments: [],
  financialTransactions: [],
  leads: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  // Client-related methods
  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      set({ clients: data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao buscar clientes: ${error.message}`);
    }
  },
  fetchClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedClient: data || null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao buscar cliente: ${error.message}`);
    }
  },
  createClient: async (client) => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: userId }]);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Cliente criado com sucesso');
      await get().fetchClients(); // Refresh clients data
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao criar cliente: ${error.message}`);
      return false;
    }
  },
  updateClient: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Cliente atualizado com sucesso');
      await get().fetchClients(); // Refresh clients data
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao atualizar cliente: ${error.message}`);
      return false;
    }
  },
  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Cliente removido com sucesso');
      await get().fetchClients(); // Refresh clients data
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao remover cliente: ${error.message}`);
      return false;
    }
  },
  setSelectedClient: (client) => set({ selectedClient: client }),

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
      set({ payments: data || [], isLoading: false });
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
      await get().fetchPaymentsForClient(updates.client_id as string); // Refresh payments data
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
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Pagamento removido com sucesso');
      // Refresh payments data
      // Assuming you have access to the client_id associated with the payment
      // You might need to fetch the payment first to get the client_id
      // For now, let's assume you have a way to access it.
      await get().fetchPaymentsForClient("/* client_id */");
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao remover pagamento: ${error.message}`);
      return false;
    }
  },

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
      set({ financialTransactions: data || [], isLoading: false });
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
      await get().fetchFinancialTransactionsForClient(updates.client_id as string); // Refresh transactions data
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
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Transação financeira removida com sucesso');
      // Refresh transactions data
      // Assuming you have access to the client_id associated with the transaction
      // You might need to fetch the transaction first to get the client_id
      // For now, let's assume you have a way to access it.
      await get().fetchFinancialTransactionsForClient("/* client_id */");
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao remover transação financeira: ${error.message}`);
      return false;
    }
  },

  // Lead-related methods
  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      set({ leads: data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao buscar leads: ${error.message}`);
    }
  },
  addLead: async (lead) => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { error } = await supabase
        .from('leads')
        .insert([{ ...lead, user_id: userId }]);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Lead adicionado com sucesso');
      await get().fetchLeads(); // Refresh leads data
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao adicionar lead: ${error.message}`);
      return false;
    }
  },
  updateLead: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Lead atualizado com sucesso');
      await get().fetchLeads(); // Refresh leads data
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao atualizar lead: ${error.message}`);
      return false;
    }
  },
  deleteLead: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ isLoading: false });
      toast.success('Lead removido com sucesso');
      await get().fetchLeads(); // Refresh leads data
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(`Erro ao remover lead: ${error.message}`);
      return false;
    }
  },
}));
