import { Student } from '@/types';
import apiClient from './apiClient';

type StudentApiStatus = 'ACTIVE' | 'INACTIVE';

interface StudentApiResponse {
  id: string;
  branchId: string;
  therapistId: string;
  name: string;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianEmail?: string | null;
  status: StudentApiStatus;
  lastActivityDate?: string | null;
  wantsMonthlyNFe?: boolean;
  rg?: string | null;
  cpf?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  postalCode?: string | null;
  sessionsPerMonth?: number | null;
  monthlyValue?: number | null;
  paymentMethod?: Student['paymentMethod'] | null;
  taxPercentage?: number | null;
  planObservations?: string | null;
}

interface StudentFilters {
  branchId?: string;
  therapistId?: string;
}

type StudentPayload = Partial<Student> & Pick<Student, 'branchId' | 'therapistId' | 'name' | 'status'>;

const apiToUiStatus: Record<StudentApiStatus, Student['status']> = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const uiToApiStatus: Record<Student['status'], StudentApiStatus> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};

const cleanString = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const toDateInput = (value?: string | null) => {
  if (!value) return undefined;
  return value.split('T')[0];
};

const toPositiveNumber = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value) || value <= 0) {
    return undefined;
  }
  return value;
};

const toOptionalNumber = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined;
  }
  return value;
};

const mapStudentFromApi = (student: StudentApiResponse): Student => ({
  id: student.id,
  branchId: student.branchId,
  therapistId: student.therapistId,
  name: student.name,
  avatarUrl: cleanString(student.avatarUrl),
  dateOfBirth: toDateInput(student.dateOfBirth),
  guardianName: cleanString(student.guardianName),
  guardianPhone: cleanString(student.guardianPhone),
  guardianEmail: cleanString(student.guardianEmail),
  status: apiToUiStatus[student.status] ?? 'active',
  lastActivityDate: toDateInput(student.lastActivityDate),
  wantsMonthlyNFe: student.wantsMonthlyNFe,
  rg: cleanString(student.rg),
  cpf: cleanString(student.cpf),
  address: cleanString(student.address),
  neighborhood: cleanString(student.neighborhood),
  city: cleanString(student.city),
  postalCode: cleanString(student.postalCode),
  sessionsPerMonth: student.sessionsPerMonth ? (student.sessionsPerMonth as Student['sessionsPerMonth']) : undefined,
  monthlyValue: student.monthlyValue ?? undefined,
  paymentMethod: student.paymentMethod ?? undefined,
  taxPercentage: student.taxPercentage ?? undefined,
  planObservations: cleanString(student.planObservations),
});

const mapStudentToApi = (student: StudentPayload) => ({
  branchId: student.branchId,
  therapistId: student.therapistId,
  name: student.name.trim(),
  avatarUrl: cleanString(student.avatarUrl),
  dateOfBirth: cleanString(student.dateOfBirth),
  guardianName: cleanString(student.guardianName),
  guardianPhone: cleanString(student.guardianPhone),
  guardianEmail: cleanString(student.guardianEmail),
  status: uiToApiStatus[student.status],
  rg: cleanString(student.rg),
  cpf: cleanString(student.cpf),
  address: cleanString(student.address),
  neighborhood: cleanString(student.neighborhood),
  city: cleanString(student.city),
  postalCode: cleanString(student.postalCode),
  sessionsPerMonth: toPositiveNumber(student.sessionsPerMonth),
  monthlyValue: toPositiveNumber(student.monthlyValue),
  paymentMethod: student.paymentMethod || undefined,
  taxPercentage: toOptionalNumber(student.taxPercentage),
  planObservations: cleanString(student.planObservations),
  wantsMonthlyNFe: student.wantsMonthlyNFe ?? false,
});

class StudentService {
  async getAll(filters: StudentFilters = {}): Promise<Student[]> {
    const response = await apiClient.get<StudentApiResponse[]>('/students', { params: filters });
    return response.data.map(mapStudentFromApi);
  }

  async create(data: StudentPayload): Promise<Student> {
    const response = await apiClient.post<StudentApiResponse>('/students', mapStudentToApi(data));
    return mapStudentFromApi(response.data);
  }

  async update(id: string, data: Partial<StudentPayload>): Promise<Student> {
    const response = await apiClient.put<StudentApiResponse>(`/students/${id}`, mapStudentToApi(data as StudentPayload));
    return mapStudentFromApi(response.data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  }
}

export default new StudentService();
