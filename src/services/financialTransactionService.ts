import { FinancialTransaction, FinancialCategory } from '../types';
import apiClient from './apiClient';

type ApiTransactionType = 'REVENUE' | 'EXPENSE';
type ApiTransactionStatus = 'PAID' | 'PENDING';

interface FinancialTransactionApiResponse {
  id: string;
  branchId: string;
  studentId?: string | null;
  date: string;
  description: string;
  amount: number;
  taxPercentage?: number | null;
  type: ApiTransactionType;
  category: FinancialCategory;
  status: ApiTransactionStatus;
  nfeNumber?: string | null;
  dueDate?: string | null;
}

interface FinancialTransactionFilters {
  branchId?: string;
}

type FinancialTransactionPayload = Partial<FinancialTransaction> &
  Pick<FinancialTransaction, 'branchId' | 'date' | 'description' | 'amount' | 'type' | 'category'>;

const apiToUiType: Record<ApiTransactionType, FinancialTransaction['type']> = {
  REVENUE: 'revenue',
  EXPENSE: 'expense',
};

const uiToApiType: Record<FinancialTransaction['type'], ApiTransactionType> = {
  revenue: 'REVENUE',
  expense: 'EXPENSE',
};

const apiToUiStatus: Record<ApiTransactionStatus, NonNullable<FinancialTransaction['status']>> = {
  PAID: 'paid',
  PENDING: 'pending',
};

const uiToApiStatus: Record<NonNullable<FinancialTransaction['status']>, ApiTransactionStatus> = {
  paid: 'PAID',
  pending: 'PENDING',
};

const cleanString = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const toDateInput = (value?: string | null) => {
  if (!value) return undefined;
  return value.split('T')[0];
};

const mapTransactionFromApi = (transaction: FinancialTransactionApiResponse): FinancialTransaction => ({
  id: transaction.id,
  branchId: transaction.branchId,
  studentId: transaction.studentId ?? undefined,
  date: toDateInput(transaction.date) || transaction.date,
  description: transaction.description,
  amount: transaction.amount,
  taxPercentage: transaction.taxPercentage ?? undefined,
  type: apiToUiType[transaction.type],
  category: transaction.category,
  status: apiToUiStatus[transaction.status],
  nfeNumber: cleanString(transaction.nfeNumber),
  dueDate: toDateInput(transaction.dueDate),
});

const mapTransactionToApi = (transaction: FinancialTransactionPayload) => ({
  branchId: transaction.branchId,
  studentId: transaction.studentId || undefined,
  date: transaction.date,
  description: transaction.description.trim(),
  amount: transaction.amount,
  taxPercentage: transaction.taxPercentage ?? undefined,
  type: uiToApiType[transaction.type],
  category: transaction.category,
  status: transaction.status ? uiToApiStatus[transaction.status] : undefined,
  nfeNumber: cleanString(transaction.nfeNumber),
  dueDate: transaction.dueDate || undefined,
});

class FinancialTransactionService {
  async getAll(filters: FinancialTransactionFilters = {}): Promise<FinancialTransaction[]> {
    const response = await apiClient.get<FinancialTransactionApiResponse[]>('/financial-transactions', { params: filters });
    return response.data.map(mapTransactionFromApi);
  }

  async create(data: FinancialTransactionPayload): Promise<FinancialTransaction> {
    const response = await apiClient.post<FinancialTransactionApiResponse>('/financial-transactions', mapTransactionToApi(data));
    return mapTransactionFromApi(response.data);
  }

  async update(id: string, data: Partial<FinancialTransactionPayload>): Promise<FinancialTransaction> {
    const response = await apiClient.put<FinancialTransactionApiResponse>(
      `/financial-transactions/${id}`,
      mapTransactionToApi(data as FinancialTransactionPayload)
    );
    return mapTransactionFromApi(response.data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/financial-transactions/${id}`);
  }
}

export default new FinancialTransactionService();
