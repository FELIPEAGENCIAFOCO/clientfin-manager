
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getCurrentUserId } from '@/integrations/supabase/auth';
import { Lead, LoadingState } from './types/StoreTypes';

interface LeadState extends LoadingState {
  leads: Lead[];
  fetchLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id'>) => Promise<boolean>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<boolean>;
  deleteLead: (id: string) => Promise<boolean>;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  isLoading: false,
  error: null,

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
      // Add type assertion for lead status
      const typedLeads = (data || []).map(item => ({
        ...item,
        status: item.status as 'new' | 'contacted' | 'qualified' | 'lost' | 'converted'
      }));
      
      set({ leads: typedLeads, isLoading: false });
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
