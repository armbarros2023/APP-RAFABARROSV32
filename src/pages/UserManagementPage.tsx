
import React, { useState, useMemo, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { User, Branch } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useBranch } from '../contexts/BranchContext';
import { PlusCircleIcon, PencilIcon, TrashIcon, KeyIcon, IdentificationIcon, BuildingOfficeIcon } from '../components/icons/HeroIcons';

// Database Keys (Must match AuthContext)
const USERS_DB_KEY = 'equipe_rafael_barros_users_db';

// Mock data for fallback if localStorage is empty
const mockUsers: User[] = [
  { id: 'ADMIN01', name: 'ADMIN', email: 'ADMIN@equiperafaelbarros.com', role: 'ADMIN' },
  { id: 'therapist01', name: 'Dr. Carlos', email: 'carlos@equiperafaelbarros.com', role: 'THERAPIST' },
  { id: 'therapist02', name: 'Dra. Sofia', email: 'sofia@equiperafaelbarros.com', role: 'THERAPIST' },
];

const UserForm: React.FC<{ userToEdit?: User | null; onSave: (user: Partial<User & { password?: string }>) => void; onCancel: () => void; }> = ({ userToEdit, onSave, onCancel }) => {
  const isEditing = !!userToEdit;
  const [formData, setFormData] = useState<Partial<User & { password?: string, confirmPassword?: string }>>(
    userToEdit || { name: '', email: '', role: 'THERAPIST', password: '', confirmPassword: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      alert("Nome, email e função são obrigatórios.");
      return;
    }
    if (!isEditing) {
      if (!formData.password) {
        alert("Senha é obrigatória para novos usuários.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }
    }
    onSave(formData);
  };

  return (
    <Card title={isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" label="Nome Completo" value={formData.name || ''} onChange={handleChange} required />
        <Input name="email" label="Email" type="email" value={formData.email || ''} onChange={handleChange} required />
        <Select
          name="role"
          label="Função"
          value={formData.role}
          onChange={handleChange}
          options={[{ value: 'ADMIN', label: 'Administrador' }, { value: 'THERAPIST', label: 'Terapeuta' }]}
          required
        />
        {!isEditing && (
          <>
            <Input name="password" label="Senha" type="password" value={formData.password || ''} onChange={handleChange} required />
            <Input name="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword || ''} onChange={handleChange} required />
          </>
        )}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Card>
  );
};

const BranchForm: React.FC<{ branch?: Branch | null; onSave: (branch: Branch) => void; onCancel: () => void; }> = ({ branch, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Branch>>(branch || { name: '', address: '', phone: '', cnpj: '', stateRegistration: '', email: '', responsible: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("O nome da filial é obrigatório.");
      return;
    }
    onSave(formData as Branch);
  };

  return (
    <Card title={branch?.id ? "Editar Filial" : "Adicionar Nova Filial"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" label="Nome da Filial" value={formData.name || ''} onChange={handleChange} required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="cnpj" label="CNPJ" value={formData.cnpj || ''} onChange={handleChange} />
          <Input name="stateRegistration" label="Inscrição Estadual" value={formData.stateRegistration || ''} onChange={handleChange} />
        </div>
        <Input name="address" label="Endereço" value={formData.address || ''} onChange={handleChange} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="email" label="Email da Filial" type="email" value={formData.email || ''} onChange={handleChange} />
          <Input name="phone" label="Telefone" value={formData.phone || ''} onChange={handleChange} />
        </div>
        <Input name="responsible" label="Responsável" value={formData.responsible || ''} onChange={handleChange} />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Card>
  );
};

const UserManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { branches, addBranch, updateBranch, deleteBranch } = useBranch();
  const [activeTab, setActiveTab] = useState<'users' | 'branches'>('users');

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = window.localStorage.getItem(USERS_DB_KEY);
      return storedUsers ? JSON.parse(storedUsers) : mockUsers;
    } catch (error) {
      console.error("Error reading users from localStorage", error);
      return mockUsers;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error writing users to localStorage", error);
    }
  }, [users]);

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  if (currentUser?.role !== 'ADMIN') {
    return (
      <Card title="Acesso Negado">
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-300">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Esta página é restrita a ADMINistradores.</p>
        </div>
      </Card>
    );
  }

  // User Management Handlers
  const handleAddUser = () => { setEditingUser(null); setShowUserForm(true); };
  const handleEditUser = (user: User) => { setEditingUser(user); setShowUserForm(true); };

  const handleSaveUser = (userData: Partial<User & { password?: string }>) => {
    if (editingUser) {
      // Update existing
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
      alert("Usuário atualizado com sucesso.");
    } else {
      // Create new with Secure ID
      const newId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `user-${Date.now()}`;

      const newUser: User & { password?: string } = {
        id: newId,
        name: userData.name!,
        email: userData.email!,
        role: userData.role!,
        password: userData.password // In a real app, this should be hashed here or in backend
      };
      setUsers(prev => [newUser, ...prev]);
      alert(`Usuário ${newUser.name} criado. A senha foi salva (simulação) para login.`);
    }
    setShowUserForm(false); setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) { alert("Você não pode excluir sua própria conta de usuário."); return; }
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) { setUsers(prev => prev.filter(u => u.id !== id)); }
  };
  const handleResetPassword = (email: string) => { alert(`Um email para redefinição de senha seria enviado para ${email}.`); };

  // Branch Management Handlers
  const handleAddBranch = () => { setEditingBranch(null); setShowBranchForm(true); };
  const handleEditBranch = (branch: Branch) => { setEditingBranch(branch); setShowBranchForm(true); };
  const handleSaveBranch = (branchData: Branch) => {
    if (editingBranch) {
      updateBranch(editingBranch.id, branchData);
    } else {
      addBranch(branchData);
    }
    setShowBranchForm(false); setEditingBranch(null);
  };
  const handleDeleteBranch = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta filial?")) { deleteBranch(id); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <IdentificationIcon className="h-8 w-8 text-primary dark:text-primary-light" />
          <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Usuários e Filiais</h2>
        </div>
        {activeTab === 'users' && !showUserForm && (
          <Button onClick={handleAddUser} leftIcon={<PlusCircleIcon className="w-5 h-5" />}>Novo Usuário</Button>
        )}
        {activeTab === 'branches' && !showBranchForm && (
          <Button onClick={handleAddBranch} leftIcon={<PlusCircleIcon className="w-5 h-5" />}>Nova Filial</Button>
        )}
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-primary dark:border-primary-light text-primary dark:text-primary-light' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}>
            <IdentificationIcon className="h-5 w-5" /> <span>Gerenciar Usuários</span>
          </button>
          <button onClick={() => setActiveTab('branches')} className={`${activeTab === 'branches' ? 'border-primary dark:border-primary-light text-primary dark:text-primary-light' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}>
            <BuildingOfficeIcon className="h-5 w-5" /> <span>Gerenciar Filiais</span>
          </button>
        </nav>
      </div>

      {activeTab === 'users' && (
        showUserForm ? (
          <UserForm userToEdit={editingUser} onSave={handleSaveUser} onCancel={() => setShowUserForm(false)} />
        ) : (
          <Card title="Usuários do Sistema">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.map(user => (
                <div key={user.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                    <span className={`px-2 py-0.5 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-primary/20 text-primary-dark dark:bg-primary-light/20 dark:text-primary-light' : 'bg-secondary/20 text-secondary-dark dark:bg-secondary-light/20 dark:text-secondary-light'}`}>
                      {user.role === 'ADMIN' ? 'Administrador' : 'Terapeuta'}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <Button size="sm" variant="ghost" onClick={() => handleResetPassword(user.email)} title="Redefinir Senha"><KeyIcon className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEditUser(user)} title="Editar"><PencilIcon className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user.id)} title="Excluir"><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      )}

      {activeTab === 'branches' && (
        showBranchForm ? (
          <BranchForm branch={editingBranch} onSave={handleSaveBranch} onCancel={() => setShowBranchForm(false)} />
        ) : (
          <Card title="Filiais Cadastradas">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {branches.map(branch => (
                <div key={branch.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{branch.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{branch.address || 'Endereço não informado'}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {branch.cnpj && <span><strong>CNPJ:</strong> {branch.cnpj}</span>}
                      {branch.email && <span><strong>Email:</strong> {branch.email}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <Button size="sm" variant="ghost" onClick={() => handleEditBranch(branch)} title="Editar"><PencilIcon className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteBranch(branch.id)} title="Excluir"><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      )}
    </div>
  );
};

export default UserManagementPage;
