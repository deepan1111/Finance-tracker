import React, { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetComparison = ({ budgets = [], currentMonth = new Date() }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [comparisonData, setComparisonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateComparisonData();
  }, [budgets, selectedPeriod, currentMonth]);

  const generateComparisonData = () => {
    setIsLoading(true);
    
    // Group budgets by category
    const categoryData = {};
    
    budgets.forEach(budget => {
      if (!categoryData[budget.category]) {
        categoryData[budget.category] = {
          category: budget.category,
          label: budgetService.getCategoryInfo(budget.category).label,
          color: budgetService.getCategoryInfo(budget.category).color,
          current: { budgeted: 0, spent: 0 },
          previous: { budgeted: 0, spent: 0 },
          budgets: []
        };
      }
      
      categoryData[budget.category].budgets.push(budget);
      
      // Determine if this is current or previous period
      const budgetStart = new Date(budget.startDate);
      const budgetEnd = new Date(budget.endDate);
      const currentStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const currentEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      const previousStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const previousEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
      
      if (budgetStart >= currentStart && budgetEnd <= currentEnd) {
        categoryData[budget.category].current.budgeted += budget.amount;
        categoryData[budget.category].current.spent += budget.spent;
      } else if (budgetStart >= previousStart && budgetEnd <= previousEnd) {
        categoryData[budget.category].previous.budgeted += budget.amount;
        categoryData[budget.category].previous.spent += budget.spent;
      }
    });

    // Calculate comparison metrics
    const comparison = Object.values(categoryData).map(category => {
      const currentUtilization = category.current.budgeted > 0 
        ? (category.current.spent / category.current.budgeted) * 100 
        : 0;
      const previousUtilization = category.previous.budgeted > 0 
        ? (category.previous.spent / category.previous.budgeted) * 100 
        : 0;
      
      const budgetChange = category.previous.budgeted > 0 
        ? ((category.current.budgeted - category.previous.budgeted) / category.previous.budgeted) * 100 
        : 0;
      
      const spendingChange = category.previous.spent > 0 
        ? ((category.current.spent - category.previous.spent) / category.previous.spent) * 100 
        : 0;

      return {
        ...category,
        currentUtilization: Math.round(currentUtilization),
        previousUtilization: Math.round(previousUtilization),
        budgetChange: Math.round(budgetChange),
        spendingChange: Math.round(spendingChange),
        utilizationChange: Math.round(currentUtilization - previousUtilization)
      };
    });

    setComparisonData(comparison);
    setIsLoading(false);
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-danger-600';
    if (change < 0) return 'text-success-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Budget Comparison</h3>
          <p className="text-sm text-gray-600">Compare current vs previous period spending</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedPeriod === 'monthly' 
                ? 'bg-primary-100 text-primary-800' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPeriod('yearly')}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedPeriod === 'yearly' 
                ? 'bg-primary-100 text-primary-800' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgeted</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(comparisonData.reduce((sum, cat) => sum + cat.current.budgeted, 0))}
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
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(comparisonData.reduce((sum, cat) => sum + cat.current.spent, 0))}
              </p>
            </div>
            <div className="h-12 w-12 bg-danger-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {comparisonData.length > 0 
                  ? Math.round(comparisonData.reduce((sum, cat) => sum + cat.currentUtilization, 0) / comparisonData.length)
                  : 0}%
              </p>
            </div>
            <div className="h-12 w-12 bg-success-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonData.map((category) => (
                <tr key={category.category} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(category.current.spent)} / {formatCurrency(category.current.budgeted)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.currentUtilization}% utilized
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(category.previous.spent)} / {formatCurrency(category.previous.budgeted)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.previousUtilization}% utilized
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className={`font-medium ${getChangeColor(category.spendingChange)}`}>
                        {getChangeIcon(category.spendingChange)} {Math.abs(category.spendingChange)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Spending change
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            category.currentUtilization >= 100 ? 'bg-danger-500' :
                            category.currentUtilization >= 80 ? 'bg-yellow-500' :
                            'bg-success-500'
                          }`}
                          style={{ width: `${Math.min(100, category.currentUtilization)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {category.currentUtilization}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Insights</h4>
        <div className="space-y-3">
          {comparisonData
            .filter(cat => cat.spendingChange > 20)
            .map((category) => (
              <div key={category.category} className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{category.label}</span> spending increased by {category.spendingChange}% compared to last period.
                </p>
              </div>
            ))}
          
          {comparisonData
            .filter(cat => cat.spendingChange < -20)
            .map((category) => (
              <div key={category.category} className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{category.label}</span> spending decreased by {Math.abs(category.spendingChange)}% compared to last period.
                </p>
              </div>
            ))}
          
          {comparisonData.filter(cat => cat.spendingChange > 20).length === 0 && 
           comparisonData.filter(cat => cat.spendingChange < -20).length === 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Your spending patterns are relatively stable compared to the previous period.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetComparison;
