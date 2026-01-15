
import React, { useRef, useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { Appointment, User, StaffMember, StaffStatus } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, CalendarIcon, XCircleIcon, BellIcon, EnvelopeIcon, FunnelIcon } from '../components/icons/HeroIcons';
import { useAuth } from '../contexts/AuthContext';
import { useBranch } from '../contexts/BranchContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

// FullCalendar Imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

const mockAppointments: Appointment[] = [
  { id: '1', branchId: 'branch-1', dateTime: '2024-07-25T10:00:00', studentName: 'Ana Beatriz Silva', therapistId: 'therapist01', therapistName: 'Dr. Carlos', service: 'Terapia Ocupacional', status: 'scheduled' },
  { id: '2', branchId: 'branch-1', dateTime: '2024-07-25T11:30:00', studentName: 'João Pedro Alves', therapistId: 'therapist01', therapistName: 'Dr. Carlos', service: 'Fonoaudiologia', status: 'scheduled' },
  { id: '3', branchId: 'branch-2', dateTime: '2024-07-25T14:00:00', studentName: 'Mariana Costa', therapistId: 'therapist02', therapistName: 'Dra. Sofia', service: 'Psicologia', status: 'completed' },
  { id: '4', branchId: 'branch-1', dateTime: '2024-07-26T09:00:00', studentName: 'Lucas Martins', therapistId: 'therapist01', therapistName: 'Dr. Carlos', service: 'Avaliação Inicial', status: 'scheduled' },
  { id: '5', branchId: 'branch-2', dateTime: '2024-07-26T15:00:00', studentName: 'Sofia Oliveira', therapistId: 'therapist02', therapistName: 'Dra. Sofia', service: 'Terapia Comportamental', status: 'cancelled', cancellationReason: 'Imprevisto de saúde', cancelledBy: 'student' },
  { id: '6', branchId: 'branch-1', dateTime: '2024-07-28T11:00:00', studentName: 'Ricardo Faria', therapistId: null, therapistName: 'Aguardando Aceite', service: 'Psicomotricidade', status: 'pending_acceptance' },
];

// Fallback if local storage is empty
const mockTherapistsFallback: StaffMember[] = [
    { id: 'therapist01', branchId: 'branch-1', name: 'Dr. Carlos', role: 'Psicólogo', email: 'carlos@ex.com', status: StaffStatus.ACTIVE } as StaffMember,
    { id: 'therapist02', branchId: 'branch-2', name: 'Dra. Sofia', role: 'Fonoaudiólogo', email: 'sofia@ex.com', status: StaffStatus.ACTIVE } as StaffMember,
];

const TEAM_STORAGE_KEY = 'equipe_rafael_barros_team';

interface AppointmentFormProps {
    appointment?: Partial<Appointment> | null;
    initialDate?: string;
    onSave: (appointmentData: Partial<Appointment>, method: 'direct' | 'invite') => void;
    onCancel: () => void;
    user: User;
    therapists: StaffMember[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, initialDate, onSave, onCancel, user, therapists }) => {
    // Se vier appointment.dateTime, usa. Senão, usa initialDate. Senão, data atual.
    const defaultDate = appointment?.dateTime || initialDate || new Date().toISOString().slice(0, 16);

    const [formData, setFormData] = React.useState<Partial<Appointment>>(
        appointment || { status: 'scheduled', dateTime: defaultDate, therapistId: user.role === 'therapist' ? user.id : '' }
    );
    
    // Garante que a data esteja no estado se for novo
    React.useEffect(() => {
        if (!appointment && initialDate) {
             setFormData(prev => ({ ...prev, dateTime: initialDate }));
        }
    }, [initialDate, appointment]);

    const [assignmentMethod, setAssignmentMethod] = React.useState<'direct' | 'invite'>(
        appointment?.status === 'pending_acceptance' ? 'invite' : 'direct'
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, assignmentMethod);
    };

    return (
        <Card title={appointment?.id ? "Editar Agendamento" : "Novo Agendamento"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Aluno</label>
                        <input type="text" name="studentName" id="studentName" value={formData.studentName || ''} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <Select
                        label="Método de Atribuição"
                        value={assignmentMethod}
                        onChange={(e) => setAssignmentMethod(e.target.value as 'direct' | 'invite')}
                        options={[
                            { value: 'direct', label: 'Atribuir a um terapeuta' },
                            { value: 'invite', label: 'Enviar convite para equipe' }
                        ]}
                    />
                    {assignmentMethod === 'direct' && (
                         <Select
                            label="Terapeuta"
                            name="therapistId"
                            value={formData.therapistId || ''}
                            onChange={handleChange}
                            options={therapists.map(t => ({value: t.id, label: t.name}))}
                            disabled={user.role === 'therapist'}
                            required
                        />
                    )}
                    <div>
                        <label htmlFor="dateTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data e Hora (Início)</label>
                        <input 
                            type="datetime-local" 
                            name="dateTime" 
                            id="dateTime" 
                            value={formData.dateTime ? formData.dateTime.slice(0, 16) : ''} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="service" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Serviço/Tipo de Sessão</label>
                        <input type="text" name="service" id="service" value={formData.service || ''} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="md:col-span-2">
                         <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Observações (opcional)</label>
                         <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Agendamento</Button>
                </div>
            </form>
        </Card>
    );
};

interface CancellationModalProps {
    appointment: Appointment;
    onConfirm: (id: string, reason: string, cancelledBy: 'student' | 'therapist') => void;
    onCancel: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({ appointment, onConfirm, onCancel }) => {
    const [reason, setReason] = React.useState('');
    const [cancelledBy, setCancelledBy] = React.useState<'student' | 'therapist'>('student');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!reason.trim()) {
            alert("Por favor, informe o motivo do cancelamento.");
            return;
        }
        onConfirm(appointment.id, reason, cancelledBy);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onCancel}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100" id="modal-title">
                                        Cancelar Agendamento
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                                            Você está cancelando a sessão de <strong>{appointment.studentName}</strong> agendada para {new Date(appointment.dateTime).toLocaleDateString('pt-BR')} às {new Date(appointment.dateTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}.
                                        </p>
                                        
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Quem solicitou o cancelamento?</label>
                                            <div className="flex space-x-4">
                                                <label className="inline-flex items-center">
                                                    <input 
                                                        type="radio" 
                                                        className="form-radio text-primary" 
                                                        name="cancelledBy" 
                                                        value="student" 
                                                        checked={cancelledBy === 'student'}
                                                        onChange={() => setCancelledBy('student')}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Aluno/Responsável</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input 
                                                        type="radio" 
                                                        className="form-radio text-primary" 
                                                        name="cancelledBy" 
                                                        value="therapist" 
                                                        checked={cancelledBy === 'therapist'}
                                                        onChange={() => setCancelledBy('therapist')}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Clínica/Terapeuta</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Motivo do Cancelamento</label>
                                            <textarea 
                                                id="cancelReason" 
                                                rows={3} 
                                                className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                placeholder="Descreva o motivo..."
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <Button type="submit" variant="danger" className="w-full sm:w-auto sm:ml-3">
                                Confirmar Cancelamento
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel} className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
                                Voltar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const TherapistAgendaPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedBranch } = useBranch();
  const { addToast } = useToast();
  const { theme } = useTheme(); 
  const calendarRef = useRef<FullCalendar>(null);

  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [showForm, setShowForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [formInitialDate, setFormInitialDate] = useState<string>('');

  // Filters
  const [selectedTherapistFilter, setSelectedTherapistFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Load therapists from localStorage
  const [therapists, setTherapists] = useState<StaffMember[]>(() => {
    try {
      const stored = localStorage.getItem(TEAM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : mockTherapistsFallback;
    } catch { return mockTherapistsFallback; }
  });

  // Filter therapists for the dropdown (exclude non-therapists if necessary)
  const availableTherapists = React.useMemo(() => {
      return therapists.filter(t => t.branchId === selectedBranch?.id || !selectedBranch);
  }, [therapists, selectedBranch]);

  const filteredAppointments = React.useMemo(() => {
    if (!user) return [];
    
    let visibleAppointments = appointments;

    // Filter by Branch (Global)
    if (selectedBranch) {
        visibleAppointments = visibleAppointments.filter(app => app.branchId === selectedBranch.id);
    }

    // Role-based logic and Therapist Filter
    if (user.role === 'ADMIN') {
        // Admin can filter by specific therapist
        if (selectedTherapistFilter) {
            visibleAppointments = visibleAppointments.filter(app => app.therapistId === selectedTherapistFilter);
        }
    } else if (user.role === 'therapist') {
        // Therapist only sees own appointments or pending invites
        visibleAppointments = visibleAppointments.filter(app => app.therapistId === user.id || app.status === 'pending_acceptance');
    }

    // Status Filter
    if (selectedStatusFilter) {
        visibleAppointments = visibleAppointments.filter(app => app.status === selectedStatusFilter);
    }

    return visibleAppointments;
  }, [appointments, user, selectedBranch, selectedTherapistFilter, selectedStatusFilter]);

  // Transform appointments to FullCalendar events
  const calendarEvents = React.useMemo(() => {
      return filteredAppointments.map(app => {
          // Calculate end time (assume 1 hour duration for now if not stored)
          const start = new Date(app.dateTime);
          const end = new Date(start.getTime() + 60 * 60 * 1000); 
          
          let backgroundColor = '#0284c7'; // primary
          let borderColor = '#0284c7';

          switch(app.status) {
              case 'cancelled': backgroundColor = '#ef4444'; borderColor = '#ef4444'; break; // red-500
              case 'completed': backgroundColor = '#10b981'; borderColor = '#10b981'; break; // emerald-500
              case 'pending_acceptance': backgroundColor = '#f59e0b'; borderColor = '#f59e0b'; break; // amber-500
              case 'scheduled': default: backgroundColor = '#0284c7'; borderColor = '#0284c7'; break; // sky-600
          }

          return {
              id: app.id,
              title: `${app.studentName} - ${app.service}`,
              start: app.dateTime,
              end: end.toISOString(),
              extendedProps: { ...app },
              backgroundColor,
              borderColor,
              textColor: '#ffffff',
              classNames: app.status === 'cancelled' ? ['line-through', 'opacity-70'] : []
          };
      });
  }, [filteredAppointments]);

  const handleDateClick = (arg: { dateStr: string }) => {
      let dateStr = arg.dateStr;
      
      // If it's a day view click (YYYY-MM-DD), append default time
      if (!dateStr.includes('T')) {
          dateStr += 'T09:00:00';
      }

      // Avoid toISOString which converts to UTC. Use the local string directly.
      // Ensure it fits the datetime-local input format YYYY-MM-DDTHH:mm
      const localDateString = dateStr.slice(0, 16);
      
      setFormInitialDate(localDateString);
      setEditingAppointment(null);
      setShowForm(true);
  };

  const handleEventClick = (clickInfo: any) => {
      const appointment = clickInfo.event.extendedProps as Appointment;
      // Open edit/view modal
      if (appointment.status === 'cancelled') {
          if (window.confirm("Este agendamento está cancelado. Deseja excluí-lo permanentemente?")) {
              handleDeletePermanently(appointment.id);
          }
      } else {
          setEditingAppointment(appointment);
          setShowForm(true);
      }
  };

  const handleSaveAppointment = (appointmentData: Partial<Appointment>, method: 'direct' | 'invite') => {
    if(!user || (user.role === 'ADMIN' && !selectedBranch)) {
        alert("Administradores devem selecionar uma filial para criar um agendamento.");
        return;
    }

    const finalAppointment: Appointment = {
      id: appointmentData.id || String(Date.now()),
      branchId: editingAppointment?.branchId || selectedBranch!.id,
      dateTime: appointmentData.dateTime!,
      studentName: appointmentData.studentName!,
      therapistId: method === 'direct' ? (appointmentData.therapistId || user.id) : null,
      therapistName: method === 'direct' ? (therapists.find(t => t.id === appointmentData.therapistId)?.name || user.name) : 'Aguardando Aceite',
      service: appointmentData.service!,
      status: method === 'direct' ? (editingAppointment?.status || 'scheduled') : 'pending_acceptance', // Preserve status if editing
      notes: appointmentData.notes,
    };

    // Reset specific status fields if reactivating or changing
    if (editingAppointment && editingAppointment.status === 'cancelled' && appointmentData.status !== 'cancelled') {
        finalAppointment.cancellationReason = undefined;
        finalAppointment.cancelledBy = undefined;
    }

    if (editingAppointment) {
      setAppointments(prev => prev.map(app => app.id === finalAppointment.id ? finalAppointment : app));
    } else {
      setAppointments(prev => [finalAppointment, ...prev]);
    }
    setShowForm(false);
    setEditingAppointment(null);
    addToast("Agendamento salvo com sucesso!");
  };
  
  const handleDeleteFormAction = () => {
      if (!editingAppointment) return;
      // Check if we should cancel or delete
      if (editingAppointment.status === 'scheduled' || editingAppointment.status === 'pending_acceptance') {
         // Trigger cancel modal
         setAppointmentToCancel(editingAppointment);
         setShowForm(false); // Close edit form
         setShowCancelModal(true); // Open cancel modal
      } else {
         // Delete permanently
         handleDeletePermanently(editingAppointment.id);
         setShowForm(false);
      }
  };

  const handleConfirmCancellation = (id: string, reason: string, cancelledBy: 'student' | 'therapist') => {
    setAppointments(prev => prev.map(app => {
        if (app.id === id) {
            return {
                ...app,
                status: 'cancelled',
                cancellationReason: reason,
                cancelledBy: cancelledBy
            };
        }
        return app;
    }));

    const cancelledApp = appointments.find(a => a.id === id);
    if (cancelledBy === 'student') {
        addToast(`Cancelamento registrado. Notificação enviada para o terapeuta ${cancelledApp?.therapistName}.`, 'info');
    } else {
        addToast(`Cancelamento registrado. Notificação enviada para o aluno/responsável ${cancelledApp?.studentName}.`, 'info');
    }

    setShowCancelModal(false);
    setAppointmentToCancel(null);
  };
  
  const handleDeletePermanently = (id: string) => {
      if(window.confirm("Deseja excluir este registro do histórico permanentemente?")) {
        setAppointments(prev => prev.filter(app => app.id !== id));
        addToast("Agendamento excluído.");
      }
  }
  
  const handleAcceptAppointment = () => {
    if (!user || !editingAppointment) return;
    setAppointments(prev => prev.map(app => {
      if (app.id === editingAppointment.id) {
        return {
          ...app,
          therapistId: user.id,
          therapistName: user.name,
          status: 'scheduled',
        };
      }
      return app;
    }));
    addToast(`Sessão aceita com sucesso!`);
    setShowForm(false);
  };

  const handleSendReminders = () => {
    const now = new Date();
    const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000); 

    const eligibleAppointments = appointments.filter(app => {
        const appDate = new Date(app.dateTime);
        return app.status === 'scheduled' &&
               appDate > now &&
               appDate <= next48h &&
               !app.reminderSent;
    });

    if (eligibleAppointments.length === 0) {
        addToast("Nenhum agendamento pendente de lembrete para as próximas 48h.", 'info');
        return;
    }

    if (window.confirm(`Deseja enviar lembretes para ${eligibleAppointments.length} agendamentos nas próximas 48h?`)) {
        setAppointments(prev => prev.map(app => {
            if (eligibleAppointments.find(e => e.id === app.id)) {
                return { ...app, reminderSent: true };
            }
            return app;
        }));

        addToast(`${eligibleAppointments.length} lembretes enviados com sucesso!`, 'success');
    }
  };

  if (!user) {
    return <div className="p-6 text-center">Carregando informações do usuário...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Agenda do Terapeuta</h2>
        <div className="flex items-center space-x-4">
           <Button variant="secondary" onClick={handleSendReminders} leftIcon={<BellIcon className="w-5 h-5"/>} title="Disparar emails">
              Enviar Lembretes
           </Button>
           <Button onClick={() => { setEditingAppointment(null); setFormInitialDate(new Date().toISOString().slice(0, 16)); setShowForm(true); }} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center text-slate-500 font-medium">
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filtros:
              </div>
              
              {/* Therapist Filter - Only visible to Admins */}
              {user.role === 'ADMIN' && (
                  <div className="w-full md:w-1/3">
                      <Select 
                          value={selectedTherapistFilter}
                          onChange={(e) => setSelectedTherapistFilter(e.target.value)}
                          options={[
                              { value: '', label: 'Todos os Terapeutas' },
                              ...availableTherapists.map(t => ({ value: t.id, label: t.name }))
                          ]}
                          wrapperClassName="!mb-0"
                          className="!py-2"
                      />
                  </div>
              )}

              {/* Status Filter - Visible to everyone */}
              <div className="w-full md:w-1/3">
                  <Select 
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      options={[
                          { value: '', label: 'Todos os Status' },
                          { value: 'scheduled', label: 'Agendado' },
                          { value: 'completed', label: 'Concluído' },
                          { value: 'pending_acceptance', label: 'Pendente (Aguardando Aceite)' },
                          { value: 'cancelled', label: 'Cancelado' },
                      ]}
                      wrapperClassName="!mb-0"
                      className="!py-2"
                  />
              </div>
              
              {(selectedTherapistFilter || selectedStatusFilter) && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => { setSelectedTherapistFilter(''); setSelectedStatusFilter(''); }}
                    className="text-slate-500"
                  >
                      Limpar
                  </Button>
              )}
          </div>
      </Card>

      {/* Calendar Component */}
      <Card className="p-0 overflow-hidden shadow-xl">
          <div className="p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
              <FullCalendar
                ref={calendarRef}
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale={ptBrLocale}
                events={calendarEvents}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                slotMinTime="07:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                height="auto"
                contentHeight="auto"
                aspectRatio={1.5}
                dayHeaderClassNames="text-slate-700 dark:text-slate-300 font-semibold"
                slotLabelClassNames="text-slate-500 dark:text-slate-400"
                eventClassNames="rounded shadow-sm text-xs font-semibold"
              />
          </div>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-40 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                 <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowForm(false)}></div>
                 <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                 
                 <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                     <div className="p-1">
                        <AppointmentForm 
                            appointment={editingAppointment} 
                            initialDate={formInitialDate}
                            onSave={handleSaveAppointment} 
                            onCancel={() => setShowForm(false)} 
                            user={user}
                            therapists={availableTherapists}
                        />
                     </div>
                     {editingAppointment && (
                        <div className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 sm:px-6 flex justify-between">
                             {editingAppointment.status === 'pending_acceptance' && user.role === 'therapist' && (
                                 <Button size="sm" onClick={handleAcceptAppointment} className="mr-auto">Aceitar Sessão</Button>
                             )}
                             <div className="flex space-x-2 ml-auto">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={handleDeleteFormAction} 
                                    className="text-red-600 hover:text-red-800"
                                    leftIcon={<TrashIcon className="w-4 h-4"/>}
                                >
                                    {editingAppointment.status === 'scheduled' ? 'Cancelar Sessão' : 'Excluir'}
                                </Button>
                             </div>
                        </div>
                     )}
                 </div>
            </div>
        </div>
      )}

      {showCancelModal && appointmentToCancel && (
          <CancellationModal 
            appointment={appointmentToCancel} 
            onConfirm={handleConfirmCancellation}
            onCancel={() => { setShowCancelModal(false); setAppointmentToCancel(null); }}
          />
      )}

      <Card title="Legenda">
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#0284c7] mr-2"></span> Agendado</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></span> Concluído</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></span> Aguardando Aceite</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></span> Cancelado</div>
        </div>
      </Card>
    </div>
  );
};

export default TherapistAgendaPage;
