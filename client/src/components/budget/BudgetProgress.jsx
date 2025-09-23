import React from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetProgress = ({ budget, showDetails = true, size = 'medium', showExpectedProgress = false }) => {
  const formattedBudget = budgetService.formatBudget(budget);
  const progressWidth = Math.min(100, formattedBudget.percentageSpent);
  
  // Calculate expected progress based on time elapsed
  const now = new Date();
  const startDate = new Date(budget.startDate);
  const endDate = new Date(budget.endDate);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
  const expectedProgress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  const isOnTrack = formattedBudget.percentageSpent <= expectedProgress + 10; // Allow 10% variance
  
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} relative`}>
        {/* Expected Progress Indicator */}
        {showExpectedProgress && (
          <div 
            className="absolute top-0 h-full w-0.5 bg-gray-400 opacity-60"
            style={{ left: `${Math.min(100, expectedProgress)}%` }}
          ></div>
        )}
        
        {/* Actual Progress */}
        <div 
          className={`
            ${sizeClasses[size]} rounded-full transition-all duration-300
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

      {showDetails && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${textSizes[size]}`}>
              {formattedBudget.formattedSpent}
            </span>
            <span className={`text-gray-500 ${textSizes[size]}`}>
              of {formattedBudget.formattedAmount}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`font-semibold ${textSizes[size]} ${
              formattedBudget.status === 'exceeded' 
                ? 'text-danger-600' 
                : formattedBudget.status === 'warning'
                ? 'text-yellow-600'
                : 'text-success-600'
            }`}>
              {formattedBudget.percentageSpent}%
            </span>
            
            <span className={`
              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
              ${budgetService.getStatusColor(formattedBudget.status)}
            `}>
              {budgetService.getStatusLabel(formattedBudget.status)}
            </span>
          </div>
        </div>
      )}

      {/* Expected vs Actual Progress */}
      {showDetails && showExpectedProgress && (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-600">Expected:</span>
            <span className="ml-1 font-medium">{Math.round(expectedProgress)}%</span>
          </div>
          <div>
            <span className="text-gray-600">Actual:</span>
            <span className={`ml-1 font-medium ${
              isOnTrack ? 'text-success-600' : 'text-warning-600'
            }`}>
              {formattedBudget.percentageSpent}%
            </span>
          </div>
        </div>
      )}

      {/* Remaining/Over Budget Info */}
      {showDetails && (
        <div className={`text-xs ${
          formattedBudget.status === 'exceeded' ? 'text-danger-600' : 'text-gray-500'
        }`}>
          {formattedBudget.status === 'exceeded' 
            ? `Over by ${budgetService.formatBudget({...budget, amount: budget.spent - budget.amount}).formattedAmount}`
            : `${formattedBudget.formattedRemaining} remaining`
          }
          {showExpectedProgress && !isOnTrack && (
            <span className={`ml-2 ${
              formattedBudget.percentageSpent > expectedProgress ? 'text-warning-600' : 'text-info-600'
            }`}>
              ({formattedBudget.percentageSpent > expectedProgress ? 'Ahead' : 'Behind'} schedule)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
