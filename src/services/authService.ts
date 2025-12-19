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
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        console.log('🔐 Tentando login com:', credentials);
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        console.log('✅ Login bem-sucedido:', response.data);

        // Salvar token e usuário no localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    }

    /**
     * Registrar novo usuário
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        // Salvar token e usuário no localStorage
        localStorage.setItem('token', response.data.token);
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
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    /**
     * Verificar se está autenticado
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
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

    /**
     * Obter token do localStorage
     */
    getToken(): string | null {
        return localStorage.getItem('token');
    }
}

export default new AuthService();
