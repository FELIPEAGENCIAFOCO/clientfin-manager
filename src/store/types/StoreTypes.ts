
import { supabase } from '@/integrations/supabase/client';

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

// Common type for loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
