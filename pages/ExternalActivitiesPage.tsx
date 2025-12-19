import React, { useState, useMemo, useCallback, ChangeEvent } from 'react';
import Card from '../components/ui/Card';
import Table, { TableColumn } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ExternalActivity } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, BuildingStorefrontIcon } from '../components/icons/HeroIcons';

const mockActivities: ExternalActivity[] = [
  { id: 'ext001', name: 'Palestra sobre Desenvolvimento Infantil', date: '2024-05-15', revenue: 500, expenses: 50, description: 'Palestra na Escola Aprender Mais' },
  { id: 'ext002', name: 'Curso Online: Estratégias para TEA', date: '2024-06-20', revenue: 1200, expenses: 150, description: 'Curso de 4 semanas' },
  { id: 'ext003', name: 'Workshop para Pais', date: '2024-07-10', revenue: 800, expenses: 80, description: 'Workshop prático na comunidade' },
];

const ExternalActivityForm: React.FC<{ activity?: ExternalActivity | null; onSave: (activity: ExternalActivity) => void; onCancel: () => void; }> =
({ activity, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ExternalActivity>>(
        activity || { name: '', date: new Date().toISOString().split('T')[0], revenue: 0, expenses: 0 }
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add validation in a real app
        onSave(formData as ExternalActivity);
    };

    return (
        <Card title={activity?.id ? "Editar Atividade Externa" : "Registrar Nova Atividade Externa"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" label="Nome da Atividade/Evento" value={formData.name || ''} onChange={handleChange} required />
                <Input name="date" label="Data" type="date" value={formData.date || ''} onChange={handleChange} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="revenue" label="Receita (R$)" type="number" step="0.01" value={formData.revenue || 0} onChange={handleChange} required />
                    <Input name="expenses" label="Despesas (R$)" type="number" step="0.01" value={formData.expenses || 0} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descrição (opcional)</label>
                    <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Atividade</Button>
                </div>
            </form>
        </Card>
    );
};

const ExternalActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<ExternalActivity[]>(mockActivities);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ExternalActivity | null>(null);

  const handleAddActivity = useCallback(() => {
    setEditingActivity(null);
    setShowForm(true);
  }, []);

  const handleEditActivity = useCallback((activity: ExternalActivity) => {
    setEditingActivity(activity);
    setShowForm(true);
  }, []);

  const handleSaveActivity = useCallback((activityData: ExternalActivity) => {
    if (editingActivity) {
      setActivities(prev => prev.map(act => act.id === editingActivity.id ? { ...act, ...activityData, id: act.id } : act));
    } else {
      setActivities(prev => [{ ...activityData, id: String(Date.now()) }, ...prev]);
    }
    setShowForm(false);
    setEditingActivity(null);
  }, [editingActivity]);

  const handleDeleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  }, []);

  const columns: TableColumn<ExternalActivity>[] = useMemo(() => [
    { header: 'Nome da Atividade', accessor: 'name' },
    { header: 'Data', accessor: (item: ExternalActivity) => new Date(item.date).toLocaleDateString('pt-BR') },
    { header: 'Receita (R$)', accessor: (item: ExternalActivity) => item.revenue.toFixed(2), className: 'text-green-600 text-right' },
    { header: 'Despesas (R$)', accessor: (item: ExternalActivity) => item.expenses.toFixed(2), className: 'text-red-600 text-right' },
    { header: 'Lucro (R$)', accessor: (item: ExternalActivity) => (item.revenue - item.expenses).toFixed(2), className: 'text-blue-600 font-semibold text-right' },
    { header: 'Ações', accessor: (item: ExternalActivity) => (
      <div className="space-x-1">
        <Button size="sm" variant="ghost" onClick={() => handleEditActivity(item)} title="Editar"><PencilIcon className="w-4 h-4"/></Button>
        <Button size="sm" variant="ghost" onClick={() => handleDeleteActivity(item.id)} title="Excluir"><TrashIcon className="w-4 h-4 text-red-500"/></Button>
      </div>
    )}
  ], [handleEditActivity, handleDeleteActivity]);

  const totalExternalRevenue = useMemo(() => activities.reduce((sum, act) => sum + act.revenue, 0), [activities]);
  const totalExternalExpenses = useMemo(() => activities.reduce((sum, act) => sum + act.expenses, 0), [activities]);
  const totalExternalProfit = totalExternalRevenue - totalExternalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-slate-800">Minhas Atividades Externas</h2>
        <Button onClick={handleAddActivity} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
          Registrar Atividade
        </Button>
      </div>

      <p className="text-slate-600">
        Gerencie aqui as receitas de atividades não diretamente relacionadas às clínicas, como palestras e cursos.
        Os relatórios financeiros dessas atividades são mantidos separados do faturamento da clínica.
      </p>

      {showForm && <ExternalActivityForm activity={editingActivity} onSave={handleSaveActivity} onCancel={() => { setShowForm(false); setEditingActivity(null);}} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Receita Externa Total" bodyClassName="text-center">
            <p className="text-3xl font-bold text-green-600">R$ {totalExternalRevenue.toFixed(2)}</p>
        </Card>
        <Card title="Despesas Externas Totais" bodyClassName="text-center">
            <p className="text-3xl font-bold text-red-600">R$ {totalExternalExpenses.toFixed(2)}</p>
        </Card>
        <Card title="Lucro Externo Total" bodyClassName="text-center">
            <p className={`text-3xl font-bold ${totalExternalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>R$ {totalExternalProfit.toFixed(2)}</p>
        </Card>
      </div>

      <Card title="Registro de Atividades Externas">
        {activities.length > 0 ? (
          <Table columns={columns} data={activities} />
        ) : (
          <div className="text-center py-8">
            <BuildingStorefrontIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhuma atividade externa registrada.</p>
          </div>
        )}
      </Card>

      <Card title="Relatórios Financeiros (Atividades Externas)">
        <p className="text-slate-600">Relatórios detalhados sobre o desempenho financeiro das atividades externas serão disponibilizados aqui.</p>
        {/* Placeholder for charts or more detailed reports */}
        <div className="mt-4">
            <Button 
              variant="outline" 
              disabled 
              title="Funcionalidade de gerar relatório detalhado (PDF) em desenvolvimento."
            >
              Gerar Relatório Detalhado (PDF) (Em breve)
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExternalActivitiesPage;