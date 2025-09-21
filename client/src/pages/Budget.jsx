import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetList from '../components/budget/BudgetList';
import BudgetOverview from '../components/budget/BudgetOverview';
import { budgetService } from '../services/budgetService';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'budgets'

  // Load budgets
  const loadBudgets = useCallback(async () => {
    let isMounted = true;
    try {
      setIsLoading(true);
      setError(null);

      const response = await budgetService.getBudgets();
      if (response.success && isMounted) {
        setBudgets(response.data.budgets);
      }
    } catch (err) {
      if (isMounted) setError(err.message || 'Failed to load budgets');
    } finally {
      if (isMounted) setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  // Handle create budget
  const handleCreateBudget = async (budgetData) => {
    try {
      const response = await budgetService.createBudget(budgetData);
      if (response.success) {
        setShowForm(false);
        await loadBudgets();
      }
    } catch (err) {
      setError(err.message || 'Failed to create budget');
    }
  };

  // Handle edit budget
  const handleEditBudget = async (budgetData) => {
    try {
      const response = await budgetService.updateBudget(editingBudget._id, budgetData);
      if (response.success) {
        setEditingBudget(null);
        setShowForm(false);
        await loadBudgets();
      }
    } catch (err) {
      setError(err.message || 'Failed to update budget');
    }
  };

  // Handle delete budget
  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await budgetService.deleteBudget(budgetId);
        if (response.success) {
          setBudgets(prev => prev.filter(b => b._id !== budgetId));
        }
      } catch (err) {
        setError(err.message || 'Failed to delete budget');
      }
    }
  };

  // Toggle budget status
  const handleToggleBudget = async (budgetId) => {
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
      }
    } catch (err) {
      setError(err.message || 'Failed to toggle budget status');
    }
  };

  // UI Helpers
  const handleEditClick = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  if (showForm) {
    return (
      <Layout>
        <BudgetForm
          onSubmit={editingBudget ? handleEditBudget : handleCreateBudget}
          onCancel={handleFormCancel}
          initialData={editingBudget}
          isEdit={!!editingBudget}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
            <p className="text-gray-600">Set and track your spending limits</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Budget
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'budgets'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Budgets ({budgets.length})
            </button>
          </nav>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-danger-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <BudgetOverview budgets={budgets} isLoading={isLoading} />
        ) : (
          <>
            <BudgetList
              budgets={budgets}
              isLoading={isLoading}
              onEdit={handleEditClick}
              onDelete={handleDeleteBudget}
              onToggle={handleToggleBudget}
            />

            {!isLoading && budgets.length === 0 && !error && (
              <>
                {/* Empty State */}
                <div className="card text-center py-12">
                  <svg
                    className="h-16 w-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets created yet</h3>
                  <p className="text-gray-600 mb-6">Start managing your finances by creating your first budget.</p>
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Budget
                  </button>
                </div>

                {/* Quick Templates */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Budget Templates</h3>
                  <p className="text-gray-600 mb-6">Get started with these common budget categories:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { category: 'food', label: 'Food & Dining', amount: 600, color: '#EF4444' },
                      { category: 'transport', label: 'Transportation', amount: 400, color: '#F97316' },
                      { category: 'entertainment', label: 'Entertainment', amount: 300, color: '#EAB308' },
                      { category: 'shopping', label: 'Shopping', amount: 500, color: '#22C55E' },
                      { category: 'bills', label: 'Bills & Utilities', amount: 800, color: '#06B6D4' },
                      { category: 'healthcare', label: 'Healthcare', amount: 200, color: '#3B82F6' }
                    ].map((template) => (
                      <button
                        key={template.category}
                        onClick={async () => {
                          try {
                            await budgetService.createMonthlyBudget(template.category, template.amount);
                            await loadBudgets();
                          } catch (err) {
                            setError(err.message || 'Failed to create budget');
                          }
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.color }}></div>
                          <div>
                            <h4 className="font-medium text-gray-900">{template.label}</h4>
                            <p className="text-sm text-gray-600">${template.amount}/month</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Budget;
