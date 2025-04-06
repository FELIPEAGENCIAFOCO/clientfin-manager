
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentUserId } from '@/integrations/supabase/auth';
import { Client, LoadingState } from './types/StoreTypes';
import { usePaymentStore } from './PaymentStore';
import { useFinancialTransactionStore } from './FinancialTransactionStore';

// Define the store's state
interface ClientState extends LoadingState {
  clients: Client[];
  selectedClient: Client | null;
  fetchClients: () => Promise<void>;
  fetchClient: (id: string) => Promise<void>;
  createClient: (client: Omit<Client, 'id'>) => Promise<boolean>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
  setSelectedClient: (client: Client | null) => void;
}

// Create the store
export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
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
}));
