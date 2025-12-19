// Export all services
export { default as apiClient } from './apiClient';
export { default as authService } from './authService';
export { default as branchService } from './branchService';

// Export types
export type { LoginCredentials, RegisterData, User, AuthResponse } from './authService';
export type { Branch, CreateBranchData, UpdateBranchData } from './branchService';
