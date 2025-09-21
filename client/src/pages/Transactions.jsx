import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFilters from '../components/transactions/TranscationFilters';
import { transactionService } from '../services/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    balance: { income: 0, expense: 0, balance: 0 },
    totalTransactions: 0
  });

  // Load transactions
  const loadTransactions = useCallback(async (newFilters = {}, reset = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        ...newFilters,
        page: reset ? 1 : pagination.page,
        limit: pagination.limit
      };

      const response = await transactionService.getTransactions(params);
      
      if (response.success) {
        if (reset) {
          setTransactions(response.data.transactions);
        } else {
          setTransactions(prev => [...prev, ...response.data.transactions]);
        }
        setPagination(response.data.pagination);
      }
    } catch (error) {
      setError(error.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove pagination dependencies

  // Load transaction stats
  const loadStats = useCallback(async () => {
    try {
      const response = await transactionService.getTransactionStats();
      if (response.success) {
        setStats({
          balance: response.data.balance,
          totalTransactions: transactions.length
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, [transactions.length]);

  // Initial load
  useEffect(() => {
    loadTransactions({}, true);
  }, [loadTransactions]);

  // Load stats when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      loadStats();
    }
  }, [transactions.length, loadStats]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    loadTransactions(newFilters, true);
  }, [loadTransactions]);

  // Handle load more - Updated to use current pagination state
  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.pages) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      
      // Create params with next page
      const params = {
        ...filters,
        page: nextPage,
        limit: pagination.limit
      };
      
      // Call API directly here to avoid dependency issues
      transactionService.getTransactions(params).then(response => {
        if (response.success) {
          setTransactions(prev => [...prev, ...response.data.transactions]);
          setPagination(response.data.pagination);
        }
      }).catch(error => {
        setError(error.message || 'Failed to load more transactions');
      });
    }
  }, [pagination.page, pagination.pages, pagination.limit, filters]);

  // Handle create transaction
  const handleCreateTransaction = async (transactionData) => {
    try {
      const response = await transactionService.createTransaction(transactionData);
      if (response.success) {
        setShowForm(false);
        loadTransactions(filters, true);
        loadStats();
      }
    } catch (error) {
      throw error;
    }
  };

  // Handle edit transaction
  const handleEditTransaction = async (transactionData) => {
    try {
      const response = await transactionService.updateTransaction(
        editingTransaction._id, 
        transactionData
      );
      if (response.success) {
        setEditingTransaction(null);
        setShowForm(false);
        loadTransactions(filters, true);
        loadStats();
      }
    } catch (error) {
      throw error;
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await transactionService.deleteTransaction(transactionId);
      if (response.success) {
        setTransactions(prev => prev.filter(t => t._id !== transactionId));
        loadStats();
      }
    } catch (error) {
      setError(error.message || 'Failed to delete transaction');
    }
  };

  // Handle edit click
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (showForm) {
    return (
      <Layout>
        <TransactionForm
          onSubmit={editingTransaction ? handleEditTransaction : handleCreateTransaction}
          onCancel={handleFormCancel}
          initialData={editingTransaction}
          isEdit={!!editingTransaction}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Track your income and expenses</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Transaction
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.balance.balance.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-success-600">
                  +${stats.balance.income.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-danger-600">
                  -${stats.balance.expense.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination.total.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-danger-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <TransactionFilters onFiltersChange={handleFiltersChange} />

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteTransaction}
          onLoadMore={handleLoadMore}
          hasMore={pagination.page < pagination.pages}
        />

        {/* Empty State */}
        {!isLoading && transactions.length === 0 && !error && (
          <div className="card text-center py-12">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.keys(filters).some(key => filters[key]) 
                ? 'Try adjusting your filters or search terms.'
                : 'Start by adding your first transaction to track your finances.'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Transaction
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;