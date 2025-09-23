import React from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetInsights = ({ budgets = [], transactions = [] }) => {
  // Calculate insights
  const activeBudgets = budgets.filter(b => b.isActive);
  const totalBudgeted = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = activeBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  // Get current month's transactions
  const currentMonth = new Date();
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth.getMonth() && 
           transactionDate.getFullYear() === currentMonth.getFullYear();
  });

  // Calculate spending trends
  const getSpendingTrend = (budget) => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const daysPassed = currentMonth.getDate();
    const expectedSpent = (budget.amount / daysInMonth) * daysPassed;
    const actualSpent = budget.spent;
    
    if (actualSpent > expectedSpent * 1.1) return 'over-trend';
    if (actualSpent < expectedSpent * 0.9) return 'under-trend';
    return 'on-trend';
  };

  // Get recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    // Overspending recommendations
    const exceededBudgets = activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'exceeded');
    if (exceededBudgets.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Budget Exceeded',
        message: `You've exceeded ${exceededBudgets.length} budget${exceededBudgets.length > 1 ? 's' : ''}. Consider reducing spending in these categories.`,
        action: 'Review spending patterns'
      });
    }

    // Warning budgets
    const warningBudgets = activeBudgets.filter(b => budgetService.getBudgetStatus(b) === 'warning');
    if (warningBudgets.length > 0) {
      recommendations.push({
        type: 'info',
        title: 'Approaching Limits',
        message: `${warningBudgets.length} budget${warningBudgets.length > 1 ? 's are' : ' is'} approaching the spending limit.`,
        action: 'Monitor closely'
      });
    }

    // Under-spending opportunities
    const underSpendingBudgets = activeBudgets.filter(b => {
      const trend = getSpendingTrend(b);
      return trend === 'under-trend' && b.spent < b.amount * 0.5;
    });
    if (underSpendingBudgets.length > 0) {
      recommendations.push({
        type: 'success',
        title: 'Savings Opportunity',
        message: `You're under-spending in ${underSpendingBudgets.length} categor${underSpendingBudgets.length > 1 ? 'ies' : 'y'}. Consider reallocating funds.`,
        action: 'Optimize budget allocation'
      });
    }

    // No budgets recommendation
    if (activeBudgets.length === 0) {
      recommendations.push({
        type: 'info',
        title: 'Start Budgeting',
        message: 'Create your first budget to start tracking your spending and saving money.',
        action: 'Create budget'
      });
    }

    return recommendations;
  };

  // Get top spending categories
  const getTopSpendingCategories = () => {
    const categorySpending = {};
    
    activeBudgets.forEach(budget => {
      if (!categorySpending[budget.category]) {
        categorySpending[budget.category] = {
          category: budget.category,
          label: budgetService.getCategoryInfo(budget.category).label,
          spent: 0,
          budgeted: 0,
          color: budget.color || budgetService.getCategoryInfo(budget.category).color
        };
      }
      categorySpending[budget.category].spent += budget.spent;
      categorySpending[budget.category].budgeted += budget.amount;
    });

    return Object.values(categorySpending)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);
  };

  const recommendations = getRecommendations();
  const topCategories = getTopSpendingCategories();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0}%
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining Budget</p>
              <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                ${Math.abs(totalRemaining).toLocaleString()}
              </p>
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

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Budgets</p>
              <p className="text-2xl font-bold text-gray-900">{activeBudgets.length}</p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          {recommendations.length === 0 ? (
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-500">All budgets are on track!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  rec.type === 'warning' ? 'bg-danger-50 border border-danger-200' :
                  rec.type === 'success' ? 'bg-success-50 border border-success-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      rec.type === 'warning' ? 'bg-danger-500' :
                      rec.type === 'success' ? 'bg-success-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{rec.message}</p>
                      <p className="text-xs font-medium text-gray-700 mt-1">{rec.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Spending Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
          {topCategories.length === 0 ? (
            <div className="text-center py-6">
              <svg className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm text-gray-500">No spending data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.label}</p>
                      <p className="text-xs text-gray-500">
                        {category.budgeted > 0 ? Math.round((category.spent / category.budgeted) * 100) : 0}% of budget
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${category.spent.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      of ${category.budgeted.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetInsights;
