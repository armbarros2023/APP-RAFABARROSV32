// Serviço de Filiais
import apiClient from './apiClient';

export interface Branch {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    cnpj?: string;
    stateRegistration?: string;
    email?: string;
    responsible?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBranchData {
    name: string;
    address?: string;
    phone?: string;
    cnpj?: string;
    stateRegistration?: string;
    email?: string;
    responsible?: string;
}

export interface UpdateBranchData extends Partial<CreateBranchData> { }

class BranchService {
    /**
     * Listar todas as filiais
     */
    async getAll(): Promise<Branch[]> {
        const response = await apiClient.get<Branch[]>('/branches');
        return response.data;
    }

    /**
     * Buscar filial por ID
     */
    async getById(id: string): Promise<Branch> {
        const response = await apiClient.get<Branch>(`/branches/${id}`);
        return response.data;
    }

    /**
     * Criar nova filial (apenas admin)
     */
    async create(data: CreateBranchData): Promise<Branch> {
        const response = await apiClient.post<Branch>('/branches', data);
        return response.data;
    }

    /**
     * Atualizar filial (apenas admin)
     */
    async update(id: string, data: UpdateBranchData): Promise<Branch> {
        const response = await apiClient.put<Branch>(`/branches/${id}`, data);
        return response.data;
    }

    /**
     * Deletar filial (apenas admin)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/branches/${id}`);
    }
}

export default new BranchService();
