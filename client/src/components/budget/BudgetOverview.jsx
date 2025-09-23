import React, { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetOverview = ({ budgets = [], isLoading = false }) => {
  const [warnings, setWarnings] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [isLoadingWarnings, setIsLoadingWarnings] = useState(false);

  useEffect(() => {
    const loadWarnings = async () => {
      try {
        setIsLoadingWarnings(true);
        const response = await budgetService.getBudgetWarnings();
        if (response.success) {
          setWarnings(response.data.warnings);
        }
      } catch (error) {
        console.error('Error loading budget warnings:', error);
      } finally {
        setIsLoadingWarnings(false);
      }
    };

    loadWarnings();
  }, [budgets]);

  useEffect(() => {
    // Calculate budget progress from budgets prop
    if (budgets.length > 0) {
      const progress = budgets.map(budget => {
        const now = new Date();
        const startDate = new Date(budget.startDate);
        const endDate = new Date(budget.endDate);
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysPassed = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
        const expectedProgress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
        const actualProgress = budget.percentageSpent;
        
        return {
          ...budget,
          expectedProgress: Math.round(expectedProgress),
          actualProgress: Math.round(actualProgress),
          isOnTrack: actualProgress <= expectedProgress + 10, // Allow 10% variance
          daysRemaining: budgetService.getDaysRemaining(budget.endDate)
        };
      });
      setBudgetProgress(progress);
    }
  }, [budgets]);
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

        {/* Budget Warnings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Budget Warnings
            {warnings.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                {warnings.length}
              </span>
            )}
          </h3>
          
          {isLoadingWarnings ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : warnings.length === 0 ? (
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-500">All budgets are on track!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {warnings.slice(0, 5).map((warning) => (
                <div key={warning.budgetId} className={`p-3 rounded-lg ${
                  warning.severity === 'high' ? 'bg-danger-50 border border-danger-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      warning.severity === 'high' ? 'bg-danger-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{warning.budgetName}</p>
                      <p className="text-xs text-gray-600 mt-1">{warning.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {warning.daysRemaining} days remaining
                        </span>
                        <span className={`text-xs font-medium ${
                          warning.severity === 'high' ? 'text-danger-600' : 'text-yellow-600'
                        }`}>
                          {Math.round(warning.percentageSpent)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {warnings.length > 5 && (
                <p className="text-xs text-gray-500 text-center">
                  +{warnings.length - 5} more warnings
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Budget Progress Tracking */}
      {budgetProgress.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Progress Tracking</h3>
          <div className="space-y-4">
            {budgetProgress.map((budget) => (
              <div key={budget._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: budget.color || '#3B82F6' }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{budget.name}</h4>
                      <p className="text-sm text-gray-600">
                        {budgetService.getCategoryInfo(budget.category).label} • {budget.period}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {budget.daysRemaining} days remaining
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{budget.actualProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        budget.status === 'exceeded' ? 'bg-danger-500' : 
                        budget.status === 'warning' ? 'bg-yellow-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${Math.min(100, budget.actualProgress)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Expected vs Actual Progress */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Expected:</span>
                    <span className="ml-2 font-medium">{budget.expectedProgress}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Actual:</span>
                    <span className={`ml-2 font-medium ${
                      budget.isOnTrack ? 'text-success-600' : 'text-warning-600'
                    }`}>
                      {budget.actualProgress}%
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      budget.status === 'exceeded' ? 'bg-danger-500' :
                      budget.status === 'warning' ? 'bg-yellow-500' : 'bg-success-500'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      budget.status === 'exceeded' ? 'text-danger-600' :
                      budget.status === 'warning' ? 'text-yellow-600' : 'text-success-600'
                    }`}>
                      {budgetService.getStatusLabel(budget.status)}
                    </span>
                  </div>
                  {!budget.isOnTrack && (
                    <span className="text-xs text-warning-600">
                      {budget.actualProgress > budget.expectedProgress ? 'Ahead of schedule' : 'Behind schedule'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;