import api from './api';

export const budgetService = {
  // Get all budgets
  getBudgets: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/budgets?${queryString}` : '/budgets';
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get active budgets
  getActiveBudgets: async () => {
    try {
      const response = await api.get('/budgets/active');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get budget overview
  getBudgetOverview: async () => {
    try {
      const response = await api.get('/budgets/overview');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single budget
  getBudget: async (id) => {
    try {
      const response = await api.get(`/budgets/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new budget
  createBudget: async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update budget
  updateBudget: async (id, budgetData) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete budget
  deleteBudget: async (id) => {
    try {
      const response = await api.delete(`/budgets/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Toggle budget status
  toggleBudgetStatus: async (id) => {
    try {
      const response = await api.post(`/budgets/${id}/toggle`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Budget categories
  getCategories: () => {
    return [
      { value: 'food', label: 'Food & Dining', color: '#EF4444' },
      { value: 'transport', label: 'Transportation', color: '#F97316' },
      { value: 'entertainment', label: 'Entertainment', color: '#EAB308' },
      { value: 'shopping', label: 'Shopping', color: '#22C55E' },
      { value: 'bills', label: 'Bills & Utilities', color: '#06B6D4' },
      { value: 'healthcare', label: 'Healthcare', color: '#3B82F6' },
      { value: 'education', label: 'Education', color: '#8B5CF6' },
      { value: 'travel', label: 'Travel', color: '#EC4899' },
      { value: 'groceries', label: 'Groceries', color: '#10B981' },
      { value: 'rent', label: 'Rent', color: '#F59E0B' },
      { value: 'utilities', label: 'Utilities', color: '#84CC16' },
      { value: 'insurance', label: 'Insurance', color: '#06B6D4' },
      { value: 'fitness', label: 'Fitness', color: '#8B5CF6' },
      { value: 'other-expense', label: 'Other Expense', color: '#6B7280' },
      { value: 'total', label: 'Total Budget', color: '#1F2937' }
    ];
  },

  // Budget periods
  getPeriods: () => {
    return [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' }
    ];
  },

  // Get category info
  getCategoryInfo: (category) => {
    const categories = budgetService.getCategories();
    return categories.find(cat => cat.value === category) || { 
      value: category, 
      label: category, 
      color: '#6B7280' 
    };
  },

  // Create monthly budget for current month
  createMonthlyBudget: async (category, amount, alertThreshold = 80) => {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const budgetData = {
        name: `${budgetService.getCategoryInfo(category).label} - ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        category,
        amount,
        period: 'monthly',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        alertThreshold
      };

      return await budgetService.createBudget(budgetData);
    } catch (error) {
      throw error;
    }
  },

  // Format budget data for display
  formatBudget: (budget) => {
    const categoryInfo = budgetService.getCategoryInfo(budget.category);
    
    return {
      ...budget,
      categoryLabel: categoryInfo.label,
      categoryColor: budget.color || categoryInfo.color,
      formattedAmount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(budget.amount),
      formattedSpent: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(budget.spent),
      formattedRemaining: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(Math.max(0, budget.amount - budget.spent)),
      formattedStartDate: new Date(budget.startDate).toLocaleDateString(),
      formattedEndDate: new Date(budget.endDate).toLocaleDateString(),
      percentageSpent: budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0,
      status: budgetService.getBudgetStatus(budget),
      remaining: Math.max(0, budget.amount - budget.spent),
      daysRemaining: budgetService.getDaysRemaining(budget.endDate)
    };
  },

  // Get budget status
  getBudgetStatus: (budget) => {
    const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
    
    if (percentage >= 100) return 'exceeded';
    if (percentage >= (budget.alertThreshold || 80)) return 'warning';
    return 'on-track';
  },

  // Get days remaining
  getDaysRemaining: (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  },

  // Get status color
  getStatusColor: (status) => {
    switch (status) {
      case 'on-track':
        return 'text-success-600 bg-success-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'exceeded':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  // Get status label
  getStatusLabel: (status) => {
    switch (status) {
      case 'on-track':
        return 'On Track';
      case 'warning':
        return 'Warning';
      case 'exceeded':
        return 'Exceeded';
      default:
        return 'Unknown';
    }
  },

  // Calculate budget progress
  calculateProgress: (budget) => {
    const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
    return Math.min(100, Math.max(0, percentage));
  },

  // Check if budget needs attention
  needsAttention: (budget) => {
    const status = budgetService.getBudgetStatus(budget);
    return status === 'warning' || status === 'exceeded';
  },

  // Get budget alerts
  getBudgetAlerts: (budgets) => {
    return budgets
      .filter(budget => budgetService.needsAttention(budget))
      .map(budget => ({
        id: budget._id,
        name: budget.name,
        category: budget.category,
        status: budgetService.getBudgetStatus(budget),
        percentageSpent: budgetService.calculateProgress(budget),
        message: budgetService.getAlertMessage(budget)
      }));
  },

  // Get budget warnings from API
  getBudgetWarnings: async () => {
    try {
      const response = await api.get('/budgets/warnings');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get alert message
  getAlertMessage: (budget) => {
    const status = budgetService.getBudgetStatus(budget);
    const percentage = budgetService.calculateProgress(budget);
    
    if (status === 'exceeded') {
      const overspent = budget.spent - budget.amount;
      return `You've exceeded your budget by ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(overspent)}`;
    } else if (status === 'warning') {
      return `You've spent ${Math.round(percentage)}% of your budget`;
    }
    
    return '';
  }
};