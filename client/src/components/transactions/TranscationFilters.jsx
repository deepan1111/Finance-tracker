import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';

const TransactionFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quickDateFilter, setQuickDateFilter] = useState('');

  const categories = transactionService.getCategories();
  const paymentMethods = transactionService.getPaymentMethods();

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQuickDateFilter = (period) => {
    const now = new Date();
    let startDate = '';
    let endDate = '';

    switch (period) {
      case 'today':
        startDate = now.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'yesterday':
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        startDate = yesterday.toISOString().split('T')[0];
        endDate = yesterday.toISOString().split('T')[0];
        break;
      case 'this-week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'this-month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = startOfMonth.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        startDate = lastMonth.toISOString().split('T')[0];
        endDate = endOfLastMonth.toISOString().split('T')[0];
        break;
      case 'this-year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        startDate = startOfYear.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      default:
        break;
    }

    setQuickDateFilter(period);
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
    setQuickDateFilter('');
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== 'date' && value !== 'desc').length;
  };

  return (
    <div className="card space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`btn ${showAdvanced ? 'btn-primary' : 'btn-outline'}`}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="btn-outline text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Quick Date Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'this-week', label: 'This Week' },
          { value: 'this-month', label: 'This Month' },
          { value: 'last-month', label: 'Last Month' },
          { value: 'this-year', label: 'This Year' }
        ].map((period) => (
          <button
            key={period.value}
            onClick={() => handleQuickDateFilter(period.value)}
            className={`
              px-3 py-1 text-sm rounded-lg border transition-colors
              ${quickDateFilter === period.value
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Transaction Type */}
            <div className="form-group">
              <label className="form-label text-sm">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label text-sm">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Categories</option>
                {filters.type && categories[filters.type] ? (
                  categories[filters.type].map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))
                ) : (
                  <>
                    <optgroup label="Income">
                      {categories.income.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Expenses">
                      {categories.expense.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </optgroup>
                  </>
                )}
              </select>
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label text-sm">Payment Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="form-group">
              <label className="form-label text-sm">Sort By</label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input text-sm flex-1"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="title">Title</option>
                  <option value="category">Category</option>
                </select>
                <button
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="btn-outline px-3"
                  title={`Sort ${filters.sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
                >
                  <svg 
                    className={`h-4 w-4 transform transition-transform ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="form-group">
              <label className="form-label text-sm">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => {
                  handleFilterChange('startDate', e.target.value);
                  setQuickDateFilter(''); // Clear quick filter when custom date is set
                }}
                className="input text-sm"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-sm">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => {
                  handleFilterChange('endDate', e.target.value);
                  setQuickDateFilter(''); // Clear quick filter when custom date is set
                }}
                className="input text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                Type: {filters.type}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-1 text-green-400 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                Category: {transactionService.getCategoryLabel(filters.category, filters.type)}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="ml-1 text-purple-400 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.startDate || filters.endDate) && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                Date: {filters.startDate || '...'} to {filters.endDate || '...'}
                <button
                  onClick={() => {
                    handleFilterChange('startDate', '');
                    handleFilterChange('endDate', '');
                    setQuickDateFilter('');
                  }}
                  className="ml-1 text-yellow-400 hover:text-yellow-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;