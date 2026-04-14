
import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { InitialAssessment, StaffMember, StaffStatus } from '../types';
import { useBranch } from '../contexts/BranchContext';
import { PlusCircleIcon, CalendarIcon, TrashIcon } from '../components/icons/HeroIcons';

// Mock therapists for selection (fallback)
const mockTherapistsFallback: StaffMember[] = [
  { id: 'therapist1', branchId: 'branch-1', name: 'Dr. Carlos Alberto (Fallback)', role: 'Psicólogo', email: 'carlos.alberto@example.com', status: StaffStatus.ACTIVE, specialty: 'Avaliações Diagnósticas' } as StaffMember,
];

// Mock existing assessments
const mockAssessments: InitialAssessment[] = [
    { id: 'assess1', studentId: 'studentNew1', studentName: 'João Neves', branchId: 'branch-1', dateTime: '2024-07-28T10:00:00', therapistId: 'therapist1', status: 'scheduled', notes: 'Avaliação de TDAH' },
];

const ASSESSMENTS_STORAGE_KEY = 'equipe_rafael_barros_assessments';
const TEAM_STORAGE_KEY = 'equipe_rafael_barros_team';

const NewClientIntegrationPage: React.FC = () => {
  const [assessments, setAssessments] = useState<InitialAssessment[]>(() => {
    try {
        const storedAssessments = window.localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
        return storedAssessments ? JSON.parse(storedAssessments) : mockAssessments;
    } catch (error) {
        return mockAssessments;
    }
  });

  const { selectedBranch } = useBranch();

  // Load therapists
  const [therapists] = useState<StaffMember[]>(() => {
    try {
      const stored = localStorage.getItem(TEAM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : mockTherapistsFallback;
    } catch { return mockTherapistsFallback; }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments));
    } catch (error) {
        console.error("Error writing assessments to localStorage", error);
    }
  }, [assessments]);

  const [showForm, setShowForm] = useState(false);
  
  // Form state for new assessment
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [assessmentDateTime, setAssessmentDateTime] = useState(''); // Stores combined date and time
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [assessmentNotes, setAssessmentNotes] = useState('');

  const filteredAssessments = useMemo(() => {
    if (!selectedBranch) return assessments;
    return assessments.filter(a => a.branchId === selectedBranch.id);
  }, [assessments, selectedBranch]);

  const availableTherapists = useMemo(() => {
    if (!selectedBranch) return therapists;
    return therapists.filter(t => t.branchId === selectedBranch.id);
  }, [selectedBranch, therapists]);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const datePart = e.target.value;
    // Keep time part if already selected, otherwise clear it
    const timePart = assessmentDateTime ? assessmentDateTime.split('T')[1] : '';
    setAssessmentDateTime(timePart ? `${datePart}T${timePart}` : datePart);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAssessmentDateTime(e.target.value); // Value from time slot is full dateTime string
  };


  const availableTimeSlots = useMemo(() => {
    if (!assessmentDateTime || !selectedTherapist) return [];
    const datePart = assessmentDateTime.split('T')[0];
    if (!datePart) return [];
    
    // In a real app, this would check therapist availability and existing appointments
    return [
      { value: `${datePart}T09:00:00`, label: '09:00' },
      { value: `${datePart}T10:00:00`, label: '10:00' },
      { value: `${datePart}T11:00:00`, label: '11:00' },
      { value: `${datePart}T14:00:00`, label: '14:00' },
      { value: `${datePart}T15:00:00`, label: '15:00' },
      { value: `${datePart}T16:00:00`, label: '16:00' },
    ].filter(slot => {
        // Example: Filter out already booked slots for this therapist on this day
        return !assessments.some(a => a.therapistId === selectedTherapist && a.dateTime === slot.value);
    });
  }, [assessmentDateTime, selectedTherapist, assessments]);


  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) {
        alert("Por favor, selecione uma filial antes de agendar uma avaliação.");
        return;
    }
    if (!studentName || !assessmentDateTime || !selectedTherapist || !assessmentDateTime.includes('T')) {
        alert("Por favor, preencha nome, data, horário e terapeuta.");
        return;
    }
    
    const newAssessment: InitialAssessment = {
      id: String(Date.now()),
      studentId: `student-${Date.now()}`, // Temporary student ID
      studentName: studentName,
      guardianEmail: studentEmail,
      guardianPhone: studentPhone,
      branchId: selectedBranch.id,
      dateTime: assessmentDateTime, 
      therapistId: selectedTherapist,
      status: 'scheduled',
      notes: assessmentNotes,
    };
    setAssessments(prev => [newAssessment, ...prev]);
    alert(`Avaliação para ${studentName} agendada com ${therapists.find(t=>t.id === selectedTherapist)?.name} para ${new Date(assessmentDateTime).toLocaleString('pt-BR')}. Confirmação enviada para ${studentEmail}.`);
    
    setStudentName('');
    setStudentEmail('');
    setStudentPhone('');
    setAssessmentDateTime('');
    setSelectedTherapist('');
    setAssessmentNotes('');
    setShowForm(false);
  };

  const handleDeleteAssessment = (id: string) => {
    if (window.confirm("Tem certeza que deseja cancelar esta avaliação agendada?")) {
        setAssessments(prev => prev.filter(assessment => assessment.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Integração de Novos Alunos</h2>
        <Button onClick={() => setShowForm(true)} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
          Agendar Avaliação
        </Button>
      </div>

      {showForm && (
        <Card title="Agendar Avaliação Inicial">
          <form onSubmit={handleSubmitAssessment} className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">Informações do Aluno</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nome Completo do Aluno/Responsável" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
              <Input label="Email de Contato" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
              <Input label="Telefone de Contato" type="tel" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} />
            </div>
            
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mt-4 mb-2">Detalhes da Avaliação</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Terapeuta Responsável"
                    value={selectedTherapist}
                    onChange={(e) => setSelectedTherapist(e.target.value)}
                    options={availableTherapists.map(t => ({ value: t.id, label: `${t.name} ${t.specialty ? `(${t.specialty})` : ''}` }))}
                    placeholder="Selecione um terapeuta"
                    required
                    disabled={!selectedBranch}
                />
                <Input 
                    label="Data da Avaliação" 
                    type="date" 
                    value={assessmentDateTime.split('T')[0]}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]} 
                    required 
                    disabled={!selectedBranch}
                />
             </div>

            {assessmentDateTime.split('T')[0] && selectedTherapist && (
                 <Select
                    label="Horário Disponível"
                    value={assessmentDateTime} 
                    onChange={handleTimeChange}
                    options={availableTimeSlots}
                    placeholder="Selecione um horário"
                    required
                    disabled={availableTimeSlots.length === 0}
                />
            )}
            {assessmentDateTime.split('T')[0] && selectedTherapist && availableTimeSlots.length === 0 && (
                <p className="text-sm text-red-500">Nenhum horário disponível para este terapeuta nesta data. Por favor, selecione outra data ou terapeuta.</p>
            )}


            <div>
                <label htmlFor="assessmentNotes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Observações Adicionais (opcional)</label>
                <textarea 
                    id="assessmentNotes" 
                    name="assessmentNotes" 
                    rows={3} 
                    className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light"
                    value={assessmentNotes}
                    onChange={(e) => setAssessmentNotes(e.target.value)}
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={!assessmentDateTime.includes('T') || !selectedTherapist || availableTimeSlots.length === 0}>Agendar e Confirmar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Avaliações Agendadas">
        {filteredAssessments.length > 0 ? (
          <div className="space-y-3">
            {filteredAssessments.map(assessment => (
              <div key={assessment.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">Aluno: {assessment.studentName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Data: {new Date(assessment.dateTime).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Terapeuta: {therapists.find(t => t.id === assessment.therapistId)?.name || 'N/A'}
                  </p>
                  {assessment.notes && <p className="text-xs text-slate-400 dark:text-slate-500 italic">Notas: {assessment.notes}</p>}
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      assessment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                      assessment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {assessment.status === 'scheduled' ? 'Agendada' : 'Concluída'}
                    </span>
                     {assessment.status === 'scheduled' && (
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteAssessment(assessment.id)} title="Cancelar Avaliação">
                            <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                        </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Nenhuma avaliação agendada no momento para esta filial.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NewClientIntegrationPage;
