
import React, { useState, useMemo, useCallback } from 'react';
import Card from '../components/ui/Card';
import Table, { TableColumn } from '../components/ui/Table';
import Button from '../components/ui/Button';
import { StudentInvoice, Student } from '../types';
import { CurrencyDollarIcon, PencilIcon, PrinterIcon, BellIcon, PlusCircleIcon } from '../components/icons/HeroIcons';
import { useBranch } from '../contexts/BranchContext';

const mockInvoices: StudentInvoice[] = [
  { id: 'inv001', studentId: 'studentA', branchId: 'branch-1', issueDate: '2024-07-01', dueDate: '2024-07-15', amount: 300, status: 'paid', receiptUrl: '#receipt1' },
  { id: 'inv002', studentId: 'studentB', branchId: 'branch-2', issueDate: '2024-07-05', dueDate: '2024-07-20', amount: 150, status: 'pending', paymentLink: '#paylink2' },
];

// Mock fallback for student data
const mockStudentsFallback: Student[] = [
    { id: 'studentA', name: 'Ana Silva (Fallback)', cpf: '123.456.789-00'} as Student,
    { id: 'studentB', name: 'João Santos (Fallback)', cpf: '222.333.444-55'} as Student,
];

const STUDENTS_STORAGE_KEY = 'equipe_rafael_barros_students';

// Security Protocol: Robust XSS Prevention
// Function to prevent XSS in the generated HTML receipt
const escapeHtml = (unsafe: string | number | undefined | null) => {
    if (unsafe === undefined || unsafe === null) return '';
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 };

const ClientBillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<StudentInvoice[]>(mockInvoices);
  const { selectedBranch } = useBranch();
  
  // Load real students
  const [students] = useState<Student[]>(() => {
    try {
        const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : mockStudentsFallback;
    } catch { return mockStudentsFallback; }
  });

  const filteredInvoices = useMemo(() => {
    if (!selectedBranch) return invoices;
    return invoices.filter(inv => inv.branchId === selectedBranch.id);
  }, [invoices, selectedBranch]);


  const getStudentName = useCallback((studentId: string) => {
      const found = students.find(c => c.id === studentId);
      return found ? found.name : studentId;
  }, [students]);

  const handleGenerateReceipt = (invoice: StudentInvoice) => {
    const student = students.find(s => s.id === invoice.studentId);
    const studentName = student?.name || 'Cliente não identificado';
    const studentCpf = student?.cpf || 'CPF não informado';
    const branchName = selectedBranch?.name || 'Equipe Rafael Barros';
    const branchCnpj = selectedBranch?.cnpj || 'CNPJ não informado';
    const branchAddress = selectedBranch?.address || 'Endereço não informado';
    const branchResponsible = selectedBranch?.responsible || 'Administração';
    const currentDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Safe values using escapeHtml to prevent script injection in the new window
    const safeValues = {
        branchName: escapeHtml(branchName),
        branchAddress: escapeHtml(branchAddress),
        branchCnpj: escapeHtml(branchCnpj),
        studentName: escapeHtml(studentName),
        studentCpf: escapeHtml(studentCpf),
        amount: invoice.amount.toFixed(2),
        invoiceId: escapeHtml(invoice.id),
        dueDate: new Date(invoice.dueDate).toLocaleDateString('pt-BR'),
        issueDate: new Date(invoice.issueDate).toLocaleDateString('pt-BR'),
        currentDate: escapeHtml(currentDate),
        branchResponsible: escapeHtml(branchResponsible),
        city: escapeHtml(selectedBranch?.address?.split(',')[1]?.trim() || 'São Paulo')
    };

    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Recibo #${safeValues.invoiceId}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
                    .container { border: 2px solid #ddd; padding: 40px; border-radius: 8px; }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #0284c7; padding-bottom: 20px; }
                    .header h1 { color: #0284c7; margin: 0; font-size: 28px; text-transform: uppercase; }
                    .header p { margin: 5px 0; color: #666; font-size: 14px; }
                    .receipt-title { text-align: center; font-size: 20px; font-weight: bold; margin: 30px 0; background-color: #f0f9ff; padding: 10px; border-radius: 4px; }
                    .content { line-height: 1.8; font-size: 16px; text-align: justify; }
                    .amount { font-weight: bold; font-size: 18px; color: #0284c7; }
                    .details { margin-top: 30px; border: 1px solid #eee; padding: 15px; background-color: #fafafa; font-size: 14px; }
                    .footer { margin-top: 60px; text-align: center; }
                    .signature-line { border-top: 1px solid #333; width: 60%; margin: 0 auto 10px auto; }
                    .date { text-align: right; margin-top: 20px; font-style: italic; }
                    @media print {
                        body { padding: 0; }
                        .container { border: none; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${safeValues.branchName}</h1>
                        <p>${safeValues.branchAddress}</p>
                        <p>CNPJ: ${safeValues.branchCnpj}</p>
                    </div>

                    <div class="receipt-title">RECIBO DE PAGAMENTO</div>

                    <div class="content">
                        <p>Recebemos de <strong>${safeValues.studentName}</strong> (CPF: ${safeValues.studentCpf}) a importância de <span class="amount">R$ ${safeValues.amount}</span>.</p>
                        <p>Este valor é referente a serviços prestados de terapia e/ou acompanhamento educacional (Fatura #${safeValues.invoiceId}) com vencimento em ${safeValues.dueDate}.</p>
                        <p>Damos plena e geral quitação pela importância recebida.</p>
                    </div>

                    <div class="details">
                        <p><strong>Dados do Pagamento:</strong></p>
                        <p>Data de Emissão: ${safeValues.issueDate}</p>
                        <p>Status: Pago</p>
                    </div>

                    <div class="date">
                        ${safeValues.city}, ${safeValues.currentDate}
                    </div>

                    <div class="footer">
                        <div class="signature-line"></div>
                        <p>${safeValues.branchResponsible}</p>
                        <p>${safeValues.branchName}</p>
                    </div>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
        receiptWindow.document.write(htmlContent);
        receiptWindow.document.close();
    } else {
        alert('Por favor, permita pop-ups para gerar o recibo.');
    }
  };
  
  const handleSendReminders = () => {
    const overdueCount = filteredInvoices.filter(inv => inv.status === 'overdue').length;
    const pendingCount = filteredInvoices.filter(inv => inv.status === 'pending').length;
    
    if (overdueCount === 0 && pendingCount === 0) {
        alert("Não há faturas pendentes ou vencidas para enviar lembretes.");
        return;
    }

    const confirmMessage = `Confirma o envio de lembretes automáticos?\n\n- ${overdueCount} Faturas Vencidas (Aviso de atraso)\n- ${pendingCount} Faturas Pendentes (Lembrete de vencimento)\n\nOs emails serão enviados para os responsáveis cadastrados.`;

    if (window.confirm(confirmMessage)) {
        // Simulation of backend process
        alert(`Disparando emails...\n\nSucesso! ${overdueCount + pendingCount} lembretes foram colocados na fila de envio e chegarão aos responsáveis em breve.`);
    }
  };

  const columns: TableColumn<StudentInvoice>[] = useMemo(() => [
    { header: 'Fatura ID', accessor: 'id' },
    { header: 'Aluno', accessor: (item: StudentInvoice) => getStudentName(item.studentId) },
    { header: 'Data Emissão', accessor: (item: StudentInvoice) => new Date(item.issueDate).toLocaleDateString('pt-BR') },
    { header: 'Data Venc.', accessor: (item: StudentInvoice) => new Date(item.dueDate).toLocaleDateString('pt-BR') },
    { header: 'Valor', accessor: (item: StudentInvoice) => `R$ ${item.amount.toFixed(2)}` },
    { header: 'Status', accessor: (item: StudentInvoice) => {
        let colorClass = '';
        let statusText = '';
        switch(item.status) {
            case 'paid': colorClass = 'bg-green-100 text-green-800'; statusText = 'Paga'; break;
            case 'pending': colorClass = 'bg-yellow-100 text-yellow-800'; statusText = 'Pendente'; break;
            case 'overdue': colorClass = 'bg-red-100 text-red-800'; statusText = 'Vencida'; break;
        }
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>{statusText}</span>;
      } 
    },
    { header: 'Ações', accessor: (item: StudentInvoice) => (
      <div className="space-x-1 flex items-center">
        {item.paymentLink && item.status !== 'paid' && <Button size="sm" variant="ghost" onClick={() => alert(`Link de pagamento: ${item.paymentLink}`)} title="Enviar Link"><CurrencyDollarIcon className="w-4 h-4 text-primary"/></Button>}
        
        {item.status === 'paid' && (
             <Button size="sm" variant="ghost" onClick={() => handleGenerateReceipt(item)} title="Gerar Recibo PDF">
                 <PrinterIcon className="w-4 h-4 text-slate-600 hover:text-primary"/>
             </Button>
        )}
        
        <Button size="sm" variant="ghost" onClick={() => alert(`Editando fatura ${item.id}`)} title="Editar"><PencilIcon className="w-4 h-4"/></Button>
      </div>
    )}
  ], [getStudentName, selectedBranch]);

  const handleGeneratePaymentLink = (invoiceId: string) => {
    // Mock: In a real app, integrate with Stripe, Mercado Pago, etc.
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
        const paymentLink = `https://mockpaymentgateway.com/pay/${invoice.id}?amount=${invoice.amount}`;
        setInvoices(invoices.map(inv => inv.id === invoiceId ? {...inv, paymentLink } : inv));
        alert(`Link de pagamento gerado para ${invoiceId}: ${paymentLink}. Um e-mail/SMS seria enviado aqui.`);
    }
  };
  
  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? {...inv, status: 'paid', receiptUrl: `#mockReceipt${invoiceId}` } : inv));
    alert(`Fatura ${invoiceId} marcada como paga.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-slate-800">Faturamento de Alunos</h2>
        <Button onClick={() => alert("Abrir formulário para nova fatura.")} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
            Nova Fatura Manual
        </Button>
      </div>

      <Card title="Automação de Pagamentos">
        <p className="text-slate-600 mb-4">
          Integração com gateways de pagamento (ex: Stripe, Mercado Pago) para gerar e enviar links de pagamento personalizados ou boletos bancários via e-mail/SMS.
        </p>
        <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleSendReminders} leftIcon={<BellIcon className="w-5 h-5" />}>
                Enviar Lembretes de Cobrança
            </Button>
            <Button variant="outline" onClick={() => alert("Configurar gateways de pagamento")}>Configurar Gateways</Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Esta é uma simulação. Nenhuma integração real está ativa.</p>
      </Card>
      
      <Card title="Faturas e Recibos">
        <Table columns={columns} data={filteredInvoices} emptyMessage="Nenhuma fatura encontrada para esta filial." />
        <p className="mt-4 text-sm text-slate-500">O sistema será integrado aos sistemas de faturamento eletrônico para emitir e enviar faturas automaticamente após a confirmação do pagamento. Ele também armazenará recibos de pagamento e rastreará o status de cada cobrança.</p>
      </Card>

      {/* Example actions on a specific invoice - might be in a modal or separate view */}
      {filteredInvoices.find(inv => inv.status === 'pending') &&
        <Card title={`Ações para Fatura ${filteredInvoices.find(inv => inv.status === 'pending')!.id}`}>
            <div className="space-x-2">
                <Button onClick={() => handleGeneratePaymentLink(filteredInvoices.find(inv => inv.status === 'pending')!.id)}>Gerar/Reenviar Link Pag.</Button>
                <Button variant="outline" onClick={() => handleMarkAsPaid(filteredInvoices.find(inv => inv.status === 'pending')!.id)}>Marcar como Paga Manualmente</Button>
            </div>
        </Card>
      }

    </div>
  );
};

export default ClientBillingPage;
