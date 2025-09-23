import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';

export const useBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load budgets with optional filters
  const loadBudgets = useCallback(async (filters = {}) => {
    let isMounted = true;
    try {
      setIsLoading(true);
      setError(null);

      const response = await budgetService.getBudgets(filters);
      if (response.success && isMounted) {
        setBudgets(response.data.budgets || []);
      } else if (isMounted) {
        setError(response.message || 'Failed to load budgets');
      }
    } catch (err) {
      console.error('Error loading budgets:', err);
      if (isMounted) {
        setError(err.message || 'Failed to load budgets');
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Load active budgets
  const loadActiveBudgets = useCallback(async () => {
    let isMounted = true;
    try {
      setIsLoading(true);
      setError(null);

      const response = await budgetService.getActiveBudgets();
      if (response.success && isMounted) {
        setBudgets(response.data.budgets);
      }
    } catch (err) {
      if (isMounted) setError(err.message || 'Failed to load active budgets');
    } finally {
      if (isMounted) setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Load budget overview
  const loadBudgetOverview = useCallback(async () => {
    try {
      const response = await budgetService.getBudgetOverview();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load budget overview');
      throw err;
    }
  }, []);

  // Create budget
  const createBudget = useCallback(async (budgetData) => {
    try {
      const response = await budgetService.createBudget(budgetData);
      if (response.success) {
        await loadBudgets();
        return response.data.budget;
      }
    } catch (err) {
      setError(err.message || 'Failed to create budget');
      throw err;
    }
  }, [loadBudgets]);

  // Update budget
  const updateBudget = useCallback(async (budgetId, budgetData) => {
    try {
      const response = await budgetService.updateBudget(budgetId, budgetData);
      if (response.success) {
        await loadBudgets();
        return response.data.budget;
      }
    } catch (err) {
      setError(err.message || 'Failed to update budget');
      throw err;
    }
  }, [loadBudgets]);

  // Delete budget
  const deleteBudget = useCallback(async (budgetId) => {
    try {
      const response = await budgetService.deleteBudget(budgetId);
      if (response.success) {
        setBudgets(prev => prev.filter(b => b._id !== budgetId));
        return true;
      }
    } catch (err) {
      setError(err.message || 'Failed to delete budget');
      throw err;
    }
  }, []);

  // Toggle budget status
  const toggleBudgetStatus = useCallback(async (budgetId) => {
    try {
      const response = await budgetService.toggleBudgetStatus(budgetId);
      if (response.success) {
        setBudgets(prev =>
          prev.map(budget =>
            budget._id === budgetId
              ? { ...budget, isActive: !budget.isActive }
              : budget
          )
        );
        return response.data.budget;
      }
    } catch (err) {
      setError(err.message || 'Failed to toggle budget status');
      throw err;
    }
  }, []);

  // Get budget by ID
  const getBudget = useCallback(async (budgetId) => {
    try {
      const response = await budgetService.getBudget(budgetId);
      if (response.success) {
        return response.data.budget;
      }
    } catch (err) {
      setError(err.message || 'Failed to get budget');
      throw err;
    }
  }, []);

  // Create monthly budget
  const createMonthlyBudget = useCallback(async (category, amount, alertThreshold = 80) => {
    try {
      const response = await budgetService.createMonthlyBudget(category, amount, alertThreshold);
      if (response.success) {
        await loadBudgets();
        return response.data.budget;
      }
    } catch (err) {
      setError(err.message || 'Failed to create monthly budget');
      throw err;
    }
  }, [loadBudgets]);

  // Get budget statistics
  const getBudgetStats = useCallback(() => {
    const activeBudgets = budgets.filter(b => b.isActive);
    const totalBudgeted = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = activeBudgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalRemaining = totalBudgeted - totalSpent;
    
    const statusBreakdown = {
      onTrack: activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'on-track').length,
      warning: activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'warning').length,
      exceeded: activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'exceeded').length
    };

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining,
      budgetCount: activeBudgets.length,
      statusBreakdown,
      averageSpent: activeBudgets.length > 0 ? totalSpent / activeBudgets.length : 0
    };
  }, [budgets]);

  // Get budget alerts
  const getBudgetAlerts = useCallback(() => {
    return budgetService.getBudgetAlerts(budgets.filter(b => b.isActive));
  }, [budgets]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    budgets,
    isLoading,
    error,
    loadBudgets,
    loadActiveBudgets,
    loadBudgetOverview,
    createBudget,
    updateBudget,
    deleteBudget,
    toggleBudgetStatus,
    getBudget,
    createMonthlyBudget,
    getBudgetStats,
    getBudgetAlerts,
    clearError
  };
};
