import { Appointment } from '../types';
import apiClient from './apiClient';

type ApiAppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'PENDING_ACCEPTANCE';

interface AppointmentApiResponse {
  id: string;
  branchId: string;
  therapistId?: string | null;
  studentId?: string | null;
  dateTime: string;
  studentName: string;
  therapistName?: string | null;
  service: string;
  status: ApiAppointmentStatus;
  notes?: string | null;
  cancellationReason?: string | null;
  cancelledBy?: 'student' | 'therapist' | 'admin' | null;
  reminderSent?: boolean;
}

interface AppointmentFilters {
  branchId?: string;
  therapistId?: string;
  status?: Appointment['status'];
}

type AppointmentPayload = Partial<Appointment> &
  Pick<Appointment, 'branchId' | 'dateTime' | 'studentName' | 'service'>;

const apiToUiStatus: Record<ApiAppointmentStatus, Appointment['status']> = {
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  PENDING_ACCEPTANCE: 'pending_acceptance',
};

const uiToApiStatus: Record<Appointment['status'], ApiAppointmentStatus> = {
  scheduled: 'SCHEDULED',
  cancelled: 'CANCELLED',
  completed: 'COMPLETED',
  pending_acceptance: 'PENDING_ACCEPTANCE',
};

const cleanString = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const mapAppointmentFromApi = (appointment: AppointmentApiResponse): Appointment => ({
  id: appointment.id,
  branchId: appointment.branchId,
  therapistId: appointment.therapistId ?? null,
  therapistName: appointment.therapistName ?? null,
  dateTime: appointment.dateTime,
  studentName: appointment.studentName,
  service: appointment.service,
  status: apiToUiStatus[appointment.status],
  notes: cleanString(appointment.notes),
  cancellationReason: cleanString(appointment.cancellationReason),
  cancelledBy: appointment.cancelledBy ?? undefined,
  reminderSent: appointment.reminderSent,
});

const mapAppointmentToApi = (appointment: AppointmentPayload) => ({
  branchId: appointment.branchId,
  therapistId: appointment.therapistId === '' ? null : appointment.therapistId ?? null,
  studentId: appointment.studentId || undefined,
  dateTime: appointment.dateTime,
  studentName: appointment.studentName.trim(),
  therapistName: cleanString(appointment.therapistName),
  service: appointment.service.trim(),
  status: appointment.status ? uiToApiStatus[appointment.status] : undefined,
  notes: cleanString(appointment.notes),
  cancellationReason: cleanString(appointment.cancellationReason),
  cancelledBy: appointment.cancelledBy || undefined,
  reminderSent: appointment.reminderSent,
});

class AppointmentService {
  async getAll(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    const params = {
      branchId: filters.branchId,
      therapistId: filters.therapistId,
      status: filters.status ? uiToApiStatus[filters.status] : undefined,
    };
    const response = await apiClient.get<AppointmentApiResponse[]>('/appointments', { params });
    return response.data.map(mapAppointmentFromApi);
  }

  async create(data: AppointmentPayload): Promise<Appointment> {
    const response = await apiClient.post<AppointmentApiResponse>('/appointments', mapAppointmentToApi(data));
    return mapAppointmentFromApi(response.data);
  }

  async update(id: string, data: Partial<AppointmentPayload>): Promise<Appointment> {
    const response = await apiClient.put<AppointmentApiResponse>(`/appointments/${id}`, mapAppointmentToApi(data as AppointmentPayload));
    return mapAppointmentFromApi(response.data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }
}

export default new AppointmentService();
