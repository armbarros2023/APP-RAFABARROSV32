
import React, { useState, useMemo, ChangeEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Student, StudentActivityLog, StudentMedia, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { generateStudentSummary, suggestActivities } from '../services/ai';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowUturnLeftIcon, PlusCircleIcon, PhotoIcon, VideoCameraIcon, DocumentArrowUpIcon, SparklesIcon, LightBulbIcon, PencilIcon, CheckIcon, XMarkIcon, TrashIcon, CloudArrowUpIcon } from '../components/icons/HeroIcons';

// Interface auxiliar para controlar o estado de cada upload individualmente
interface UploadItem {
    id: string;
    file: File;
    progress: number;
    status: 'idle' | 'uploading' | 'completed' | 'error';
}

// Mock data fallback only
const mockStudentsFallback: Student[] = [
    { id: 'p001', branchId: 'branch-1', name: 'Lucas Silva', therapistId: 'therapist01', status: 'active', avatarUrl: 'https://picsum.photos/seed/lucas/200', dateOfBirth: '2018-05-10', guardianName: 'Ana Silva', guardianPhone: '(11) 98765-4321', guardianEmail: 'ana.silva@example.com', wantsMonthlyNFe: true, rg: '12.345.678-9', cpf: '123.456.789-00', address: 'Rua das Flores, 123, Apto 45', neighborhood: 'Jardim das Rosas', city: 'São Paulo', postalCode: '01234-567' },
    { id: 'p002', branchId: 'branch-2', name: 'Maria Santos', therapistId: 'therapist02', status: 'active', avatarUrl: 'https://picsum.photos/seed/maria/200', dateOfBirth: '2019-02-15', guardianName: 'João Santos', guardianPhone: '(21) 91234-5678', guardianEmail: 'joao.santos@example.com', wantsMonthlyNFe: false },
];

const mockActivityLogs: StudentActivityLog[] = [
    { id: 'act001', studentId: 'p001', date: '2024-07-20T10:00:00', description: 'Sessão focada em interação social. Mostrou bom progresso na atividade de troca de turnos.', therapistId: 'therapist01' },
    { id: 'act002', studentId: 'p001', date: '2024-07-18T10:00:00', description: 'Trabalhou habilidades motoras finas com blocos de montar. Conseguiu montar uma torre de 5 blocos.', therapistId: 'therapist01' },
    { id: 'act003', studentId: 'p002', date: '2024-07-22T14:00:00', description: 'Exercícios de articulação dos sons /r/ e /s/. Apresentou alguma dificuldade, mas manteve-se engajada.', therapistId: 'therapist02' },
];

const mockMedia: StudentMedia[] = [
    { id: 'med001', studentId: 'p001', uploadDate: '2024-07-20', url: '#', type: 'video', description: 'Vídeo da atividade de troca de turnos.', therapistId: 'therapist01' },
    { id: 'med002', studentId: 'p002', uploadDate: '2024-07-22', url: '#', type: 'document', description: 'Relatório de avaliação da fala.', therapistId: 'therapist02' },
];

const STUDENTS_STORAGE_KEY = 'equipe_rafael_barros_students';

const StudentDetailPage: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Load students from localStorage to ensure we see updated data
    const [students] = useState<Student[]>(() => {
        try {
            const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : mockStudentsFallback;
        } catch { return mockStudentsFallback; }
    });

    const [activeTab, setActiveTab] = useState<'progress' | 'media' | 'ai'>('progress');
    const [activityLogs, setActivityLogs] = useState(mockActivityLogs);
    const [mediaFiles, setMediaFiles] = useState(mockMedia);
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [newActivity, setNewActivity] = useState('');
    
    // Media Upload State
    const [showMediaForm, setShowMediaForm] = useState(false);
    const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
    const [newMediaDescription, setNewMediaDescription] = useState('');
    const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);

    // Editing State
    const [editingLogId, setEditingLogId] = useState<string | null>(null);
    const [editingLogText, setEditingLogText] = useState('');

    // AI State
    const [aiSummary, setAiSummary] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState('');
    const [aiSuggestionsLoading, setAiSuggestionsLoading] = useState(false);

    const student = useMemo(() => students.find(p => p.id === studentId), [students, studentId]);
    
    const studentActivity = useMemo(() =>
        activityLogs.filter(log => log.studentId === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [activityLogs, studentId]
    );

    const studentMedia = useMemo(() =>
        mediaFiles.filter(media => media.studentId === studentId).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
        [mediaFiles, studentId]
    );

    if (!student || !user) {
        return (
            <div className="text-center p-10">
                <p>Aluno não encontrado ou acesso não autorizado.</p>
                <Button onClick={() => navigate('/alunos')} className="mt-4">Voltar para Alunos</Button>
            </div>
        );
    }
    
    // Authorization check
    if (user.role !== 'admin' && student.therapistId !== user.id) {
        return (
            <div className="text-center p-10">
                <p>Você não tem permissão para ver os detalhes deste aluno.</p>
                 <Button onClick={() => navigate('/alunos')} className="mt-4">Voltar para Alunos</Button>
            </div>
        );
    }

    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault();
        const newLog: StudentActivityLog = {
            id: `act${Date.now()}`,
            studentId: student.id,
            date: new Date().toISOString(),
            description: newActivity,
            therapistId: user.id
        };
        setActivityLogs(prev => [newLog, ...prev]);
        setShowActivityForm(false);
        setNewActivity('');
        addToast('Atividade registrada com sucesso!');
    };

    // Editing Handlers
    const handleStartEdit = (log: StudentActivityLog) => {
        setEditingLogId(log.id);
        setEditingLogText(log.description);
    };

    const handleCancelEdit = () => {
        setEditingLogId(null);
        setEditingLogText('');
    };

    const handleSaveEdit = (id: string) => {
        if (!editingLogText.trim()) {
            addToast('O texto do registro não pode estar vazio.', 'error');
            return;
        }
        setActivityLogs(prev => prev.map(log => 
            log.id === id ? { ...log, description: editingLogText } : log
        ));
        setEditingLogId(null);
        setEditingLogText('');
        addToast('Registro atualizado com sucesso!', 'success');
    };
    
    // Media Handlers - Seleção de Arquivos
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file,
                progress: 0,
                status: 'idle' as const
            }));
            setUploadQueue(prev => [...prev, ...newFiles]);
        }
        // Reset input value so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveFromQueue = (id: string) => {
        setUploadQueue(prev => prev.filter(item => item.id !== id));
    };

    // Função de Upload Simulado com Progresso
    const handleUploadBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const pendingItems = uploadQueue.filter(item => item.status === 'idle');
        if (pendingItems.length === 0) {
            addToast('Não há arquivos pendentes para enviar.', 'info');
            return;
        }

        setIsUploadingGlobal(true);

        // Processa cada arquivo simultaneamente (simulado)
        const uploadPromises = pendingItems.map(item => {
            return new Promise<void>((resolve) => {
                // Atualiza status para uploading
                setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i));

                let progress = 0;
                // Velocidade aleatória para cada arquivo
                const speed = Math.random() * 5 + 2; 

                const interval = setInterval(() => {
                    progress += speed;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        
                        // Upload Concluído
                        setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, progress: 100, status: 'completed' } : i));
                        
                        // Adicionar ao banco de dados "real" (simulação)
                        const mediaType: StudentMedia['type'] = item.file.type.startsWith('image/') ? 'image' : item.file.type.startsWith('video/') ? 'video' : 'document';
                        const newMedia: StudentMedia = {
                            id: `med-${Date.now()}-${item.id}`,
                            studentId: student.id,
                            uploadDate: new Date().toISOString(),
                            description: newMediaDescription ? `${newMediaDescription} (${item.file.name})` : item.file.name,
                            therapistId: user.id,
                            type: mediaType,
                            url: URL.createObjectURL(item.file) // URL local para preview
                        };
                        setMediaFiles(prev => [newMedia, ...prev]);
                        resolve();
                    } else {
                        // Atualiza progresso
                        setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, progress } : i));
                    }
                }, 100);
            });
        });

        await Promise.all(uploadPromises);
        setIsUploadingGlobal(false);
        setNewMediaDescription('');
        addToast(`${pendingItems.length} arquivos enviados com sucesso!`);
        
        // Opcional: Limpar a fila automaticamente após um tempo ou deixar o usuário ver o "Concluído"
        // setUploadQueue([]); 
    };

    const getAge = () => {
        const birthYear = student.dateOfBirth ? new Date(student.dateOfBirth).getFullYear() : 2015;
        return new Date().getFullYear() - birthYear;
    }

    const handleGenerateSummary = async () => {
        setAiLoading(true);
        setAiSummary('');
        const summary = await generateStudentSummary(student.name, getAge(), studentActivity.slice(0, 10)); // Send last 10 logs
        setAiSummary(summary);
        setAiLoading(false);
        addToast('Relatório gerado pela IA com sucesso!', 'info');
    };

    const handleSuggestActivities = async () => {
        setAiSuggestionsLoading(true);
        setAiSuggestions('');
        const suggestions = await suggestActivities(student.name, getAge(), studentActivity.slice(0, 10));
        setAiSuggestions(suggestions);
        setAiSuggestionsLoading(false);
        addToast('Sugestões de atividades geradas!', 'info');
    };

    const getMediaIcon = (type: StudentMedia['type']) => {
        switch(type) {
            case 'video': return <VideoCameraIcon className="w-8 h-8 text-primary" />;
            case 'image': return <PhotoIcon className="w-8 h-8 text-secondary" />;
            case 'document': return <DocumentArrowUpIcon className="w-8 h-8 text-amber-500" />;
            default: return null;
        }
    };

    // Reusable render for activity logs to keep logs consistent across tabs
    const renderActivityLogItem = (log: StudentActivityLog) => (
        <div key={log.id} className="p-4 border-l-4 border-primary-light bg-white shadow rounded-r-lg">
            <div className="flex justify-between items-start">
                <p className="text-xs text-slate-500 mb-1 font-semibold">{new Date(log.date).toLocaleString('pt-BR')}</p>
                {editingLogId !== log.id && (
                    <Button size="sm" variant="ghost" onClick={() => handleStartEdit(log)} title="Editar registro">
                        <PencilIcon className="w-4 h-4 text-slate-400 hover:text-primary"/>
                    </Button>
                )}
            </div>
            
            {editingLogId === log.id ? (
                <div className="mt-2 animate-fade-in">
                    <textarea 
                        value={editingLogText}
                        onChange={(e) => setEditingLogText(e.target.value)}
                        className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary outline-none"
                        rows={3}
                        autoFocus
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <XMarkIcon className="w-4 h-4 mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(log.id)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                            <CheckIcon className="w-4 h-4 mr-1" /> Salvar
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-slate-700 text-sm whitespace-pre-line">{log.description}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate('/alunos')} leftIcon={<ArrowUturnLeftIcon className="w-5 h-5"/>}>
                Voltar para lista de alunos
            </Button>

            <Card>
                <div className="p-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
                        <div className="text-center flex-shrink-0">
                            <img src={student.avatarUrl || 'https://via.placeholder.com/150'} alt={student.name} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"/>
                            <span className={`mt-4 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {student.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                        <div className="mt-4 md:mt-0 flex-1 w-full">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center md:text-left">{student.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm text-slate-700">
                                <div>
                                    <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Responsável</h4>
                                    <p>Nome: {student.guardianName || 'N/A'}</p>
                                    <p>Telefone: {student.guardianPhone || 'N/A'}</p>
                                    <p>Email: {student.guardianEmail || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Financeiro</h4>
                                    <p>NFe Mensal: <span className="font-semibold">{student.wantsMonthlyNFe ? 'Sim' : 'Não'}</span></p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Documentos</h4>
                                    <p>RG: {student.rg || 'N/A'}</p>
                                    <p>CPF: {student.cpf || 'N/A'}</p>
                                </div>
                                <div className="lg:col-span-3">
                                    <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Endereço</h4>
                                    <p>{student.address || 'Não informado'}</p>
                                    <p>
                                        {student.neighborhood && <span>{student.neighborhood}</span>}
                                        {student.city && <span>, {student.city}</span>}
                                        {student.postalCode && <span> - CEP: {student.postalCode}</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('progress')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'progress' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                        Acompanhamento
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'media' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                        Vídeos e Arquivos
                    </button>
                     <button
                        onClick={() => setActiveTab('ai')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${activeTab === 'ai' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-purple-500 hover:border-purple-300'}`}
                    >
                        <SparklesIcon className="w-4 h-4" />
                        <span>Assistente IA</span>
                    </button>
                </nav>
            </div>

            {activeTab === 'progress' && (
                <Card title="Acompanhamento de Atividades" actions={!showActivityForm && <Button onClick={() => setShowActivityForm(true)} leftIcon={<PlusCircleIcon className="w-4 h-4"/>}>Adicionar Registro</Button>}>
                   {showActivityForm && (
                        <form onSubmit={handleAddActivity} className="p-4 bg-slate-50 rounded-lg space-y-3 mb-4 border border-slate-200">
                            <label htmlFor="new-activity" className="block text-sm font-medium text-slate-700">Novo Registro de Atividade/Sessão</label>
                            <textarea id="new-activity" value={newActivity} onChange={(e) => setNewActivity(e.target.value)} required rows={4} className="w-full border border-slate-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setShowActivityForm(false)}>Cancelar</Button>
                                <Button type="submit">Salvar</Button>
                            </div>
                        </form>
                   )}
                    <div className="space-y-4 mt-4">
                        {studentActivity.map(log => renderActivityLogItem(log))}
                        {studentActivity.length === 0 && <p className="text-center text-slate-500">Nenhum registro encontrado.</p>}
                    </div>
                </Card>
            )}

            {activeTab === 'media' && (
                <Card title="Vídeos e Arquivos das Aulas" actions={!showMediaForm && <Button onClick={() => setShowMediaForm(true)} leftIcon={<DocumentArrowUpIcon className="w-4 h-4"/>}>Anexar Mídia</Button>}>
                     {showMediaForm && (
                        <form onSubmit={handleUploadBatch} className="p-4 bg-slate-50 rounded-lg space-y-4">
                            <h3 className="font-medium text-slate-700">Upload de Arquivos</h3>
                            
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                multiple
                                accept="image/*,video/*,application/pdf"
                            />
                            
                            {/* Clickable Dropzone Area */}
                            <div 
                                onClick={() => !isUploadingGlobal && fileInputRef.current?.click()}
                                className={`cursor-pointer mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-primary hover:bg-slate-100 transition-colors ${isUploadingGlobal ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="space-y-1 text-center">
                                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <p className="text-sm text-slate-600">
                                        <span className="font-medium text-primary">Clique para selecionar</span> ou arraste arquivos
                                    </p>
                                    <p className="text-xs text-slate-500">Imagens, Vídeos ou PDF (Seleção Múltipla)</p>
                                </div>
                            </div>

                            {/* Selected Files Queue with Progress Bars */}
                            {uploadQueue.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-slate-700">Fila de Upload ({uploadQueue.length}):</p>
                                    <ul className="space-y-2 max-h-60 overflow-y-auto bg-white p-2 rounded border border-slate-200">
                                        {uploadQueue.map((item) => (
                                            <li key={item.id} className="flex flex-col p-2 bg-slate-50 rounded border border-slate-100">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center overflow-hidden">
                                                        {item.status === 'completed' ? (
                                                            <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                        ) : item.status === 'uploading' ? (
                                                            <span className="animate-spin h-3 w-3 border-2 border-primary rounded-full border-t-transparent mr-2 flex-shrink-0"></span>
                                                        ) : (
                                                            <DocumentArrowUpIcon className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                                                        )}
                                                        <span className="truncate text-sm text-slate-700 font-medium" title={item.file.name}>
                                                            {item.file.name}
                                                        </span>
                                                        <span className="text-xs text-slate-400 ml-2">({(item.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                    </div>
                                                    
                                                    {item.status === 'idle' && !isUploadingGlobal && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleRemoveFromQueue(item.id)}
                                                            className="text-red-400 hover:text-red-600 ml-2"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {/* Progress Bar Container */}
                                                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                                                    <div 
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                                            item.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                                                        }`} 
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Input 
                                label="Descrição Geral (Opcional)" 
                                value={newMediaDescription} 
                                onChange={e => setNewMediaDescription(e.target.value)} 
                                placeholder="Será aplicada a todos os arquivos. Se vazio, usa o nome do arquivo."
                                disabled={isUploadingGlobal}
                            />
                            
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => {setShowMediaForm(false); setUploadQueue([]);}} disabled={isUploadingGlobal}>
                                    Fechar
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={uploadQueue.filter(i => i.status === 'idle').length === 0 || isUploadingGlobal}
                                    leftIcon={isUploadingGlobal ? <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span> : <CloudArrowUpIcon className="w-5 h-5" />}
                                >
                                    {isUploadingGlobal ? 'Enviando...' : `Enviar ${uploadQueue.filter(i => i.status === 'idle').length > 0 ? uploadQueue.filter(i => i.status === 'idle').length : ''} Arquivos`}
                                </Button>
                            </div>
                        </form>
                   )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {studentMedia.map(media => (
                            <div key={media.id} className="bg-slate-50 rounded-lg shadow p-3 flex items-start space-x-4">
                                <div className="flex-shrink-0">{getMediaIcon(media.type)}</div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-slate-800 truncate" title={media.description}>{media.description}</p>
                                    <p className="text-xs text-slate-500">Enviado em: {new Date(media.uploadDate).toLocaleDateString('pt-BR')}</p>
                                    <div className="flex space-x-3 mt-1">
                                        <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Visualizar</a>
                                        {media.type === 'image' && <span className="text-xs text-gray-400">| Imagem</span>}
                                        {media.type === 'video' && <span className="text-xs text-gray-400">| Vídeo</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {studentMedia.length === 0 && <div className="col-span-full text-center text-slate-500 py-4">Nenhuma mídia anexada.</div>}
                    </div>
                </Card>
            )}

            {activeTab === 'ai' && (
                <div className="space-y-6">
                    {/* Section to review context before generating */}
                    <Card title="Contexto da Análise (Últimos Registros)" className="border border-slate-200 dark:border-slate-700">
                        <div className="mb-4">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                A Inteligência Artificial utilizará os 10 registros mais recentes abaixo para gerar os relatórios. 
                                Você pode <span className="font-bold">editar</span> o conteúdo diretamente aqui para corrigir informações ou adicionar detalhes relevantes antes de gerar a análise.
                            </p>
                        </div>
                        <div className="max-h-64 overflow-y-auto space-y-3 pr-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700">
                             {studentActivity.length > 0 ? (
                                studentActivity.slice(0, 10).map(log => renderActivityLogItem(log))
                             ) : (
                                <p className="text-sm text-amber-600 italic">Nenhum registro de atividade encontrado para análise.</p>
                             )}
                        </div>
                    </Card>

                    <Card 
                        title="Gerar Insights com IA" 
                        className="border border-purple-200 dark:border-purple-900"
                        titleClassName="text-purple-700 dark:text-purple-400"
                    >
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <Button 
                                    onClick={handleGenerateSummary} 
                                    disabled={aiLoading || studentActivity.length === 0}
                                    className="bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
                                    leftIcon={aiLoading ? <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span> : <SparklesIcon className="w-5 h-5" />}
                                >
                                    {aiLoading ? 'Analisando...' : 'Gerar Relatório de Progresso'}
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={handleSuggestActivities}
                                    disabled={aiSuggestionsLoading || studentActivity.length === 0}
                                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                                    leftIcon={aiSuggestionsLoading ? <span className="animate-spin h-4 w-4 border-2 border-purple-600 rounded-full border-t-transparent"></span> : <LightBulbIcon className="w-5 h-5" />}
                                >
                                    {aiSuggestionsLoading ? 'Pensando...' : 'Sugerir Atividades'}
                                </Button>
                            </div>

                            {studentActivity.length === 0 && (
                                <p className="text-sm text-amber-600 mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                                    É necessário ter registros de acompanhamento para gerar relatórios ou sugestões.
                                </p>
                            )}

                            {aiSummary && (
                                <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                                        <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
                                        Análise Gerada
                                    </h4>
                                    <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-line">
                                        {aiSummary}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button size="sm" variant="ghost" onClick={() => {navigator.clipboard.writeText(aiSummary); addToast("Copiado para área de transferência")}}>Copiar Texto</Button>
                                    </div>
                                </div>
                            )}

                            {aiSuggestions && (
                                <div className="mt-6 p-6 bg-purple-50 dark:bg-slate-800/80 rounded-lg border border-purple-200 dark:border-purple-900 animate-fade-in">
                                    <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                                        <LightBulbIcon className="w-5 h-5 mr-2" />
                                        Sugestões de Atividades Personalizadas
                                    </h4>
                                    <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-line text-slate-700 dark:text-slate-300">
                                        {aiSuggestions}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button size="sm" variant="ghost" onClick={() => {navigator.clipboard.writeText(aiSuggestions); addToast("Copiado para área de transferência")}}>Copiar Sugestões</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default StudentDetailPage;
