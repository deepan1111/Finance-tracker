import React from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetTemplates = ({ onTemplateSelect, isLoading = false }) => {
  const templates = [
    {
      id: 'essential',
      name: 'Essential Expenses',
      description: 'Basic necessities like rent, utilities, and groceries',
      categories: [
        { category: 'rent', label: 'Rent/Mortgage', amount: 1200, color: '#F59E0B' },
        { category: 'utilities', label: 'Utilities', amount: 200, color: '#06B6D4' },
        { category: 'groceries', label: 'Groceries', amount: 400, color: '#10B981' },
        { category: 'transport', label: 'Transportation', amount: 300, color: '#F97316' }
      ],
      totalAmount: 2100
    },
    {
      id: 'balanced',
      name: 'Balanced Lifestyle',
      description: 'A well-rounded budget for comfortable living',
      categories: [
        { category: 'rent', label: 'Rent/Mortgage', amount: 1200, color: '#F59E0B' },
        { category: 'utilities', label: 'Utilities', amount: 200, color: '#06B6D4' },
        { category: 'groceries', label: 'Groceries', amount: 500, color: '#10B981' },
        { category: 'transport', label: 'Transportation', amount: 400, color: '#F97316' },
        { category: 'entertainment', label: 'Entertainment', amount: 300, color: '#EAB308' },
        { category: 'shopping', label: 'Shopping', amount: 200, color: '#22C55E' },
        { category: 'healthcare', label: 'Healthcare', amount: 150, color: '#3B82F6' }
      ],
      totalAmount: 2950
    },
    {
      id: 'minimalist',
      name: 'Minimalist Budget',
      description: 'Focused on essentials with minimal discretionary spending',
      categories: [
        { category: 'rent', label: 'Rent/Mortgage', amount: 1000, color: '#F59E0B' },
        { category: 'utilities', label: 'Utilities', amount: 150, color: '#06B6D4' },
        { category: 'groceries', label: 'Groceries', amount: 300, color: '#10B981' },
        { category: 'transport', label: 'Transportation', amount: 200, color: '#F97316' },
        { category: 'healthcare', label: 'Healthcare', amount: 100, color: '#3B82F6' }
      ],
      totalAmount: 1750
    },
    {
      id: 'student',
      name: 'Student Budget',
      description: 'Budget-friendly options for students',
      categories: [
        { category: 'rent', label: 'Rent', amount: 600, color: '#F59E0B' },
        { category: 'utilities', label: 'Utilities', amount: 100, color: '#06B6D4' },
        { category: 'groceries', label: 'Groceries', amount: 250, color: '#10B981' },
        { category: 'transport', label: 'Transportation', amount: 150, color: '#F97316' },
        { category: 'education', label: 'Education', amount: 200, color: '#8B5CF6' },
        { category: 'entertainment', label: 'Entertainment', amount: 100, color: '#EAB308' }
      ],
      totalAmount: 1400
    }
  ];

  const handleTemplateSelect = async (template) => {
    try {
      const budgets = [];
      for (const category of template.categories) {
        const budgetData = {
          name: `${category.label} - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
          category: category.category,
          amount: category.amount,
          period: 'monthly',
          startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
          endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
          alertThreshold: 80,
          color: category.color
        };
        budgets.push(budgetData);
      }
      
      await onTemplateSelect(budgets);
    } catch (error) {
      console.error('Error creating template budgets:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Templates</h3>
        <p className="text-gray-600">Choose a pre-configured budget template to get started quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="card hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>

              <div className="space-y-2">
                {template.categories.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-gray-700">{category.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${category.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Total Monthly Budget</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${template.totalAmount.toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Use This Template'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetTemplates;
