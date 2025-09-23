import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetList from '../components/budget/BudgetList';
import BudgetOverview from '../components/budget/BudgetOverview';
import BudgetProgress from '../components/budget/BudgetProgress';
import BudgetTemplates from '../components/budget/BudgetTemplates';
import BudgetInsights from '../components/budget/BudgetInsights';
import BudgetGoals from '../components/budget/BudgetGoals';
import BudgetNotifications from '../components/budget/BudgetNotifications';
import BudgetComparison from '../components/budget/BudgetComparison';
import { budgetService } from '../services/budgetService';
import { useBudget } from '../hooks/useBudget';

const Budget = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTemplates, setShowTemplates] = useState(false);
  const [transactions, setTransactions] = useState([]);
  
  const {
    budgets,
    isLoading,
    error,
    loadBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    toggleBudgetStatus,
    createMonthlyBudget,
    getBudgetStats,
    getBudgetAlerts,
    clearError
  } = useBudget();

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  // Handle create budget
  const handleCreateBudget = async (budgetData) => {
    try {
      await createBudget(budgetData);
      setShowForm(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Handle edit budget
  const handleEditBudget = async (budgetData) => {
    try {
      await updateBudget(editingBudget._id, budgetData);
      setEditingBudget(null);
      setShowForm(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Handle delete budget
  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId);
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  // Toggle budget status
  const handleToggleBudget = async (budgetId) => {
    try {
      await toggleBudgetStatus(budgetId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Handle template selection
  const handleTemplateSelect = async (templateBudgets) => {
    try {
      for (const budgetData of templateBudgets) {
        await createBudget(budgetData);
      }
      setShowTemplates(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Handle goal actions
  const handleGoalCreate = async (goalData) => {
    // In a real app, this would call an API
    console.log('Creating goal:', goalData);
  };

  const handleGoalUpdate = async (goalId, goalData) => {
    // In a real app, this would call an API
    console.log('Updating goal:', goalId, goalData);
  };

  const handleGoalDelete = async (goalId) => {
    // In a real app, this would call an API
    console.log('Deleting goal:', goalId);
  };

  // Handle notification dismiss
  const handleNotificationDismiss = (notificationId) => {
    // In a real app, this would update the notification state
    console.log('Dismissing notification:', notificationId);
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

  if (showTemplates) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Budget Templates</h1>
              <p className="text-gray-600">Choose a pre-configured budget template</p>
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="btn-outline"
            >
              Back to Budgets
            </button>
          </div>
          <BudgetTemplates
            onTemplateSelect={handleTemplateSelect}
            isLoading={isLoading}
          />
        </div>
      </Layout>
    );
  }

  // Simple KPI calculations for the dashboard header
  const activeBudgets = budgets.filter(b => b.isActive);
  const totalBudgeted = activeBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Dashboard Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">Budget Dashboard</h1>
              <p className="opacity-90">Track budgets, spending and alerts at a glance</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowTemplates(true)} className="inline-flex items-center rounded-full px-4 py-2 border border-white/50 text-white/95 hover:bg-white/10 transition">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Templates
              </button>
              <button onClick={() => setShowForm(true)} className="inline-flex items-center rounded-full px-4 py-2 bg-white text-indigo-700 font-medium hover:bg-white/90 transition shadow-sm">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Budget
              </button>
            </div>
          </div>
          {/* KPI Strip */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/15 backdrop-blur p-4 shadow-sm">
              <p className="text-sm opacity-90">Total Budgeted</p>
              <p className="text-2xl font-semibold">${totalBudgeted.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur p-4 shadow-sm">
              <p className="text-sm opacity-90">Total Spent</p>
              <p className="text-2xl font-semibold">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur p-4 shadow-sm">
              <p className="text-sm opacity-90">Remaining</p>
              <p className="text-2xl font-semibold">${Math.max(0, totalRemaining).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="">
          <nav className="flex overflow-x-auto gap-2 bg-gray-100 rounded-full p-1">
            {[
              { key: 'overview', label: 'Overview', icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
              )},
              { key: 'budgets', label: `All Budgets (${budgets.length})`, icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
              )},
              { key: 'insights', label: 'Insights', icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3v18m-4-4l8-8m0 12l-8-8" /></svg>
              )},
              { key: 'goals', label: 'Goals', icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l-2 4H6l4 2-2 4 4-2 4 2-2-4 4-2h-4l-2-4z" /></svg>
              )},
              { key: 'comparison', label: 'Comparison', icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h6v18H3zM15 9h6v12h-6z" /></svg>
              )}
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                  activeTab === tab.key
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
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

        {/* Notifications */}
        <BudgetNotifications
          budgets={budgets}
          onNotificationDismiss={handleNotificationDismiss}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <BudgetOverview budgets={budgets} isLoading={isLoading} />
        )}

        {activeTab === 'budgets' && (
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
                  <div className="flex justify-center space-x-3">
                    <button onClick={() => setShowTemplates(true)} className="btn-outline">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Use Template
                    </button>
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Budget
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'insights' && (
          <BudgetInsights budgets={budgets} transactions={transactions} />
        )}

        {activeTab === 'goals' && (
          <BudgetGoals
            budgets={budgets}
            onGoalCreate={handleGoalCreate}
            onGoalUpdate={handleGoalUpdate}
            onGoalDelete={handleGoalDelete}
          />
        )}

        {activeTab === 'comparison' && (
          <BudgetComparison budgets={budgets} />
        )}
      </div>
    </Layout>
  );
};

export default Budget;
