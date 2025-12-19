
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { StaffMember, StaffStatus } from '../types';
import { useBranch } from '../contexts/BranchContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon, DocumentArrowUpIcon, BookOpenIcon, FunnelIcon, XMarkIcon } from '../components/icons/HeroIcons';

const mockTeam: StaffMember[] = [
  { id: '1', branchId: 'branch-1', name: 'Dr. Ana Silva', role: 'Psicóloga', email: 'ana.silva@clinic.com', secondaryEmail: 'ana.pessoal@gmail.com', status: StaffStatus.ACTIVE, avatarUrl: 'https://picsum.photos/seed/ana/100/100', specialty: 'Infantil', documents: [{name: 'Diploma.pdf', url:'#'}], contractUrl: '#', admissionDate: '2023-01-15' },
  { id: '2', branchId: 'branch-1', name: 'Carlos Pereira', role: 'Fonoaudiólogo', email: 'carlos.pereira@clinic.com', status: StaffStatus.ACTIVE, avatarUrl: 'https://picsum.photos/seed/carlos/100/100', specialty: 'TEA', bankInfo: 'Banco X, Ag:001, CC:12345', admissionDate: '2023-06-01' },
  { id: '3', branchId: 'branch-1', name: 'Mariana Costa (Ex)', role: 'Terapeuta Ocupacional', email: 'mariana.costa@clinic.com', status: StaffStatus.INACTIVE, avatarUrl: 'https://picsum.photos/seed/mariana/100/100', specialty: 'Integração Sensorial', admissionDate: '2022-01-10', terminationDate: '2023-12-20' },
];

const TEAM_STORAGE_KEY = 'equipe_rafael_barros_team';

const TeamManagementPage: React.FC = () => {
  const [team, setTeam] = useState<StaffMember[]>(() => {
    try {
        const storedTeam = window.localStorage.getItem(TEAM_STORAGE_KEY);
        return storedTeam ? JSON.parse(storedTeam) : mockTeam;
    } catch (error) { return mockTeam; }
  });
  
  const { selectedBranch } = useBranch();
  const [activeTab, setActiveTab] = useState<'welcome' | 'profiles' | 'financial'>('profiles');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<Partial<StaffMember>>({});

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => { window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team)); }, [team]);
  
  const filteredTeam = useMemo(() => {
      let result = selectedBranch ? team.filter(m => m.branchId === selectedBranch.id) : team;

      // Filter Logic: Active during the selected period
      // A member is active in the period if:
      // 1. Admission Date is before or on Filter End Date
      // 2. AND (Termination Date is null OR Termination Date is after or on Filter Start Date)
      
      if (filterStartDate || filterEndDate) {
          result = result.filter(member => {
              const startDate = filterStartDate ? new Date(filterStartDate) : new Date('2000-01-01'); // Default very old start
              const endDate = filterEndDate ? new Date(filterEndDate) : new Date('2100-01-01'); // Default future end
              
              const admission = member.admissionDate ? new Date(member.admissionDate) : new Date(startDate); // If no admission, assume active from start of query for compatibility
              const termination = member.terminationDate ? new Date(member.terminationDate) : null;

              // Check overlap
              const hiredBeforeEnd = admission <= endDate;
              const notTerminatedBeforeStart = termination === null || termination >= startDate;

              return hiredBeforeEnd && notTerminatedBeforeStart;
          });
      }

      return result;
  }, [team, selectedBranch, filterStartDate, filterEndDate]);

  const handleAddNew = () => {
      setEditingMember(null);
      setFormData({
          branchId: selectedBranch?.id || '',
          status: StaffStatus.ACTIVE,
          role: 'Psicólogo',
          admissionDate: new Date().toISOString().split('T')[0] // Default to today
      });
      setShowForm(true);
  };

  const handleEdit = (member: StaffMember) => {
      setEditingMember(member);
      setFormData(member);
      setShowForm(true);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Tem certeza que deseja remover este membro?')) {
          setTeam(prev => prev.filter(m => m.id !== id));
      }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.email) {
          alert("Nome e Email são obrigatórios");
          return;
      }
      
      if (editingMember) {
          setTeam(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...formData } as StaffMember : m));
      } else {
          const newMember = {
              ...formData,
              id: `staff-${Date.now()}`,
              branchId: selectedBranch?.id || 'branch-1',
              avatarUrl: `https://picsum.photos/seed/${Date.now()}/100`,
          } as StaffMember;
          setTeam(prev => [newMember, ...prev]);
      }
      setShowForm(false);
  };

  const clearFilters = () => {
      setFilterStartDate('');
      setFilterEndDate('');
      setShowFilters(false);
  };

  // --- "Seja Bem Vindo" Section Content ---
  const renderWelcomeSection = () => (
      <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Bem-vindo(a) à Equipe!</h3>
              <p className="text-slate-700 dark:text-slate-300">Aqui você encontra todos os recursos necessários para o seu dia a dia na clínica.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Documentação Obrigatória">
                  <ul className="space-y-3">
                      <li className="flex justify-between items-center p-2 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer">
                          <span className="flex items-center"><DocumentArrowUpIcon className="w-5 h-5 mr-2 text-slate-500"/> Contrato de Prestação de Serviços</span>
                          <span className="text-xs text-blue-600 font-semibold">Baixar PDF</span>
                      </li>
                      <li className="flex justify-between items-center p-2 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer">
                          <span className="flex items-center"><DocumentArrowUpIcon className="w-5 h-5 mr-2 text-slate-500"/> Termo de Convivência e Conduta</span>
                          <span className="text-xs text-blue-600 font-semibold">Baixar PDF</span>
                      </li>
                  </ul>
              </Card>

              <Card title="Treinamento e Orientação">
                  <ul className="space-y-3">
                      <li className="flex items-center p-2 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer">
                          <BookOpenIcon className="w-5 h-5 mr-2 text-purple-500"/>
                          <span>Vídeos de Orientação (Onboarding)</span>
                      </li>
                      <li className="flex items-center p-2 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer">
                          <BookOpenIcon className="w-5 h-5 mr-2 text-purple-500"/>
                          <span>Artigos Científicos Compartilhados</span>
                      </li>
                      <li className="flex items-center p-2 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer">
                          <BookOpenIcon className="w-5 h-5 mr-2 text-purple-500"/>
                          <span>Vídeos de Feedback dos Alunos</span>
                      </li>
                  </ul>
              </Card>
          </div>
      </div>
  );

  // --- Financial / Receipts Section ---
  const renderFinancialSection = () => (
      <Card title="Minha Receita e Recibos">
          <p className="text-slate-600 mb-4">Acompanhe seus atendimentos e valores a receber.</p>
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Período</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Atendimentos</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Valor a Receber</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Ação</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                      <tr>
                          <td className="px-6 py-4 text-sm">Julho/2024</td>
                          <td className="px-6 py-4 text-sm">45 Sessões</td>
                          <td className="px-6 py-4 text-sm text-right font-bold text-green-600">R$ 2.250,00</td>
                          <td className="px-6 py-4 text-sm text-center"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span></td>
                          <td className="px-6 py-4 text-sm text-center">
                              <Button size="sm" variant="outline">Gerar Recibo para Assinatura</Button>
                          </td>
                      </tr>
                       <tr>
                          <td className="px-6 py-4 text-sm">Junho/2024</td>
                          <td className="px-6 py-4 text-sm">40 Sessões</td>
                          <td className="px-6 py-4 text-sm text-right font-bold text-green-600">R$ 2.000,00</td>
                          <td className="px-6 py-4 text-sm text-center"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pago</span></td>
                          <td className="px-6 py-4 text-sm text-center">
                             <span className="text-xs text-gray-500">Recibo Entregue</span>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-3xl font-semibold text-slate-800">Gestão de Equipe</h2>
        <div className="flex space-x-2">
            {activeTab === 'profiles' && !showForm && (
                <Button 
                    variant={showFilters ? "secondary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)} 
                    leftIcon={showFilters ? <XMarkIcon className="w-5 h-5"/> : <FunnelIcon className="w-5 h-5"/>}
                >
                    {showFilters ? 'Fechar Filtros' : 'Filtrar por Período'}
                </Button>
            )}
            {activeTab === 'profiles' && !showForm && (
                <Button leftIcon={<PlusCircleIcon className="w-5 h-5"/>} onClick={handleAddNew}>Novo Membro</Button>
            )}
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('profiles')} className={`${activeTab === 'profiles' ? 'border-primary text-primary' : 'border-transparent text-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Perfis e Cadastro</button>
          <button onClick={() => setActiveTab('welcome')} className={`${activeTab === 'welcome' ? 'border-primary text-primary' : 'border-transparent text-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Seja Bem Vindo (Docs/Treino)</button>
          <button onClick={() => setActiveTab('financial')} className={`${activeTab === 'financial' ? 'border-primary text-primary' : 'border-transparent text-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Receita e Recibos</button>
        </nav>
      </div>

      {activeTab === 'welcome' && renderWelcomeSection()}
      {activeTab === 'financial' && renderFinancialSection()}

      {activeTab === 'profiles' && !showForm && (
          <div className="space-y-6">
            
            {showFilters && (
                <Card className="bg-slate-50 dark:bg-slate-800/50 animate-fade-in border border-primary/20">
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <Input 
                            label="Data Início (Período)" 
                            type="date" 
                            value={filterStartDate} 
                            onChange={(e) => setFilterStartDate(e.target.value)} 
                            wrapperClassName="!mb-0 w-full md:w-1/3"
                        />
                        <Input 
                            label="Data Fim (Período)" 
                            type="date" 
                            value={filterEndDate} 
                            onChange={(e) => setFilterEndDate(e.target.value)} 
                            wrapperClassName="!mb-0 w-full md:w-1/3"
                        />
                        <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-slate-700">
                            Limpar Filtros
                        </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic">Exibindo membros ativos dentro do intervalo selecionado (Intersecção entre contrato e filtro).</p>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeam.length > 0 ? (
                    filteredTeam.map(member => (
                    <Card key={member.id} className="flex flex-col">
                        <div className="p-4 flex-grow">
                        <div className="flex items-center space-x-4 mb-3">
                            <img src={member.avatarUrl || 'https://picsum.photos/100'} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                            <div>
                            <h4 className="text-lg font-semibold text-slate-800">{member.name}</h4>
                            <p className="text-sm text-slate-600">{member.role}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1"><span className="font-medium">Email:</span> {member.email}</p>
                        {member.secondaryEmail && <p className="text-sm text-slate-500 mb-1"><span className="font-medium">Email Sec.:</span> {member.secondaryEmail}</p>}
                        
                        <div className="mt-2 mb-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                            <p><span className="font-semibold">Admissão:</span> {member.admissionDate ? new Date(member.admissionDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            {member.terminationDate && <p><span className="font-semibold text-red-500">Desligamento:</span> {new Date(member.terminationDate).toLocaleDateString('pt-BR')}</p>}
                        </div>

                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === StaffStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {member.status}
                        </span>
                        <div className="mt-4 pt-2 border-t border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Anexos</p>
                            <Button size="sm" variant="ghost" leftIcon={<DocumentArrowUpIcon className="w-4 h-4"/>}>Anexar Docs Pessoais/Diploma</Button>
                        </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
                        <Button size="sm" variant="ghost"><EyeIcon className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(member)}><PencilIcon className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(member.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                        </div>
                    </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-slate-500">Nenhum membro da equipe encontrado para os filtros selecionados.</p>
                    </div>
                )}
            </div>
        </div>
      )}
      
      {showForm && (
          <Card title={editingMember ? "Editar Membro" : "Adicionar Membro"}>
              <form onSubmit={handleSave} className="space-y-4">
                  <Input 
                      label="Nome Completo" 
                      name="name" 
                      value={formData.name || ''} 
                      onChange={handleFormChange} 
                      required 
                  />
                  <Input 
                      label="Email Principal" 
                      name="email" 
                      type="email"
                      value={formData.email || ''} 
                      onChange={handleFormChange} 
                      required 
                  />
                   <Input 
                      label="Email Secundário (Configurável)" 
                      name="secondaryEmail" 
                      type="email"
                      value={formData.secondaryEmail || ''} 
                      onChange={handleFormChange} 
                      placeholder="Ex: email.pessoal@exemplo.com"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Select
                          label="Função/Cargo"
                          name="role"
                          value={formData.role}
                          onChange={handleFormChange}
                          options={[
                              { value: 'Psicólogo', label: 'Psicólogo(a)' },
                              { value: 'Fonoaudiólogo', label: 'Fonoaudiólogo(a)' },
                              { value: 'Terapeuta Ocupacional', label: 'Terapeuta Ocupacional' },
                              { value: 'Psicopedagogo', label: 'Psicopedagogo(a)' },
                              { value: 'Musicoterapeuta', label: 'Musicoterapeuta' },
                              { value: 'Administrativo', label: 'Administrativo' },
                          ]}
                      />
                      <Input 
                          label="Especialidade" 
                          name="specialty" 
                          value={formData.specialty || ''} 
                          onChange={handleFormChange} 
                          placeholder="Ex: TEA, Infantil, Neuropsicologia"
                      />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Input 
                          label="Telefone" 
                          name="phone" 
                          value={formData.phone || ''} 
                          onChange={handleFormChange} 
                      />
                       <Select
                          label="Status"
                          name="status"
                          value={formData.status}
                          onChange={handleFormChange}
                          options={[
                              { value: StaffStatus.ACTIVE, label: 'Ativo' },
                              { value: StaffStatus.ON_VACATION, label: 'Férias' },
                              { value: StaffStatus.INACTIVE, label: 'Inativo' },
                          ]}
                      />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-200">
                        <Input 
                            label="Data de Admissão" 
                            name="admissionDate" 
                            type="date"
                            value={formData.admissionDate || ''} 
                            onChange={handleFormChange} 
                        />
                        <Input 
                            label="Data de Desligamento" 
                            name="terminationDate" 
                            type="date"
                            value={formData.terminationDate || ''} 
                            onChange={handleFormChange} 
                            placeholder="Se aplicável"
                        />
                  </div>

                  <Input 
                      label="Informações Bancárias" 
                      name="bankInfo" 
                      value={formData.bankInfo || ''} 
                      onChange={handleFormChange} 
                      placeholder="Banco, Agência, Conta, PIX..."
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                  </div>
              </form>
          </Card>
      )}
    </div>
  );
};

export default TeamManagementPage;
