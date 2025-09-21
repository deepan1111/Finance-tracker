import React from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetOverview = ({ budgets = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate overview statistics
  const activeBudgets = budgets.filter(b => b.isActive);
  const totalBudgeted = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = activeBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  
  // Get budget alerts
  const alerts = budgetService.getBudgetAlerts(activeBudgets);
  
  // Status breakdown
  const statusBreakdown = {
    onTrack: activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'on-track').length,
    warning: activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'warning').length,
    exceeded: activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'exceeded').length
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Budgeted */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgeted</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBudgeted)}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-danger-600">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="h-12 w-12 bg-danger-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(Math.abs(totalRemaining))}
              </p>
              {totalRemaining < 0 && (
                <p className="text-xs text-danger-600">Over budget</p>
              )}
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              totalRemaining >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              <svg className={`h-6 w-6 ${totalRemaining >= 0 ? 'text-success-600' : 'text-danger-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Budgets */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Budgets</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeBudgets.length}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span className="text-sm text-gray-600">On Track</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statusBreakdown.onTrack}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Warning</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statusBreakdown.warning}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Exceeded</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statusBreakdown.exceeded}</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">
                {totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  totalSpent > totalBudgeted ? 'bg-danger-500' : 'bg-primary-500'
                }`}
                style={{ 
                  width: `${Math.min(100, totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Budget Alerts
            {alerts.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                {alerts.length}
              </span>
            )}
          </h3>
          
          {alerts.length === 0 ? (
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-500">All budgets are on track!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    alert.status === 'exceeded' ? 'bg-danger-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs font-medium ${
                      alert.status === 'exceeded' ? 'text-danger-600' : 'text-yellow-600'
                    }`}>
                      {Math.round(alert.percentageSpent)}%
                    </span>
                  </div>
                </div>
              ))}
              {alerts.length > 5 && (
                <p className="text-xs text-gray-500 text-center">
                  +{alerts.length - 5} more alerts
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;