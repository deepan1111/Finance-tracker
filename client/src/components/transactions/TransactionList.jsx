
import React, { useState } from 'react';
import TransactionItem from './TransactionItem';

const TransactionList = ({ 
  transactions = [], 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onLoadMore, 
  hasMore = false 
}) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Handle individual transaction selection
  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions(prev => {
      const newSelection = prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  // Handle select all transactions
  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
      setShowBulkActions(false);
    } else {
      setSelectedTransactions(transactions.map(t => t._id));
      setShowBulkActions(true);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTransactions.length} transactions?`)) {
      try {
        for (const transactionId of selectedTransactions) {
          await onDelete(transactionId);
        }
        setSelectedTransactions([]);
        setShowBulkActions(false);
      } catch (error) {
        console.error('Bulk delete error:', error);
      }
    }
  };

  // Group transactions by date
  const groupTransactionsByDate = (transactions) => {
    const groups = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });
    
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No transactions found
        </h3>
        <p className="text-gray-600 mb-4">
          Start by adding your first transaction to track your finances.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-800">
              {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setSelectedTransactions([]);
                  setShowBulkActions(false);
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear selection
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn btn-sm bg-danger-600 text-white hover:bg-danger-700"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select All Header */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={selectedTransactions.length === transactions.length}
              onChange={handleSelectAll}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span>Select all transactions</span>
          </label>
          <span className="text-sm text-gray-500">
            {transactions.length} transaction{transactions.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Grouped Transactions */}
      <div className="space-y-6">
        {groupedTransactions.map(([date, dayTransactions]) => {
          const totalIncome = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const totalExpenses = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                  {totalIncome > 0 && (
                    <span className="text-success-600 font-medium">
                      +${totalIncome.toLocaleString()}
                    </span>
                  )}
                  {totalExpenses > 0 && (
                    <span className="text-danger-600 font-medium">
                      -${totalExpenses.toLocaleString()}
                    </span>
                  )}
                  <span className="text-gray-500">
                    {dayTransactions.length} transaction{dayTransactions.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Transactions for this date */}
              <div className="space-y-2">
                {dayTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                    isSelected={selectedTransactions.includes(transaction._id)}
                    onSelect={() => handleSelectTransaction(transaction._id)}
                    onEdit={() => onEdit(transaction)}
                    onDelete={() => onDelete(transaction._id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="btn-outline"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="spinner h-4 w-4 mr-2"></div>
                Loading...
              </div>
            ) : (
              'Load More Transactions'
            )}
          </button>
        </div>
      )}

      {/* Loading indicator for additional transactions */}
      {isLoading && transactions.length > 0 && (
        <div className="text-center py-4">
          <div className="spinner h-6 w-6 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
