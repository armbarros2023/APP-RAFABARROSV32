// Export all services
export { default as apiClient } from './apiClient';
export { default as authService } from './authService';
export { default as branchService } from './branchService';
export { default as appointmentService } from './appointmentService';
export { default as financialTransactionService } from './financialTransactionService';
export { default as staffService } from './staffService';
export { default as studentService } from './studentService';

// Export types
export type { LoginCredentials, RegisterData, User, AuthResponse } from './authService';
export type { Branch, CreateBranchData, UpdateBranchData } from './branchService';
