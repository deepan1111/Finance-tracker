import api from './api';

export const transactionService = {
  // Get all transactions with filters
  getTransactions: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add parameters to query string
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/transactions?${queryString}` : '/transactions';
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction statistics
  getTransactionStats: async (dateRange = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);

      const queryString = queryParams.toString();
      const url = queryString ? `/transactions/stats?${queryString}` : '/transactions/stats';
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single transaction
  getTransaction: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transactions by date range
  getTransactionsByDateRange: async (startDate, endDate, filters = {}) => {
    try {
      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...filters
      };
      
      return await transactionService.getTransactions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get current month transactions
  getCurrentMonthTransactions: async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      return await transactionService.getTransactionsByDateRange(startOfMonth, endOfMonth);
    } catch (error) {
      throw error;
    }
  },

  // Get transactions by category
  getTransactionsByCategory: async (category, dateRange = {}) => {
    try {
      const params = {
        category,
        ...dateRange
      };
      
      return await transactionService.getTransactions(params);
    } catch (error) {
      throw error;
    }
  },

  // Search transactions
  searchTransactions: async (searchTerm, filters = {}) => {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      
      return await transactionService.getTransactions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get recent transactions
  getRecentTransactions: async (limit = 10) => {
    try {
      const params = {
        limit,
        sortBy: 'date',
        sortOrder: 'desc'
      };
      
      return await transactionService.getTransactions(params);
    } catch (error) {
      throw error;
    }
  },

  // Transaction categories
  getCategories: () => {
    return {
      income: [
        { value: 'salary', label: 'Salary' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'business', label: 'Business' },
        { value: 'investment', label: 'Investment' },
        { value: 'gift', label: 'Gift' },
        { value: 'other-income', label: 'Other Income' }
      ],
      expense: [
        { value: 'food', label: 'Food & Dining' },
        { value: 'transport', label: 'Transportation' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'bills', label: 'Bills & Utilities' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'travel', label: 'Travel' },
        { value: 'groceries', label: 'Groceries' },
        { value: 'rent', label: 'Rent' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'insurance', label: 'Insurance' },
        { value: 'fitness', label: 'Fitness' },
        { value: 'other-expense', label: 'Other Expense' }
      ]
    };
  },

  // Payment methods
  getPaymentMethods: () => {
    return [
      { value: 'cash', label: 'Cash' },
      { value: 'card', label: 'Card' },
      { value: 'bank-transfer', label: 'Bank Transfer' },
      { value: 'digital-wallet', label: 'Digital Wallet' },
      { value: 'check', label: 'Check' },
      { value: 'other', label: 'Other' }
    ];
  },

  // Format transaction data for display
  formatTransaction: (transaction) => {
    return {
      ...transaction,
      formattedAmount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(transaction.amount),
      formattedDate: new Date(transaction.date).toLocaleDateString(),
      categoryLabel: transactionService.getCategoryLabel(transaction.category, transaction.type),
      paymentMethodLabel: transactionService.getPaymentMethodLabel(transaction.paymentMethod)
    };
  },

  // Get category label
  getCategoryLabel: (category, type) => {
    const categories = transactionService.getCategories();
    const categoryList = categories[type] || [];
    const found = categoryList.find(cat => cat.value === category);
    return found ? found.label : category;
  },

  // Get payment method label
  getPaymentMethodLabel: (paymentMethod) => {
    const methods = transactionService.getPaymentMethods();
    const found = methods.find(method => method.value === paymentMethod);
    return found ? found.label : paymentMethod;
  }
};