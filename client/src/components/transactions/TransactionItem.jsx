import React, { useState } from 'react';
import { transactionService } from '../../services/transactionService';

const TransactionItem = ({ transaction, isSelected, onSelect, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedTransaction = transactionService.formatTransaction(transaction);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true);
      try {
        await onDelete(transaction._id);
      } catch (error) {
        console.error('Delete error:', error);
        setIsDeleting(false);
      }
    }
  };

  const getCategoryIcon = (category, type) => {
    const iconMap = {
      // Income icons
      salary: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      freelance: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      // Expense icons
      food: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      transport: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 01-2-2V9a2 2 0 012-2h0V7" />
        </svg>
      ),
      entertainment: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      shopping: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bills: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      healthcare: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    };

    return iconMap[category] || (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    );
  };

  const getTypeColor = (type) => {
    return type === 'income' 
      ? 'bg-success-100 text-success-600' 
      : 'bg-danger-100 text-danger-600';
  };

  return (
    <div 
      className={`
        card-hover transition-all duration-200 cursor-pointer
        ${isSelected ? 'ring-2 ring-primary-500 bg-primary-25' : ''}
        ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center space-x-4">
        {/* Selection Checkbox */}
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>

        {/* Transaction Icon */}
        <div className={`
          flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
          ${getTypeColor(transaction.type)}
        `}>
          {getCategoryIcon(transaction.category, transaction.type)}
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {transaction.title}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="capitalize">{formattedTransaction.categoryLabel}</span>
                <span>•</span>
                <span>{formattedTransaction.paymentMethodLabel}</span>
                {transaction.tags && transaction.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      {transaction.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {transaction.tags.length > 2 && (
                        <span className="text-gray-400">
                          +{transaction.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
              {transaction.description && (
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {transaction.description}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="flex-shrink-0 text-right">
              <div className={`
                text-sm font-semibold
                ${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'}
              `}>
                {transaction.type === 'income' ? '+' : '-'}
                {formattedTransaction.formattedAmount}
              </div>
              <div className="text-xs text-gray-500">
                {formattedTransaction.formattedDate}
              </div>
              {transaction.isRecurring && (
                <div className="flex items-center justify-end mt-1">
                  <svg className="h-3 w-3 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs text-gray-400 capitalize">
                    {transaction.recurringFrequency}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`
              flex-shrink-0 ml-4 transition-opacity duration-200
              ${showActions ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(transaction);
                  }}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Edit transaction"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                  title="Delete transaction"
                >
                  {isDeleting ? (
                    <div className="spinner h-4 w-4"></div>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details (when selected) */}
      {isSelected && transaction.description && (
        <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Description:</span> {transaction.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;