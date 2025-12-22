// API Client para comunicação com o backend
import axios from 'axios';

// Base URL da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
console.log('🔗 API Base URL:', API_BASE_URL);

// Criar instância do axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT em todas as requisições
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido ou expirado
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Não forçar recarregamento da página, deixar o estado do React lidar com isso
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;
