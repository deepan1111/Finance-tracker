import React from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetList = ({ budgets = [], isLoading = false, onEdit, onDelete, onToggle }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No budgets found
        </h3>
        <p className="text-gray-600">
          Create your first budget to start tracking your spending limits.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const formattedBudget = budgetService.formatBudget(budget);
        const progressWidth = Math.min(100, formattedBudget.percentageSpent);
        
        return (
          <div key={budget._id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              {/* Budget Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {budget.name}
                  </h3>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${budgetService.getStatusColor(formattedBudget.status)}
                  `}>
                    {budgetService.getStatusLabel(formattedBudget.status)}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="capitalize">{formattedBudget.categoryLabel}</span>
                  <span>•</span>
                  <span className="capitalize">{budget.period}</span>
                  <span>•</span>
                  <span>{formattedBudget.daysRemaining} days left</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {formattedBudget.formattedSpent} of {formattedBudget.formattedAmount}
                    </span>
                    <span className="font-medium">
                      {formattedBudget.percentageSpent}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`
                        h-3 rounded-full transition-all duration-300
                        ${formattedBudget.status === 'exceeded' 
                          ? 'bg-danger-500' 
                          : formattedBudget.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-success-500'
                        }
                      `}
                      style={{ 
                        width: `${progressWidth}%`,
                        backgroundColor: formattedBudget.categoryColor 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {formattedBudget.status === 'exceeded' 
                        ? `Over by ${budgetService.formatBudget({...budget, amount: budget.spent - budget.amount}).formattedAmount}`
                        : `${formattedBudget.formattedRemaining} remaining`
                      }
                    </span>
                    <span>
                      Alert at {budget.alertThreshold}%
                    </span>
                  </div>
                </div>

                {/* Date Range */}
                <div className="mt-3 text-xs text-gray-500">
                  {formattedBudget.formattedStartDate} - {formattedBudget.formattedEndDate}
                </div>
              </div>

              {/* Circular Progress Indicator */}
              <div className="flex-shrink-0 ml-6">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        formattedBudget.status === 'exceeded' 
                          ? 'text-danger-500' 
                          : formattedBudget.status === 'warning'
                          ? 'text-yellow-500'
                          : 'text-success-500'
                      }
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${Math.min(100, formattedBudget.percentageSpent)}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">
                      {formattedBudget.percentageSpent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => onToggle(budget._id)}
                className={`
                  btn btn-sm
                  ${budget.isActive 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }
                `}
                title={budget.isActive ? 'Deactivate budget' : 'Activate budget'}
              >
                {budget.isActive ? 'Deactivate' : 'Activate'}
              </button>
              
              <button
                onClick={() => onEdit(budget)}
                className="btn btn-sm btn-outline"
                title="Edit budget"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              
              <button
                onClick={() => onDelete(budget._id)}
                className="btn btn-sm bg-danger-100 text-danger-800 hover:bg-danger-200"
                title="Delete budget"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetList;