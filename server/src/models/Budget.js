const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    maxlength: [100, 'Budget name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'food', 'transport', 'entertainment', 'shopping', 'bills', 'healthcare',
      'education', 'travel', 'groceries', 'rent', 'utilities', 'insurance',
      'fitness', 'other-expense', 'total'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount must be positive']
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  alertThreshold: {
    type: Number,
    min: [0, 'Alert threshold must be between 0 and 100'],
    max: [100, 'Alert threshold must be between 0 and 100'],
    default: 80 // Alert when 80% of budget is spent
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
budgetSchema.index({ user: 1, category: 1 });
budgetSchema.index({ user: 1, isActive: 1 });
budgetSchema.index({ startDate: 1, endDate: 1 });

// Virtual for remaining amount
budgetSchema.virtual('remaining').get(function() {
  return Math.max(0, this.amount - this.spent);
});

// Virtual for percentage spent
budgetSchema.virtual('percentageSpent').get(function() {
  if (this.amount === 0) return 0;
  return Math.round((this.spent / this.amount) * 100);
});

// Virtual for status
budgetSchema.virtual('status').get(function() {
  const percentage = this.percentageSpent;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= this.alertThreshold) return 'warning';
  return 'on-track';
});

// Virtual for days remaining
budgetSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Method to check if budget period is active
budgetSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
};

// Static method to get user's active budgets
budgetSchema.statics.getUserActiveBudgets = async function(userId) {
  const now = new Date();
  return await this.find({
    user: userId,
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ category: 1 });
};

// Static method to update spent amounts based on transactions
budgetSchema.statics.updateSpentAmounts = async function(userId, category = null) {
  try {
    const Transaction = mongoose.model('Transaction');
    
    // Get all active budgets for user
    const budgets = await this.getUserActiveBudgets(userId);
    
    for (const budget of budgets) {
      let spentAmount = 0;
      
      try {
        if (budget.category === 'total') {
          // For total budget, sum all expenses in the period
          const result = await Transaction.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(userId),
                type: 'expense',
                date: {
                  $gte: budget.startDate,
                  $lte: budget.endDate
                }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' }
              }
            }
          ]);
          spentAmount = result.length > 0 ? result[0].total : 0;
        } else {
          // For category budget, sum expenses in that category
          const result = await Transaction.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(userId),
                type: 'expense',
                category: budget.category,
                date: {
                  $gte: budget.startDate,
                  $lte: budget.endDate
                }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' }
              }
            }
          ]);
          spentAmount = result.length > 0 ? result[0].total : 0;
        }
        
        // Update budget spent amount
        budget.spent = spentAmount;
        await budget.save();
      } catch (budgetError) {
        console.error(`Error updating budget ${budget._id}:`, budgetError);
        // Continue with other budgets even if one fails
      }
    }
  } catch (error) {
    console.error('Error in updateSpentAmounts:', error);
    throw error;
  }
};

// Static method to update budget when transaction is created/updated/deleted
budgetSchema.statics.updateBudgetFromTransaction = async function(userId, transaction, action = 'create') {
  const Transaction = mongoose.model('Transaction');
  
  // Only process expense transactions
  if (transaction.type !== 'expense') return;
  
  // Get all active budgets that might be affected
  const budgets = await this.find({
    user: userId,
    isActive: true,
    $or: [
      { category: transaction.category },
      { category: 'total' }
    ],
    startDate: { $lte: transaction.date },
    endDate: { $gte: transaction.date }
  });
  
  // Update each affected budget
  for (const budget of budgets) {
    let spentAmount = 0;
    
    if (budget.category === 'total') {
      // For total budget, sum all expenses in the period
      const result = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            type: 'expense',
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);
      spentAmount = result.length > 0 ? result[0].total : 0;
    } else {
      // For category budget, sum expenses in that category
      const result = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            type: 'expense',
            category: budget.category,
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);
      spentAmount = result.length > 0 ? result[0].total : 0;
    }
    
    // Update budget spent amount
    budget.spent = spentAmount;
    await budget.save();
  }
};

// Static method to get budget warnings and alerts
budgetSchema.statics.getBudgetWarnings = async function(userId) {
  // Update spent amounts first
  await this.updateSpentAmounts(userId);
  
  const activeBudgets = await this.getUserActiveBudgets(userId);
  const warnings = [];
  
  for (const budget of activeBudgets) {
    const percentage = budget.percentageSpent;
    const status = budget.status;
    
    if (status === 'exceeded') {
      warnings.push({
        budgetId: budget._id,
        budgetName: budget.name,
        category: budget.category,
        status: 'exceeded',
        percentageSpent: percentage,
        amountSpent: budget.spent,
        budgetAmount: budget.amount,
        overspentAmount: budget.spent - budget.amount,
        message: `You've exceeded your ${budget.name} budget by $${(budget.spent - budget.amount).toFixed(2)}`,
        severity: 'high',
        daysRemaining: budget.daysRemaining
      });
    } else if (status === 'warning') {
      warnings.push({
        budgetId: budget._id,
        budgetName: budget.name,
        category: budget.category,
        status: 'warning',
        percentageSpent: percentage,
        amountSpent: budget.spent,
        budgetAmount: budget.amount,
        remainingAmount: budget.amount - budget.spent,
        message: `You've spent ${Math.round(percentage)}% of your ${budget.name} budget`,
        severity: 'medium',
        daysRemaining: budget.daysRemaining
      });
    }
  }
  
  return warnings;
};

// Pre-save middleware to validate dates
budgetSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Pre-save middleware to ensure spent doesn't exceed realistic limits
budgetSchema.pre('save', function(next) {
  if (this.spent < 0) {
    this.spent = 0;
  }
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);