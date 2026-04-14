import { StaffMember, StaffStatus } from '../types';
import apiClient from './apiClient';

type StaffApiStatus = 'ACTIVE' | 'ON_VACATION' | 'INACTIVE';

interface StaffApiResponse {
  id: string;
  branchId: string;
  name: string;
  role: string;
  email: string;
  secondaryEmail?: string | null;
  phone?: string | null;
  status: StaffApiStatus;
  avatarUrl?: string | null;
  specialty?: string | null;
  bankInfo?: string | null;
  contractUrl?: string | null;
  admissionDate?: string | null;
  terminationDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface StaffFilters {
  branchId?: string;
}

type StaffPayload = Partial<StaffMember> & Pick<StaffMember, 'branchId' | 'name' | 'role' | 'email'>;

const apiToUiStatus: Record<StaffApiStatus, StaffStatus> = {
  ACTIVE: StaffStatus.ACTIVE,
  ON_VACATION: StaffStatus.ON_VACATION,
  INACTIVE: StaffStatus.INACTIVE,
};

const uiToApiStatus: Record<StaffStatus, StaffApiStatus> = {
  [StaffStatus.ACTIVE]: 'ACTIVE',
  [StaffStatus.ON_VACATION]: 'ON_VACATION',
  [StaffStatus.INACTIVE]: 'INACTIVE',
};

const toDateInput = (value?: string | null) => {
  if (!value) return undefined;
  return value.split('T')[0];
};

const cleanString = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const mapStaffFromApi = (staff: StaffApiResponse): StaffMember => ({
  id: staff.id,
  branchId: staff.branchId,
  name: staff.name,
  role: staff.role,
  email: staff.email,
  secondaryEmail: cleanString(staff.secondaryEmail),
  phone: cleanString(staff.phone),
  status: apiToUiStatus[staff.status] ?? StaffStatus.ACTIVE,
  avatarUrl: cleanString(staff.avatarUrl),
  specialty: cleanString(staff.specialty),
  bankInfo: cleanString(staff.bankInfo),
  contractUrl: cleanString(staff.contractUrl),
  admissionDate: toDateInput(staff.admissionDate),
  terminationDate: toDateInput(staff.terminationDate),
});

const mapStaffToApi = (staff: StaffPayload) => ({
  branchId: staff.branchId,
  name: staff.name.trim(),
  role: staff.role.trim(),
  email: staff.email.trim().toLowerCase(),
  secondaryEmail: cleanString(staff.secondaryEmail),
  phone: cleanString(staff.phone),
  status: staff.status ? uiToApiStatus[staff.status] : undefined,
  avatarUrl: cleanString(staff.avatarUrl),
  specialty: cleanString(staff.specialty),
  bankInfo: cleanString(staff.bankInfo),
  contractUrl: cleanString(staff.contractUrl),
  admissionDate: cleanString(staff.admissionDate),
  terminationDate: cleanString(staff.terminationDate),
});

class StaffService {
  async getAll(filters: StaffFilters = {}): Promise<StaffMember[]> {
    const response = await apiClient.get<StaffApiResponse[]>('/staff', { params: filters });
    return response.data.map(mapStaffFromApi);
  }

  async create(data: StaffPayload): Promise<StaffMember> {
    const response = await apiClient.post<StaffApiResponse>('/staff', mapStaffToApi(data));
    return mapStaffFromApi(response.data);
  }

  async update(id: string, data: Partial<StaffPayload>): Promise<StaffMember> {
    const response = await apiClient.put<StaffApiResponse>(`/staff/${id}`, mapStaffToApi(data as StaffPayload));
    return mapStaffFromApi(response.data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/staff/${id}`);
  }
}

export default new StaffService();
