
// FIX: Import React to use React types like ElementType.
import React from 'react';

export enum StaffStatus {
  ACTIVE = 'Ativo',
  ON_VACATION = 'Férias',
  INACTIVE = 'Inativo',
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  cnpj?: string;
  stateRegistration?: string;
  email?: string;
  responsible?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'therapist';
}

export interface StaffMember {
  id: string;
  branchId: string;
  name: string;
  role: string;
  email: string;
  secondaryEmail?: string; // Campo de email configurável adicional
  phone?: string;
  status: StaffStatus;
  avatarUrl?: string;
  specialty?: string;
  bankInfo?: string;
  documents?: { name: string; url: string }[];
  contractUrl?: string;
  admissionDate?: string; // Data de admissão
  terminationDate?: string; // Data de desligamento (opcional)
}

export type FinancialCategory = 
  | 'RECEITA_ATENDIMENTO' 
  | 'RECEITA_CURSO' 
  | 'RECEITA_KIT' 
  | 'CUSTO_FIXO' 
  | 'CUSTO_VARIAVEL' 
  | 'INVESTIMENTO' 
  | 'CAPITAL_GIRO';

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number; // Gross Value
  taxPercentage?: number; // Taxa descontada
  type: 'revenue' | 'expense';
  category: FinancialCategory; 
  branchId: string; 
  studentId?: string; // Link to student if applicable
  
  // Novos campos para Relatórios
  status?: 'paid' | 'pending'; // Pago ou Pendente (A Pagar/A Receber)
  nfeNumber?: string; // Número da Nota Fiscal (se emitida)
  dueDate?: string; // Data de Vencimento (para previsibilidade)
}

export interface Appointment {
  id: string;
  branchId: string;
  dateTime: string;
  studentName: string;
  therapistId: string | null;
  therapistName: string | null;
  service: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'pending_acceptance';
  notes?: string;
  // Cancellation details
  cancellationReason?: string;
  cancelledBy?: 'student' | 'therapist' | 'admin';
  // Reminder status
  reminderSent?: boolean;
}

export type PaymentMethod = 'PIX' | 'DEBITO' | 'CREDITO_RECORRENTE' | 'FIDELIDADE_TRIMESTRAL' | 'FIDELIDADE_SEMESTRAL' | 'FIDELIDADE_ANUAL';

export interface Student {
  id:string;
  branchId: string;
  name: string;
  therapistId: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  status: 'active' | 'inactive';
  lastActivityDate?: string;
  wantsMonthlyNFe?: boolean;
  rg?: string;
  cpf?: string;
  address?: string; // Street, number, complement
  neighborhood?: string;
  city?: string;
  postalCode?: string; // CEP
  assessments?: InitialAssessment[];
  invoices?: StudentInvoice[];
  
  // New Plan Fields
  sessionsPerMonth?: 4 | 8 | 12 | 16 | 20;
  monthlyValue?: number;
  paymentMethod?: PaymentMethod;
  taxPercentage?: number;
  planObservations?: string;
}

export interface StudentActivityLog {
    id: string;
    studentId: string;
    date: string;
    description: string;
    therapistId: string;
}

export interface StudentMedia {
    id: string;
    studentId: string;
    uploadDate: string;
    url: string;
    type: 'video' | 'image' | 'document';
    description: string;
    therapistId: string;
}


export interface InitialAssessment {
  id: string;
  studentId: string; // Temporary ID until student is fully registered
  studentName: string;
  guardianEmail?: string;
  guardianPhone?: string;
  branchId: string;
  dateTime: string;
  therapistId: string;
  status: 'scheduled' | 'completed';
  notes?: string;
}

export interface StudentInvoice {
  id: string;
  studentId: string;
  branchId: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paymentLink?: string;
  receiptUrl?: string;
}

export interface TherapistPayment {
  id: string;
  therapistId: string;
  branchId: string;
  therapistName: string;
  period: string; // e.g., "2024-07"
  sessionsConducted: number;
  amount: number;
  status: 'pending' | 'paid';
  invoiceUrl?: string; // therapist's invoice
}

export interface ExternalActivity {
  id: string;
  name: string;
  date: string;
  revenue: number;
  expenses: number;
  description?: string;
}

export interface NavItemType {
  path?: string; // Optional for parent items
  label: string;
  icon: React.ElementType; // For SVG components
  children?: NavItemType[];
}
