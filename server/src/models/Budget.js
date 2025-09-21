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
  timestamps: true
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
  const Transaction = mongoose.model('Transaction');
  
  // Build match criteria
  const matchCriteria = { user: mongoose.Types.ObjectId(userId) };
  if (category && category !== 'total') {
    matchCriteria.category = category;
  }

  // Get all active budgets for user
  const budgets = await this.getUserActiveBudgets(userId);
  
  for (const budget of budgets) {
    let spentAmount = 0;
    
    if (budget.category === 'total') {
      // For total budget, sum all expenses in the period
      const result = await Transaction.aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId(userId),
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
            user: mongoose.Types.ObjectId(userId),
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