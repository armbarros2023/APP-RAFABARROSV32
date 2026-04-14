// API Client para comunicação com o backend
import axios from 'axios';

// Em desenvolvimento local, sempre usar o proxy do Vite para evitar
// depender da API remota configurada para produção/homologação.
const API_BASE_URL = import.meta.env.DEV
    ? '/api'
    : import.meta.env.VITE_API_URL || '/api';

// Criar instância do axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Interceptor para tratar erros de autenticação
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido ou expirado - limpar estado local
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
