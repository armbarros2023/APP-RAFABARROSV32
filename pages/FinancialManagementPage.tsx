
// ... (imports remain similar but added Recharts)
import React, { useState, useMemo, useCallback } from 'react';
import Card from '../components/ui/Card';
import Table, { TableColumn } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { FinancialTransaction, FinancialCategory } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon, PresentationChartLineIcon, PrinterIcon, DocumentChartBarIcon, CurrencyDollarIcon, FunnelIcon } from '../components/icons/HeroIcons';
import { useBranch } from '../contexts/BranchContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ... (mockTransactions remain the same) ...
const mockTransactions: FinancialTransaction[] = [
  { id: '1', date: '2024-07-01', description: 'Mensalidade Lucas Silva', amount: 1080, type: 'revenue', category: 'RECEITA_ATENDIMENTO', branchId: 'branch-1', status: 'paid', nfeNumber: '2024001', dueDate: '2024-07-01' },
  { id: '2', date: '2024-07-05', description: 'Venda Curso TEA', amount: 500, type: 'revenue', category: 'RECEITA_CURSO', branchId: 'branch-1', status: 'paid', dueDate: '2024-07-05' },
  { id: '3', date: '2024-07-10', description: 'Aluguel Clínica', amount: 2500, type: 'expense', category: 'CUSTO_FIXO', branchId: 'branch-1', status: 'paid', dueDate: '2024-07-10' },
  { id: '4', date: '2024-07-28', description: 'Conta de Luz', amount: 450, type: 'expense', category: 'CUSTO_FIXO', branchId: 'branch-1', status: 'pending', dueDate: '2024-07-30' },
  { id: '5', date: '2024-08-05', description: 'Mensalidade Maria Santos', amount: 2000, type: 'revenue', category: 'RECEITA_ATENDIMENTO', branchId: 'branch-1', status: 'pending', dueDate: '2024-08-05' },
  { id: '6', date: '2024-07-15', description: 'Taxa Cartão', amount: 45, type: 'expense', category: 'CUSTO_VARIAVEL', branchId: 'branch-1', status: 'paid', dueDate: '2024-07-15' },
  { id: '7', date: '2024-07-20', description: 'Venda Kit Sensorial', amount: 150, type: 'revenue', category: 'RECEITA_KIT', branchId: 'branch-1', status: 'paid', nfeNumber: '2024002', dueDate: '2024-07-20' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300'];

const FinancialManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cashflow' | 'reports'>('cashflow');
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [showForm, setShowForm] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Partial<FinancialTransaction> | null>(null);
  const { selectedBranch } = useBranch();

  // Filters for Reports
  const [reportStartDate, setReportStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [reportEndDate, setReportEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);

  const filteredTransactions = useMemo(() => {
    if (!selectedBranch) return transactions;
    return transactions.filter(t => t.branchId === selectedBranch.id);
  }, [transactions, selectedBranch]);

  // Report Filter Logic
  const reportTransactions = useMemo(() => {
      return filteredTransactions.filter(t => {
          const tDate = t.date;
          return tDate >= reportStartDate && tDate <= reportEndDate;
      });
  }, [filteredTransactions, reportStartDate, reportEndDate]);

  // --- Aggregations for Reports ---
  const accountsPayable = useMemo(() => 
      reportTransactions.filter(t => t.type === 'expense' && t.status === 'pending')
  , [reportTransactions]);

  const accountsReceivable = useMemo(() => 
      reportTransactions.filter(t => t.type === 'revenue' && t.status === 'pending')
  , [reportTransactions]);

  const issuedInvoices = useMemo(() => 
      reportTransactions.filter(t => t.type === 'revenue' && t.nfeNumber)
  , [reportTransactions]);

  const totalPayable = accountsPayable.reduce((acc, t) => acc + t.amount, 0);
  const totalReceivable = accountsReceivable.reduce((acc, t) => acc + t.amount, 0);

  // Helper to get readable category names
  const getCategoryLabel = (cat: FinancialCategory) => {
      switch(cat) {
          case 'RECEITA_ATENDIMENTO': return 'Receita Atendimentos';
          case 'RECEITA_CURSO': return 'Receita Cursos';
          case 'RECEITA_KIT': return 'Receita Kit';
          case 'CUSTO_FIXO': return 'Custos Fixos';
          case 'CUSTO_VARIAVEL': return 'Custos Variáveis';
          case 'INVESTIMENTO': return 'Investimentos';
          case 'CAPITAL_GIRO': return 'Capital de Giro';
          default: return cat;
      }
  };

  // --- Charts Data Preparation ---
  const barChartData = useMemo(() => {
      const data: Record<string, { name: string; receita: number; despesa: number }> = {};
      
      // Use filteredTransactions (all time) or reportTransactions (filtered)? 
      // Usually charts show a wider range or the selected range. Let's use reportTransactions for consistency with filters
      // OR filteredTransactions to show trend. Let's use filteredTransactions but sort properly.
      
      const sourceData = activeTab === 'reports' ? reportTransactions : filteredTransactions;

      sourceData.forEach(t => {
          const date = new Date(t.date);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const name = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

          if (!data[key]) {
              data[key] = { name, receita: 0, despesa: 0 };
          }

          if (t.type === 'revenue') {
              data[key].receita += t.amount;
          } else {
              data[key].despesa += t.amount;
          }
      });

      // Convert to array and sort by key (date)
      return Object.entries(data)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([, value]) => value);
  }, [reportTransactions, filteredTransactions, activeTab]);

  const pieChartData = useMemo(() => {
      const data: Record<string, number> = {};
      const sourceData = activeTab === 'reports' ? reportTransactions : filteredTransactions;

      sourceData
          .filter(t => t.type === 'expense')
          .forEach(t => {
              const cat = getCategoryLabel(t.category);
              data[cat] = (data[cat] || 0) + t.amount;
          });

      return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [reportTransactions, filteredTransactions, activeTab]);


  const handleAdd = useCallback(() => {
    setCurrentTransaction({ type: 'revenue', date: new Date().toISOString().split('T')[0], status: 'paid', taxPercentage: 0 });
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((transaction: FinancialTransaction) => {
    setCurrentTransaction(transaction);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if(window.confirm("Tem certeza?")) setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBranch) { alert("Selecione uma filial."); return; }
    const formData = new FormData(e.currentTarget);
    
    const newTransactionData: FinancialTransaction = {
      id: currentTransaction?.id || String(Date.now()),
      date: formData.get('date') as string,
      dueDate: formData.get('dueDate') as string || formData.get('date') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      taxPercentage: parseFloat(formData.get('taxPercentage') as string) || 0,
      type: formData.get('type') as 'revenue' | 'expense',
      category: formData.get('category') as FinancialCategory,
      status: formData.get('status') as 'paid' | 'pending',
      nfeNumber: formData.get('nfeNumber') as string || undefined,
      branchId: selectedBranch.id,
    };

    if (currentTransaction?.id) {
      setTransactions(prev => prev.map(t => t.id === newTransactionData.id ? newTransactionData : t));
    } else {
      setTransactions(prev => [newTransactionData, ...prev]);
    }
    setShowForm(false);
    setCurrentTransaction(null);
  };

  const columns: TableColumn<FinancialTransaction>[] = useMemo(() => [
    { header: 'Data', accessor: (item) => new Date(item.date).toLocaleDateString('pt-BR') },
    { header: 'Descrição', accessor: 'description' },
    { header: 'Cat.', accessor: (item) => <span className="text-xs">{getCategoryLabel(item.category)}</span> },
    { header: 'Valor', accessor: (item) => `R$ ${item.amount.toFixed(2)}` },
    { 
      header: 'Tipo', 
      accessor: (item) => <span className={item.type === 'revenue' ? 'text-green-600' : 'text-red-600'}>{item.type === 'revenue' ? 'Entrada' : 'Saída'}</span>
    },
    {
      header: 'Status',
      accessor: (item) => (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {item.status === 'paid' ? 'Pago' : 'Pendente'}
          </span>
      )
    },
    { 
      header: 'Ações', 
      accessor: (item) => (
        <div className="space-x-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}><PencilIcon className="w-4 h-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
        </div>
      )
    }
  ], [handleEdit, handleDelete]);

  // Columns for Reports
  const reportColumns: TableColumn<FinancialTransaction>[] = [
      { header: 'Vencimento', accessor: (item) => item.dueDate ? new Date(item.dueDate).toLocaleDateString('pt-BR') : new Date(item.date).toLocaleDateString('pt-BR') },
      { header: 'Descrição', accessor: 'description' },
      { header: 'Valor', accessor: (item) => `R$ ${item.amount.toFixed(2)}`, className: 'font-bold' },
      { header: 'Categoria', accessor: (item) => getCategoryLabel(item.category) }
  ];

  const nfColumns: TableColumn<FinancialTransaction>[] = [
      { header: 'Data Emissão', accessor: (item) => new Date(item.date).toLocaleDateString('pt-BR') },
      { header: 'Nº Nota', accessor: 'nfeNumber', className: 'font-mono text-slate-600' },
      { header: 'Cliente/Descrição', accessor: 'description' },
      { header: 'Valor Nota', accessor: (item) => `R$ ${item.amount.toFixed(2)}`, className: 'text-right font-bold text-green-600' }
  ];

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Gestão Financeira</h2>
        <div className="flex space-x-2 print:hidden">
            <Button onClick={handleAdd} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
                Nova Transação
            </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 print:hidden">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('cashflow')} 
            className={`${activeTab === 'cashflow' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <PresentationChartLineIcon className="w-5 h-5 mr-2" /> Fluxo de Caixa
          </button>
          <button 
            onClick={() => setActiveTab('reports')} 
            className={`${activeTab === 'reports' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <DocumentChartBarIcon className="w-5 h-5 mr-2" /> Relatórios & Notas Fiscais
          </button>
        </nav>
      </div>

      {/* Modal / Form */}
      {showForm && currentTransaction && (
        <Card title={currentTransaction.id ? "Editar Transação" : "Adicionar Transação"} className="print:hidden">
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="date" label="Data de Competência" type="date" defaultValue={currentTransaction.date} required />
                <Input name="dueDate" label="Data de Vencimento/Previsão" type="date" defaultValue={currentTransaction.dueDate || currentTransaction.date} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                    name="type" 
                    label="Tipo" 
                    defaultValue={currentTransaction.type} 
                    options={[{value: 'revenue', label: 'Receita'}, {value: 'expense', label: 'Despesa'}]} 
                    required 
                />
                <Select 
                    name="status" 
                    label="Status" 
                    defaultValue={currentTransaction.status || 'paid'} 
                    options={[{value: 'paid', label: 'Pago / Realizado'}, {value: 'pending', label: 'Pendente / Agendado'}]} 
                    required 
                />
            </div>
            
            <Input name="description" label="Descrição" defaultValue={currentTransaction.description} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="amount" label="Valor Bruto (R$)" type="number" step="0.01" defaultValue={currentTransaction.amount} required />
                <Input name="taxPercentage" label="% Taxa (Opcional)" type="number" step="0.1" defaultValue={currentTransaction.taxPercentage || 0} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                    name="category" 
                    label="Categoria" 
                    defaultValue={currentTransaction.category} 
                    options={[
                        {value: 'RECEITA_ATENDIMENTO', label: 'Receitas Atendimentos'},
                        {value: 'RECEITA_CURSO', label: 'Receitas Cursos'},
                        {value: 'RECEITA_KIT', label: 'Receitas Kit'},
                        {value: 'CUSTO_FIXO', label: 'Custos Fixos'},
                        {value: 'CUSTO_VARIAVEL', label: 'Custos Variáveis'},
                        {value: 'INVESTIMENTO', label: 'Investimentos'},
                        {value: 'CAPITAL_GIRO', label: 'Capital de Giro'},
                    ]} 
                    required 
                />
                <Input name="nfeNumber" label="Nº Nota Fiscal (Se emitida)" defaultValue={currentTransaction.nfeNumber || ''} placeholder="Ex: 2024001" />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setCurrentTransaction(null); }}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Card>
      )}

      {/* --- CONTENT: CASH FLOW TAB --- */}
      {activeTab === 'cashflow' && (
          <div className="space-y-6">
              <Card title="Lançamentos Detalhados">
                <Table columns={columns} data={filteredTransactions} />
              </Card>
          </div>
      )}

      {/* --- CONTENT: REPORTS TAB --- */}
      {activeTab === 'reports' && (
          <div className="space-y-6">
              {/* Report Filters */}
              <Card className="print:hidden">
                  <div className="flex flex-col md:flex-row items-end gap-4">
                      <div className="flex items-center text-slate-500 font-medium mb-4 md:mb-0">
                          <FunnelIcon className="w-5 h-5 mr-2" />
                          Filtros do Relatório:
                      </div>
                      <Input 
                          label="Data Início" 
                          type="date" 
                          value={reportStartDate} 
                          onChange={(e) => setReportStartDate(e.target.value)} 
                          wrapperClassName="!mb-0 w-full md:w-1/4"
                      />
                      <Input 
                          label="Data Fim" 
                          type="date" 
                          value={reportEndDate} 
                          onChange={(e) => setReportEndDate(e.target.value)} 
                          wrapperClassName="!mb-0 w-full md:w-1/4"
                      />
                      <Button variant="outline" onClick={handlePrint} leftIcon={<PrinterIcon className="w-5 h-5"/>} className="ml-auto">
                          Imprimir Relatório
                      </Button>
                  </div>
              </Card>

              {/* Visual Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:break-inside-avoid">
                  <Card title="Evolução Financeira (Mensal)">
                      <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                  <XAxis dataKey="name" fontSize={12} stroke="#888888" />
                                  <YAxis fontSize={12} stroke="#888888" />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                  />
                                  <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                                  <Bar dataKey="receita" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                  <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>

                  <Card title="Distribuição de Despesas">
                      <div className="h-64 w-full flex items-center justify-center">
                          {pieChartData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                      <Pie
                                          data={pieChartData}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={60}
                                          outerRadius={80}
                                          paddingAngle={5}
                                          dataKey="value"
                                      >
                                          {pieChartData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                          ))}
                                      </Pie>
                                      <Tooltip 
                                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                      />
                                      <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }}/>
                                  </PieChart>
                              </ResponsiveContainer>
                          ) : (
                              <p className="text-slate-400 text-sm">Sem dados de despesas para o período.</p>
                          )}
                      </div>
                  </Card>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-red-500">
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="text-sm text-slate-500 uppercase font-bold">Contas a Pagar (Pendente)</p>
                              <h3 className="text-2xl font-bold text-red-600">R$ {totalPayable.toFixed(2)}</h3>
                              <p className="text-xs text-slate-400 mt-1">{accountsPayable.length} lançamentos no período</p>
                          </div>
                          <div className="p-3 bg-red-100 rounded-full text-red-500">
                              <CurrencyDollarIcon className="w-8 h-8" />
                          </div>
                      </div>
                  </Card>
                  <Card className="border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="text-sm text-slate-500 uppercase font-bold">Contas a Receber (Pendente)</p>
                              <h3 className="text-2xl font-bold text-green-600">R$ {totalReceivable.toFixed(2)}</h3>
                              <p className="text-xs text-slate-400 mt-1">{accountsReceivable.length} lançamentos no período</p>
                          </div>
                          <div className="p-3 bg-green-100 rounded-full text-green-500">
                              <CurrencyDollarIcon className="w-8 h-8" />
                          </div>
                      </div>
                  </Card>
              </div>

              {/* Contas a Pagar Table */}
              <Card title="Relatório de Contas a Pagar">
                  {accountsPayable.length > 0 ? (
                      <Table columns={reportColumns} data={accountsPayable} />
                  ) : (
                      <p className="text-center text-slate-500 py-4">Nenhuma conta pendente para pagamento neste período.</p>
                  )}
              </Card>

              {/* Contas a Receber Table */}
              <Card title="Relatório de Contas a Receber">
                  {accountsReceivable.length > 0 ? (
                      <Table columns={reportColumns} data={accountsReceivable} />
                  ) : (
                      <p className="text-center text-slate-500 py-4">Nenhuma conta pendente de recebimento neste período.</p>
                  )}
              </Card>

              {/* NF Emitidas Table */}
              <div className="break-before-page">
                  <Card title="Relação de Notas Fiscais Emitidas">
                      <div className="mb-4 text-sm text-slate-600">
                          <p>Período de Faturamento: <strong>{new Date(reportStartDate).toLocaleDateString('pt-BR')}</strong> a <strong>{new Date(reportEndDate).toLocaleDateString('pt-BR')}</strong></p>
                      </div>
                      {issuedInvoices.length > 0 ? (
                          <>
                            <Table columns={nfColumns} data={issuedInvoices} />
                            <div className="mt-4 text-right border-t border-slate-200 pt-4">
                                <p className="text-lg font-bold text-slate-800">
                                    Total Faturado (NF): R$ {issuedInvoices.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                                </p>
                            </div>
                          </>
                      ) : (
                          <p className="text-center text-slate-500 py-4">Nenhuma nota fiscal emitida registrada neste período.</p>
                      )}
                  </Card>
              </div>
          </div>
      )}
    </div>
  );
};

export default FinancialManagementPage;
