const express = require('express');
const { z } = require('zod');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']).optional(),
  avatar: z.string().url().optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(128)
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    // Validate request body
    const validatedData = updateProfileSchema.parse(req.body);

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...validatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    // Validate request body
    const validatedData = changePasswordSchema.parse(req.body);
    const { currentPassword, newPassword } = validatedData;

    // Get user with password
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @route   GET /api/users/dashboard-stats
// @desc    Get dashboard statistics for user
// @access  Private
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');
    const Budget = require('../models/Budget');

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get user balance
    const balance = await Transaction.getUserBalance(req.user._id);

    // Get current month transactions
    const monthlyTransactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Calculate monthly stats
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = monthlyIncome > 0 
      ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : 0;

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find({
      user: req.user._id
    })
    .sort({ date: -1 })
    .limit(5);

    // Get active budgets with alerts
    await Budget.updateSpentAmounts(req.user._id);
    const activeBudgets = await Budget.getUserActiveBudgets(req.user._id);
    
    const budgetAlerts = activeBudgets
      .filter(budget => budget.percentageSpent >= budget.alertThreshold)
      .map(budget => ({
        id: budget._id,
        name: budget.name,
        category: budget.category,
        percentageSpent: budget.percentageSpent,
        status: budget.status
      }));

    // Get spending by category (current month)
    const categorySpending = await Transaction.getCategoryBreakdown(req.user._id, 'expense');

    res.json({
      success: true,
      data: {
        balance,
        monthlyStats: {
          income: monthlyIncome,
          expenses: monthlyExpenses,
          savings: monthlyIncome - monthlyExpenses,
          savingsRate
        },
        recentTransactions,
        budgetAlerts,
        categorySpending: categorySpending.slice(0, 5), // Top 5 categories
        summary: {
          totalBudgets: activeBudgets.length,
          budgetsExceeded: activeBudgets.filter(b => b.status === 'exceeded').length,
          transactionCount: monthlyTransactions.length
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard statistics'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Delete related data
    const Transaction = require('../models/Transaction');
    const Budget = require('../models/Budget');

    await Transaction.deleteMany({ user: req.user._id });
    await Budget.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting account'
    });
  }
});

// @route   POST /api/users/deactivate
// @desc    Deactivate user account
// @access  Private
router.post('/deactivate', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deactivating account'
    });
  }
});

// @route   POST /api/users/reactivate
// @desc    Reactivate user account
// @access  Private
router.post('/reactivate', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account reactivated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Reactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error reactivating account'
    });
  }
});

module.exports = router;