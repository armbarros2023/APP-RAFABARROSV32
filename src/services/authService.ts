// Serviço de Autenticação
import apiClient from './apiClient';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'THERAPIST';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'THERAPIST';
    createdAt?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

class AuthService {
    /**
     * Fazer login
     */
    async login(credentials: LoginCredentials): Promise<{ user: User }> {
        const response = await apiClient.post<{ user: User }>('/auth/login', credentials);

        // Salvar usuário no localStorage para persistência de estado (não sensível)
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    }

    /**
     * Registrar novo usuário
     */
    async register(data: RegisterData): Promise<{ user: User }> {
        const response = await apiClient.post<{ user: User }>('/auth/register', data);

        // Salvar usuário no localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    }

    /**
     * Obter usuário atual
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me');

        // Atualizar usuário no localStorage
        localStorage.setItem('user', JSON.stringify(response.data));

        return response.data;
    }

    /**
     * Fazer logout
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('user');
        }
    }

    /**
     * Verificar se está autenticado
     * Observação: Com cookies, a verificação final é feita pelo backend nas requisições.
     * Mantemos o check do user no localStorage para UI.
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('user');
    }

    /**
     * Obter usuário do localStorage
     */
    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
}

export default new AuthService();
