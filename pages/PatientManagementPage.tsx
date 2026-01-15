
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Student, User, StaffMember, InitialAssessment, Appointment, PaymentMethod, StaffStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useBranch } from '../contexts/BranchContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon, CalendarIcon, CurrencyDollarIcon, DocumentChartBarIcon, MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '../components/icons/HeroIcons';

// --- MOCK DATA ---
const mockStudentsData: Student[] = [
    { id: 'p001', branchId: 'branch-1', name: 'Lucas Silva', therapistId: 'therapist01', status: 'active', avatarUrl: 'https://picsum.photos/seed/lucas/100', monthlyValue: 1080, paymentMethod: 'CREDITO_RECORRENTE', sessionsPerMonth: 4, taxPercentage: 9, planObservations: 'Terapia 1x semana' },
    { id: 'p002', branchId: 'branch-2', name: 'Maria Santos', therapistId: 'therapist02', status: 'active', avatarUrl: 'https://picsum.photos/seed/maria/100', monthlyValue: 2000, paymentMethod: 'PIX', sessionsPerMonth: 8, taxPercentage: 0 },
];
const STUDENTS_STORAGE_KEY = 'equipe_rafael_barros_students';
const TEAM_STORAGE_KEY = 'equipe_rafael_barros_team';

const mockStaff: StaffMember[] = [
  { id: 'therapist01', branchId: 'branch-1', name: 'Dr. Carlos Alberto', role: 'Psicólogo', email: 'carlos.alberto@example.com', status: StaffStatus.ACTIVE },
  { id: 'therapist02', branchId: 'branch-2', name: 'Dra. Sofia Mendes', role: 'Fonoaudióloga', email: 'sofia.mendes@example.com', status: StaffStatus.ACTIVE },
];

// --- COMPONENTS ---

const StudentForm: React.FC<{ student?: Student | null; onSave: (student: Student) => void; onCancel: () => void; therapists: StaffMember[], currentUser: User }> = ({ student, onSave, onCancel, therapists, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || { 
      name: '', 
      status: 'active', 
      therapistId: currentUser.role === 'therapist' ? currentUser.id : '', 
      wantsMonthlyNFe: false, 
      sessionsPerMonth: 4, 
      taxPercentage: 0, 
      monthlyValue: 0,
      address: '',
      neighborhood: '',
      city: '',
      postalCode: '',
      guardianName: '',
      guardianEmail: '',
      guardianPhone: '',
      cpf: '',
      rg: '',
      dateOfBirth: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
        alert("Nome do aluno é obrigatório");
        return;
    }
    onSave(formData as Student);
  };

  return (
    <Card title={student ? "Editar Aluno" : "Adicionar Novo Aluno"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-1">Dados Pessoais</h4>
            <Input name="name" label="Nome Completo do Aluno" value={formData.name || ''} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="dateOfBirth" label="Data de Nascimento" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} />
                <Input name="rg" label="RG" value={formData.rg || ''} onChange={handleChange} />
                <Input name="cpf" label="CPF" value={formData.cpf || ''} onChange={handleChange} />
            </div>
        </div>

        {/* Guardian Info */}
        <div className="space-y-4">
             <h4 className="font-semibold text-slate-700 border-b pb-1">Dados do Responsável</h4>
             <Input name="guardianName" label="Nome do Responsável" value={formData.guardianName || ''} onChange={handleChange} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="guardianEmail" label="Email" type="email" value={formData.guardianEmail || ''} onChange={handleChange} />
                <Input name="guardianPhone" label="Telefone/WhatsApp" value={formData.guardianPhone || ''} onChange={handleChange} />
             </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-1">Endereço</h4>
            <Input name="address" label="Logradouro" value={formData.address || ''} onChange={handleChange} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="neighborhood" label="Bairro" value={formData.neighborhood || ''} onChange={handleChange} />
                <Input name="city" label="Cidade" value={formData.city || ''} onChange={handleChange} />
                <Input name="postalCode" label="CEP" value={formData.postalCode || ''} onChange={handleChange} />
            </div>
        </div>

        {/* Clinical & Plan */}
        <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-1">Plano e Atendimento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                    name="status" 
                    label="Status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    options={[{value: 'active', label: 'Ativo'}, {value: 'inactive', label: 'Inativo'}]} 
                />
                <Select 
                    name="therapistId" 
                    label="Terapeuta Responsável" 
                    value={formData.therapistId || ''} 
                    onChange={handleChange} 
                    options={therapists.map(t => ({value: t.id, label: t.name}))}
                    disabled={currentUser.role === 'therapist'}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Select 
                    name="paymentMethod" 
                    label="Método de Pagamento" 
                    value={formData.paymentMethod || ''} 
                    onChange={handleChange} 
                    options={[
                        {value: 'PIX', label: 'Pix'},
                        {value: 'DEBITO', label: 'Débito'},
                        {value: 'CREDITO_RECORRENTE', label: 'Crédito Recorrente'},
                        {value: 'FIDELIDADE_TRIMESTRAL', label: 'Fidelidade Trimestral'},
                        {value: 'FIDELIDADE_SEMESTRAL', label: 'Fidelidade Semestral'},
                        {value: 'FIDELIDADE_ANUAL', label: 'Fidelidade Anual'},
                    ]} 
                />
                <Select 
                    name="sessionsPerMonth" 
                    label="Sessões/Mês" 
                    value={formData.sessionsPerMonth || 4} 
                    onChange={handleChange} 
                    options={[
                        {value: 4, label: '4 Sessões'},
                        {value: 8, label: '8 Sessões'},
                        {value: 12, label: '12 Sessões'},
                        {value: 16, label: '16 Sessões'},
                        {value: 20, label: '20 Sessões'},
                    ]} 
                />
                <Input name="monthlyValue" label="Valor Mensal (R$)" type="number" step="0.01" value={formData.monthlyValue || 0} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 <Input name="taxPercentage" label="Taxa (%)" type="number" step="0.1" value={formData.taxPercentage || 0} onChange={handleChange} />
                 <div className="flex items-center pt-6">
                    <input 
                        type="checkbox" 
                        id="wantsMonthlyNFe" 
                        name="wantsMonthlyNFe" 
                        checked={formData.wantsMonthlyNFe || false} 
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="wantsMonthlyNFe" className="ml-2 block text-sm text-gray-900 dark:text-slate-300">
                        Emitir NF-e Mensalmente?
                    </label>
                 </div>
            </div>
             <div>
                <label htmlFor="planObservations" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Observações do Plano</label>
                <textarea 
                    id="planObservations" 
                    name="planObservations" 
                    value={formData.planObservations || ''} 
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-0 sm:text-sm text-slate-800 dark:text-slate-200 transition-colors focus:border-primary dark:focus:border-primary-light"
                />
            </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar Aluno</Button>
        </div>
      </form>
    </Card>
  );
};

const PatientManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedBranch } = useBranch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [students, setStudents] = useState<Student[]>(() => {
      try {
          const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
          return stored ? JSON.parse(stored) : mockStudentsData;
      } catch { return mockStudentsData; }
  });

  // Load therapists dynamically for the filter and form
  const [therapistsList, setTherapistsList] = useState<StaffMember[]>(() => {
      try {
          const stored = localStorage.getItem(TEAM_STORAGE_KEY);
          return stored ? JSON.parse(stored) : mockStaff;
      } catch { return mockStaff; }
  });

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // Search & Filter State
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTherapistFilter, setSelectedTherapistFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(''); // New status filter

  useEffect(() => {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Open modal if navigating from Dashboard "Add Patient" button
  useEffect(() => {
    if (location.state && (location.state as any).openAddModal) {
        setEditingStudent(null);
        setShowForm(true);
        // Clear state so it doesn't reopen on refresh
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  const filteredStudents = useMemo(() => {
      let filtered = students;

      // Filter by Branch (for admins)
      if (user?.role === 'ADMIN' && selectedBranch) {
          filtered = filtered.filter(s => s.branchId === selectedBranch.id);
      }

      // Filter by Therapist (Enforced Restriction for Therapists)
      if (user?.role === 'therapist') {
          filtered = filtered.filter(s => s.therapistId === user.id);
      } else if (selectedTherapistFilter) {
          // Admin Filter Selection
          filtered = filtered.filter(s => s.therapistId === selectedTherapistFilter);
      }

      // Filter by Status
      if (selectedStatusFilter) {
          filtered = filtered.filter(s => s.status === selectedStatusFilter);
      }

      // Filter by Search Term
      if (searchTerm.trim()) {
          const lowerTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(s => 
              s.name.toLowerCase().includes(lowerTerm) || 
              (s.guardianName && s.guardianName.toLowerCase().includes(lowerTerm))
          );
      }

      return filtered;
  }, [students, selectedBranch, user, searchTerm, selectedTherapistFilter, selectedStatusFilter]);

  const handleAddStudent = () => {
      setEditingStudent(null);
      setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
      setEditingStudent(student);
      setShowForm(true);
  };

  const handleDeleteStudent = (id: string) => {
      if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
          setStudents(prev => prev.filter(s => s.id !== id));
      }
  };

  const handleSaveStudent = (studentData: Student) => {
      if (editingStudent) {
          setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...studentData, id: s.id } : s));
      } else {
          const newStudent = {
              ...studentData,
              id: `student-${Date.now()}`,
              branchId: selectedBranch?.id || 'branch-1', // Default to branch-1 if none selected or fallback
              avatarUrl: `https://picsum.photos/seed/${Date.now()}/100`
          };
          setStudents(prev => [newStudent, ...prev]);
      }
      setShowForm(false);
      setEditingStudent(null);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Meus Alunos</h2>
        
        <div className="flex items-center space-x-2">
            {/* Search Toggle Button */}
            <Button 
                variant={showSearch ? "secondary" : "outline"} 
                onClick={() => {
                    setShowSearch(!showSearch);
                    if (showSearch) {
                        setSearchTerm(''); // Clear search when closing
                        setSelectedTherapistFilter(''); // Clear filter when closing
                        setSelectedStatusFilter(''); // Clear status filter
                    }
                }}
                leftIcon={showSearch ? <XMarkIcon className="w-5 h-5"/> : <MagnifyingGlassIcon className="w-5 h-5"/>}
            >
                {showSearch ? 'Fechar Busca' : 'Buscar/Filtrar Alunos'}
            </Button>

            {!showForm && (
                <Button onClick={handleAddStudent} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
                    Novo Aluno
                </Button>
            )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      {showSearch && (
          <Card className="animate-fade-in">
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nome do aluno ou responsável..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
                        autoFocus
                      />
                  </div>

                  {/* Status Filter */}
                  <div className="w-full md:w-1/4 relative">
                      <select 
                          value={selectedStatusFilter}
                          onChange={(e) => setSelectedStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent dark:text-white appearance-none"
                      >
                          <option value="">Todos os Status</option>
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                      </select>
                  </div>

                  {user.role === 'ADMIN' && (
                      <div className="w-full md:w-1/3 relative">
                          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <select 
                              value={selectedTherapistFilter}
                              onChange={(e) => setSelectedTherapistFilter(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent dark:text-white appearance-none"
                          >
                              <option value="">Todos os Terapeutas</option>
                              {therapistsList.filter(t => !selectedBranch || t.branchId === selectedBranch.id).map(therapist => (
                                  <option key={therapist.id} value={therapist.id}>
                                      {therapist.name}
                                  </option>
                              ))}
                          </select>
                      </div>
                  )}
              </div>
          </Card>
      )}

      {showForm ? (
          <StudentForm 
            student={editingStudent} 
            onSave={handleSaveStudent} 
            onCancel={() => setShowForm(false)} 
            therapists={therapistsList}
            currentUser={user}
          />
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                    <Card key={student.id} className="hover:shadow-xl transition-shadow duration-200 flex flex-col">
                        <div className="p-4 flex-grow">
                            <div className="flex items-center space-x-4 mb-4">
                                <img src={student.avatarUrl || 'https://via.placeholder.com/100'} alt={student.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600" />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate" title={student.name}>{student.name}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {student.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                {student.guardianName && <p><span className="font-medium">Resp:</span> {student.guardianName}</p>}
                                
                                {/* Exibição dos Detalhes do Plano */}
                                <div className="bg-slate-50 dark:bg-slate-700/40 p-2 rounded border border-slate-100 dark:border-slate-600 mt-2 mb-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Sessões Mensais:</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{student.sessionsPerMonth || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Valor Mensal:</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            {student.monthlyValue ? `R$ ${student.monthlyValue.toFixed(2)}` : 'R$ 0,00'}
                                        </span>
                                    </div>
                                </div>

                                <p><span className="font-medium">Terapeuta:</span> {therapistsList.find(t => t.id === student.therapistId)?.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                             <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => navigate(`/alunos/${student.id}`)}
                                title="Ver Detalhes"
                                className="text-primary hover:text-primary-dark"
                             >
                                 <div className="flex items-center space-x-1">
                                     <EyeIcon className="w-4 h-4" />
                                     <span>Detalhes</span>
                                 </div>
                             </Button>
                             <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" onClick={() => handleEditStudent(student)}><PencilIcon className="w-4 h-4 text-slate-500" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteStudent(student.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                             </div>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                     <p className="text-slate-500 text-lg">Nenhum aluno encontrado.</p>
                     {(searchTerm || selectedTherapistFilter || selectedStatusFilter) && <p className="text-slate-400 text-sm">Tente ajustar os filtros da busca.</p>}
                </div>
            )}
          </div>
      )}
    </div>
  );
};

export default PatientManagementPage;
