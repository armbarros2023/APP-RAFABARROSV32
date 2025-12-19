/**
 * Utilitários de Validação de Dados
 * 
 * Este arquivo contém funções para validar e sanitizar dados de entrada.
 * Importante para prevenir XSS, injeção e garantir integridade dos dados.
 */

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida CPF brasileiro
 * Remove formatação e valida dígitos verificadores
 */
export const validateCPF = (cpf: string): boolean => {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    // Valida primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleanCPF.charAt(9))) return false;

    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleanCPF.charAt(10))) return false;

    return true;
};

/**
 * Valida CNPJ brasileiro
 * Remove formatação e valida dígitos verificadores
 */
export const validateCNPJ = (cnpj: string): boolean => {
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

    // Verifica se tem 14 dígitos
    if (cleanCNPJ.length !== 14) return false;

    // Verifica se todos os dígitos são iguais (CNPJ inválido)
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

    // Valida primeiro dígito verificador
    let length = cleanCNPJ.length - 2;
    let numbers = cleanCNPJ.substring(0, length);
    const digits = cleanCNPJ.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    // Valida segundo dígito verificador
    length = length + 1;
    numbers = cleanCNPJ.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
};

/**
 * Valida telefone brasileiro
 * Aceita formatos: (11) 98888-8888, 11988888888, etc.
 */
export const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    // Telefone fixo: 10 dígitos (DDD + 8 dígitos)
    // Celular: 11 dígitos (DDD + 9 dígitos)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
};

/**
 * Valida CEP brasileiro
 */
export const validateCEP = (cep: string): boolean => {
    const cleanCEP = cep.replace(/[^\d]/g, '');
    return cleanCEP.length === 8;
};

/**
 * Sanitiza string removendo caracteres HTML perigosos
 * Previne XSS básico
 */
export const sanitizeString = (str: string): string => {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/gi;
    return str.replace(reg, (match) => map[match]);
};

/**
 * Formata CPF para exibição
 * 12345678901 -> 123.456.789-01
 */
export const formatCPF = (cpf: string): string => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    if (cleanCPF.length !== 11) return cpf;
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CNPJ para exibição
 * 12345678000190 -> 12.345.678/0001-90
 */
export const formatCNPJ = (cnpj: string): string => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    if (cleanCNPJ.length !== 14) return cnpj;
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formata telefone para exibição
 * 11988888888 -> (11) 98888-8888
 */
export const formatPhone = (phone: string): string => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length === 11) {
        return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
        return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
};

/**
 * Formata CEP para exibição
 * 12345678 -> 12345-678
 */
export const formatCEP = (cep: string): string => {
    const cleanCEP = cep.replace(/[^\d]/g, '');
    if (cleanCEP.length !== 8) return cep;
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Valida senha forte
 * Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número
 */
export const validateStrongPassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('A senha deve ter no mínimo 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('A senha deve conter pelo menos um número');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('A senha deve conter pelo menos um caractere especial');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Valida data no formato brasileiro (DD/MM/YYYY)
 */
export const validateDate = (date: string): boolean => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) return false;

    const [, day, month, year] = date.match(dateRegex) || [];
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    if (y < 1900 || y > 2100) return false;

    // Verifica dias por mês
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Ano bissexto
    if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
        daysInMonth[1] = 29;
    }

    return d <= daysInMonth[m - 1];
};

/**
 * Valida se o valor é um número positivo
 */
export const validatePositiveNumber = (value: number | string): boolean => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && num > 0;
};

/**
 * Valida URL
 */
export const validateURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Remove espaços extras de uma string
 */
export const trimExtraSpaces = (str: string): string => {
    return str.trim().replace(/\s+/g, ' ');
};

/**
 * Valida se uma string não está vazia (após trim)
 */
export const isNotEmpty = (str: string): boolean => {
    return str.trim().length > 0;
};

/**
 * Valida comprimento mínimo e máximo de string
 */
export const validateLength = (
    str: string,
    min: number,
    max: number
): boolean => {
    const length = str.trim().length;
    return length >= min && length <= max;
};
