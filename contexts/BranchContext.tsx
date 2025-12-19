import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Branch } from '../types';
import { useAuth } from './AuthContext';
import branchService from '../src/services/branchService';

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  loading: boolean;
  selectBranch: (branch: Branch) => void;
  addBranch: (branchData: Partial<Branch>) => Promise<void>;
  updateBranch: (branchId: string, branchData: Partial<Branch>) => Promise<void>;
  deleteBranch: (branchId: string) => Promise<void>;
  refreshBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const SELECTED_BRANCH_KEY = 'equipe_rafael_barros_selected_branch';

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  /**
   * Load branches from API
   */
  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await branchService.getAll();
      setBranches(data);

      // Auto-select first branch if none selected
      if (data.length > 0 && !selectedBranch) {
        const savedBranchId = localStorage.getItem(SELECTED_BRANCH_KEY);
        const branchToSelect = savedBranchId
          ? data.find(b => b.id === savedBranchId) || data[0]
          : data[0];

        setSelectedBranch(branchToSelect);
        localStorage.setItem(SELECTED_BRANCH_KEY, branchToSelect.id);
      }
    } catch (error) {
      console.error('Failed to load branches:', error);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load branches on mount and when user changes
   */
  useEffect(() => {
    if (user) {
      loadBranches();
    } else {
      // Clear branches when user logs out
      setBranches([]);
      setSelectedBranch(null);
      localStorage.removeItem(SELECTED_BRANCH_KEY);
    }
  }, [user]);

  /**
   * Validate selected branch still exists
   */
  useEffect(() => {
    if (!loading && selectedBranch && branches.length > 0) {
      const stillExists = branches.find(b => b.id === selectedBranch.id);
      if (!stillExists) {
        // Selected branch was deleted, select first available
        const newSelection = branches[0];
        setSelectedBranch(newSelection);
        localStorage.setItem(SELECTED_BRANCH_KEY, newSelection.id);
      }
    }
  }, [branches, selectedBranch, loading]);

  /**
   * Select a branch
   */
  const selectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    localStorage.setItem(SELECTED_BRANCH_KEY, branch.id);
  };

  /**
   * Add new branch
   */
  const addBranch = async (branchData: Partial<Branch>) => {
    try {
      const newBranch = await branchService.create(branchData as any);
      setBranches(prev => [...prev, newBranch]);

      // Auto-select the new branch
      selectBranch(newBranch);
    } catch (error) {
      console.error('Failed to add branch:', error);
      throw error;
    }
  };

  /**
   * Update existing branch
   */
  const updateBranch = async (branchId: string, branchData: Partial<Branch>) => {
    try {
      const updatedBranch = await branchService.update(branchId, branchData);

      setBranches(prev =>
        prev.map(b => (b.id === branchId ? updatedBranch : b))
      );

      // Update selected branch if it's the one being edited
      if (selectedBranch?.id === branchId) {
        setSelectedBranch(updatedBranch);
      }
    } catch (error) {
      console.error('Failed to update branch:', error);
      throw error;
    }
  };

  /**
   * Delete branch
   */
  const deleteBranch = async (branchId: string) => {
    try {
      await branchService.delete(branchId);
      setBranches(prev => prev.filter(b => b.id !== branchId));
    } catch (error) {
      console.error('Failed to delete branch:', error);
      throw error;
    }
  };

  /**
   * Refresh branches from API
   */
  const refreshBranches = async () => {
    await loadBranches();
  };

  const value = {
    branches,
    selectedBranch,
    loading,
    selectBranch,
    addBranch,
    updateBranch,
    deleteBranch,
    refreshBranches,
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = (): BranchContextType => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within an BranchProvider');
  }
  return context;
};
