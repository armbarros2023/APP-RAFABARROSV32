
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
// Garantindo imports seguros
import { DocumentChartBarIcon, BuildingOfficeIcon, KeyIcon, CheckIcon, DocumentArrowUpIcon, PrinterIcon } from '../components/icons/HeroIcons';
import { useBranch } from '../contexts/BranchContext';
import { useToast } from '../contexts/ToastContext';

// Simulação de resposta da API da Prefeitura
interface MockNfeResponse {
    numero: string;
    codigoVerificacao: string;
    linkPdf: string;
    status: 'autorizada' | 'rejeitada';
}

const ServiceNfePage: React.FC = () => {
  const { selectedBranch, loading: branchLoading } = useBranch();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'config' | 'emit' | 'history'>('emit');
  const [loading, setLoading] = useState(false);
  const [lastNfe, setLastNfe] = useState<MockNfeResponse | null>(null);

  // Config State
  const [config, setConfig] = useState({
      inscricaoMunicipal: '',
      loginPrefeitura: '',
      senhaWeb: '',
      certificadoNome: '',
      ambiente: 'homologacao'
  });

  // Emission Form State
  const [emissionData, setEmissionData] = useState({
      tomadorNome: '',
      tomadorCpfCnpj: '',
      tomadorEmail: '',
      servicoCodigo: '04.03',
      valorServico: '',
      descricao: 'Sessão de Terapia / Fonoaudiologia referente ao mês corrente.',
      retencaoIss: '2' // Não
  });

  // Reset states when branch changes without unmounting component (safes crash)
  useEffect(() => {
      setLastNfe(null);
      setLoading(false);
      // Reset forms if needed or load branch specific config
      setConfig(prev => ({...prev, certificadoNome: ''})); // Example reset
  }, [selectedBranch?.id]);

  // Tipagem genérica (any) para evitar conflitos estritos de TS entre Input/Select
  const handleConfigChange = (e: any) => {
      const { name, value } = e.target;
      setConfig(prev => ({...prev, [name]: value}));
  };

  const handleEmissionChange = (e: any) => {
      const { name, value } = e.target;
      setEmissionData(prev => ({...prev, [name]: value}));
  };

  const handleUploadCert = () => {
      // Simulação de upload
      setConfig(prev => ({...prev, certificadoNome: 'certificado_a1_piracicaba_2024.pfx'}));
      addToast("Certificado carregado com sucesso!", "success");
  };

  const handleEmitNfe = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedBranch) {
          addToast("Selecione uma filial para emitir.", "error");
          return;
      }

      setLoading(true);
      setLastNfe(null);

      // Simulação do envio SOAP/REST para a Prefeitura de Piracicaba (GINFES/ABRASF)
      setTimeout(() => {
          setLoading(false);
          setLastNfe({
              numero: Math.floor(Math.random() * 10000).toString(),
              codigoVerificacao: Math.random().toString(36).substring(2, 10).toUpperCase(),
              linkPdf: '#',
              status: 'autorizada'
          });
          addToast("RPS enviado e convertido em NFS-e com sucesso!", "success");
      }, 3000); // 3 segundos de "processamento"
  };

  // Se o contexto ainda estiver carregando, mostra estado de espera
  if (branchLoading) {
      return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></span>
              <p>Carregando dados da filial...</p>
          </div>
      );
  }

  // Verifica explicitamente se existe selectedBranch E se tem ID
  if (!selectedBranch || !selectedBranch.id) {
      return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <BuildingOfficeIcon className="w-16 h-16 mb-4 text-slate-300"/>
              <p>Selecione uma filial no menu lateral para acessar o módulo de notas fiscais.</p>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <DocumentChartBarIcon className="h-8 w-8 text-primary"/>
            </div>
            <div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">NFS-e Piracicaba (GINFES)</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Filial Ativa: {selectedBranch?.name} ({selectedBranch?.cnpj})</p>
            </div>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('emit')} className={`${activeTab === 'emit' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            Emissão de Nota
          </button>
          <button onClick={() => setActiveTab('config')} className={`${activeTab === 'config' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            Configurações Prefeitura
          </button>
          <button onClick={() => setActiveTab('history')} className={`${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            Histórico e XML
          </button>
        </nav>
      </div>
      
      {activeTab === 'config' && (
          <Card title="Credenciais de Acesso (WebService Piracicaba)">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      <strong>Atenção:</strong> A comunicação com a Prefeitura de Piracicaba exige Certificado Digital A1. O upload deve ser feito abaixo para que o servidor assine os arquivos XML (Lote RPS).
                  </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                          <BuildingOfficeIcon className="w-4 h-4 mr-2"/> Dados Cadastrais
                      </h4>
                      <Input label="Inscrição Municipal (Piracicaba)" name="inscricaoMunicipal" value={config.inscricaoMunicipal} onChange={handleConfigChange} placeholder="Ex: 123456" />
                      <Input label="Usuário/Login Prefeitura" name="loginPrefeitura" value={config.loginPrefeitura} onChange={handleConfigChange} />
                      <Input label="Senha Web (Opcional)" name="senhaWeb" type="password" value={config.senhaWeb} onChange={handleConfigChange} />
                      <Select 
                        label="Ambiente" 
                        name="ambiente" 
                        value={config.ambiente} 
                        onChange={handleConfigChange} 
                        options={[{value: 'homologacao', label: 'Homologação (Teste)'}, {value: 'producao', label: 'Produção (Valendo)'}]} 
                      />
                  </div>
                  
                  <div>
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                          <KeyIcon className="w-4 h-4 mr-2"/> Certificado Digital A1
                      </h4>
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={handleUploadCert}>
                          {config.certificadoNome ? (
                              <>
                                <CheckIcon className="w-12 h-12 text-green-500 mb-2"/>
                                <p className="text-green-600 font-medium">{config.certificadoNome}</p>
                                <p className="text-xs text-slate-500">Válido até: 12/2025</p>
                              </>
                          ) : (
                              <>
                                <DocumentArrowUpIcon className="w-12 h-12 text-slate-400 mb-2"/>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Clique para carregar o arquivo .PFX</p>
                              </>
                          )}
                      </div>
                      {config.certificadoNome && (
                          <div className="mt-4">
                              <Input label="Senha do Certificado" type="password" placeholder="Digite a senha do arquivo .pfx" />
                          </div>
                      )}
                  </div>
              </div>
              <div className="mt-6 flex justify-end">
                  <Button onClick={() => addToast("Configurações salvas!", "success")}>Salvar Configurações</Button>
              </div>
          </Card>
      )}

      {activeTab === 'emit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card title="Dados da Nota Fiscal">
                    <form onSubmit={handleEmitNfe} className="space-y-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Tomador do Serviço (Aluno/Responsável)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="CPF/CNPJ" name="tomadorCpfCnpj" value={emissionData.tomadorCpfCnpj} onChange={handleEmissionChange} placeholder="000.000.000-00" required />
                                <Input label="Nome/Razão Social" name="tomadorNome" value={emissionData.tomadorNome} onChange={handleEmissionChange} required />
                            </div>
                            <Input label="E-mail para envio" name="tomadorEmail" type="email" value={emissionData.tomadorEmail} onChange={handleEmissionChange} wrapperClassName="!mb-0" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select 
                                label="Código do Serviço (LC 116)" 
                                name="servicoCodigo" 
                                value={emissionData.servicoCodigo} 
                                onChange={handleEmissionChange}
                                options={[
                                    {value: '04.03', label: '04.03 - Hospitais, clínicas, laboratórios...'},
                                    {value: '04.08', label: '04.08 - Terapia ocupacional, fisioterapia...'},
                                    {value: '04.23', label: '04.23 - Outros planos de saúde...'}
                                ]} 
                            />
                            <Select 
                                label="Retenção de ISS" 
                                name="retencaoIss" 
                                value={emissionData.retencaoIss} 
                                onChange={handleEmissionChange}
                                options={[
                                    {value: '1', label: 'Sim - Tomador paga ISS'},
                                    {value: '2', label: 'Não - Prestador paga ISS'}
                                ]} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Valor do Serviço (R$)" name="valorServico" type="number" step="0.01" value={emissionData.valorServico} onChange={handleEmissionChange} required className="text-lg font-bold text-green-600" />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Discriminação dos Serviços</label>
                            <textarea 
                                name="descricao" 
                                rows={4} 
                                className="w-full px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm dark:text-slate-200"
                                value={emissionData.descricao}
                                onChange={handleEmissionChange}
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <Button type="submit" disabled={loading} leftIcon={loading ? <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span> : <DocumentArrowUpIcon className="w-5 h-5"/>}>
                                {loading ? 'Transmitindo para Prefeitura...' : 'Emitir NFS-e'}
                            </Button>
                        </div>
                    </form>
                </Card>
              </div>

              <div>
                  <Card title="Status de Emissão">
                      {lastNfe ? (
                          <div className="text-center py-6 animate-fade-in">
                              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <CheckIcon className="w-8 h-8 text-green-600"/>
                              </div>
                              <h3 className="text-xl font-bold text-green-700 mb-1">Nota Autorizada!</h3>
                              <p className="text-sm text-slate-500 mb-6">NFS-e Nº {lastNfe.numero}</p>
                              
                              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded text-left text-sm mb-6 border border-slate-200 dark:border-slate-700">
                                  <p className="mb-1"><span className="font-semibold">Cód. Verificação:</span> {lastNfe.codigoVerificacao}</p>
                                  <p><span className="font-semibold">Status:</span> {lastNfe.status}</p>
                              </div>

                              <Button className="w-full mb-2" leftIcon={<PrinterIcon className="w-5 h-5"/>}>Baixar PDF</Button>
                              <Button variant="outline" className="w-full">Enviar por Email</Button>
                          </div>
                      ) : (
                          <div className="text-center py-10 text-slate-500">
                              <p className="mb-4">Preencha os dados ao lado para gerar o lote RPS e transmitir.</p>
                              <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded">
                                  Conectado a: <strong>GINFES / Piracicaba</strong><br/>
                                  Ambiente: <strong>{config.ambiente === 'producao' ? 'Produção' : 'Homologação'}</strong>
                              </div>
                          </div>
                      )}
                  </Card>
              </div>
          </div>
      )}

      {activeTab === 'history' && (
          <Card title="Últimas Notas Emitidas">
              <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold">
                          <tr>
                              <th className="px-4 py-3">Número</th>
                              <th className="px-4 py-3">Emissão</th>
                              <th className="px-4 py-3">Tomador</th>
                              <th className="px-4 py-3 text-right">Valor</th>
                              <th className="px-4 py-3 text-center">Status</th>
                              <th className="px-4 py-3 text-center">Ações</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {/* Mock Row */}
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-medium">2024/105</td>
                              <td className="px-4 py-3">25/07/2024</td>
                              <td className="px-4 py-3">Lucas Silva</td>
                              <td className="px-4 py-3 text-right">R$ 1.080,00</td>
                              <td className="px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Autorizada</span></td>
                              <td className="px-4 py-3 text-center flex justify-center space-x-2">
                                  <button className="text-blue-600 hover:underline">PDF</button>
                                  <button className="text-slate-500 hover:underline">XML</button>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </Card>
      )}
    </div>
  );
};

export default ServiceNfePage;
