
import React, { useState, useMemo, useCallback } from 'react';
import Card from '../components/ui/Card';
import Table, { TableColumn } from '../components/ui/Table';
import Button from '../components/ui/Button';
import { TherapistPayment, StaffMember, StaffStatus } from '../types';
import { PresentationChartLineIcon, EyeIcon, PlusCircleIcon, CurrencyDollarIcon } from '../components/icons/HeroIcons';
import { useBranch } from '../contexts/BranchContext';

const mockTherapistsFallback: StaffMember[] = [
  { id: 'therapist1', branchId: 'branch-1', name: 'Dr. Carlos Contratado (Fallback)', role: 'Psicólogo Contratado', email: 'carlos.contratado@example.com', status: StaffStatus.ACTIVE } as StaffMember,
];

const mockPayments: TherapistPayment[] = [
  { id: 'pay001', therapistId: 'therapist1', branchId: 'branch-1', therapistName: 'Dr. Carlos Contratado', period: '2024-06', sessionsConducted: 40, amount: 2000, status: 'paid', invoiceUrl: '#invoiceCarlosJun' },
];

const TEAM_STORAGE_KEY = 'equipe_rafael_barros_team';

const TherapistPaymentPage: React.FC = () => {
  const [payments, setPayments] = useState<TherapistPayment[]>(mockPayments);
  const { selectedBranch } = useBranch();

  // Load therapists from localStorage
  const [therapists] = useState<StaffMember[]>(() => {
      try {
        const stored = localStorage.getItem(TEAM_STORAGE_KEY);
        return stored ? JSON.parse(stored) : mockTherapistsFallback;
      } catch { return mockTherapistsFallback; }
  });

  const filteredPayments = useMemo(() => {
    if (!selectedBranch) return payments;
    return payments.filter(p => p.branchId === selectedBranch.id);
  }, [payments, selectedBranch]);

  const handleProcessPayment = useCallback((paymentId: string) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'paid' } : p));
    alert(`Pagamento ${paymentId} processado e marcado como pago.`);
  }, []);

  const handleUploadInvoice = useCallback((paymentId: string) => {
    const invoiceUrl = prompt("Insira a URL da fatura/recibo do terapeuta (simulação):");
    if (invoiceUrl) {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, invoiceUrl } : p));
    }
  }, []);

  const columns: TableColumn<TherapistPayment>[] = useMemo(() => [
    { header: 'Terapeuta', accessor: 'therapistName' },
    { header: 'Período', accessor: 'period' },
    { header: 'Sessões', accessor: 'sessionsConducted', className: 'text-center' },
    { header: 'Valor (R$)', accessor: (item: TherapistPayment) => item.amount.toFixed(2), className: 'text-right' },
    { header: 'Status', accessor: (item: TherapistPayment) => {
        let colorClass = '';
        let statusText = '';
        switch(item.status) {
            case 'paid': colorClass = 'bg-green-100 text-green-800'; statusText = 'Pago'; break;
            case 'pending': colorClass = 'bg-yellow-100 text-yellow-800'; statusText = 'Pendente'; break;
        }
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>{statusText}</span>;
      } 
    },
    { header: 'Documento Terapeuta', accessor: (item: TherapistPayment) => (
        item.invoiceUrl ? 
        <a href={item.invoiceUrl} target="_blank" rel="noreferrer"><Button size="sm" variant="ghost" title="Ver Fatura/Recibo"><EyeIcon className="w-4 h-4 text-primary"/></Button></a> 
        : <span className="text-xs text-slate-400">Pendente</span>
      ) 
    },
    { header: 'Ações', accessor: (item: TherapistPayment) => (
      <div className="space-x-1">
        {item.status === 'pending' && <Button size="sm" variant="primary" onClick={() => handleProcessPayment(item.id)} leftIcon={<CurrencyDollarIcon className="w-4 h-4"/>}>Processar Pagamento</Button>}
        {item.status === 'pending' && !item.invoiceUrl && <Button size="sm" variant="outline" onClick={() => handleUploadInvoice(item.id)}>Anexar Fatura</Button>}
      </div>
    )}
  ], [handleProcessPayment, handleUploadInvoice]);

  const handleCalculatePayments = () => {
    if (!selectedBranch) {
        alert("Selecione uma filial para calcular os pagamentos.");
        return;
    }
    alert("Cálculo de pagamentos para o período atual iniciado. Novos registros de pagamento pendentes seriam gerados/atualizados com base nas sessões conduzidas e acordos contratuais.");
    const currentMonthYear = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    
    // Use real therapists from storage
    therapists.filter(t => t.branchId === selectedBranch.id).forEach(therapist => {
        if (!payments.find(p => p.therapistId === therapist.id && p.period === currentMonthYear && p.status === 'pending')) {
            const newPendingPayment: TherapistPayment = {
                id: `pay${Date.now()}${therapist.id}`,
                therapistId: therapist.id,
                branchId: selectedBranch.id,
                therapistName: therapist.name,
                period: currentMonthYear,
                sessionsConducted: Math.floor(Math.random() * 20) + 20, 
                amount: (Math.floor(Math.random() * 20) + 20) * 50, 
                status: 'pending',
            };
            setPayments(prev => [...prev, newPendingPayment]);
        }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-slate-800">Pagamento de Terapeutas (Contratados)</h2>
      </div>

      <Card title="Cálculo Automatizado e Gestão">
        <p className="text-slate-600 mb-4">
          O sistema rastreará automaticamente as sessões conduzidas por cada terapeuta contratado e calculará os pagamentos com base em seus acordos contratuais.
        </p>
        <Button onClick={handleCalculatePayments} leftIcon={<PresentationChartLineIcon className="w-5 h-5"/>}>
          Calcular Pagamentos do Período
        </Button>
        <p className="mt-2 text-xs text-slate-500">Esta ação simula o cálculo para o mês atual.</p>
      </Card>
      
      <Card title="Histórico de Pagamentos">
        <Table columns={columns} data={filteredPayments} emptyMessage="Nenhum pagamento encontrado para esta filial." />
      </Card>

      <Card title="Gerenciamento de Documentos de Terapeutas">
        <p className="text-slate-600 mb-4">
          Recurso para terapeutas enviarem suas faturas ou recibos. O sistema mantém um histórico detalhado para cada profissional.
        </p>
        <p className="text-sm text-slate-500">Links para upload/visualização de documentos estão na tabela acima.</p>
        <Button onClick={() => alert("Portal do Terapeuta para upload (simulação)")} variant="outline">Acessar Portal do Terapeuta (Simulação)</Button>
      </Card>
    </div>
  );
};

export default TherapistPaymentPage;
