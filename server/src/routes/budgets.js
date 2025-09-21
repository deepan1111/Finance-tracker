const express = require('express');
const { z } = require('zod');
const Budget = require('../models/Budget');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const budgetSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum([
    'food', 'transport', 'entertainment', 'shopping', 'bills', 'healthcare',
    'education', 'travel', 'groceries', 'rent', 'utilities', 'insurance',
    'fitness', 'other-expense', 'total'
  ]),
  amount: z.number().positive(),
  period: z.enum(['weekly', 'monthly', 'yearly']).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  alertThreshold: z.number().min(0).max(100).optional(),
  color: z.string().optional()
});

const updateBudgetSchema = budgetSchema.partial();

// @route   GET /api/budgets
// @desc    Get all budgets for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { active, category, period } = req.query;
    
    // Build filter
    const filter = { user: req.user._id };
    if (active !== undefined) filter.isActive = active === 'true';
    if (category) filter.category = category;
    if (period) filter.period = period;

    const budgets = await Budget.find(filter).sort({ startDate: -1 });

    // Update spent amounts for all budgets
    await Budget.updateSpentAmounts(req.user._id);
    
    // Refetch budgets with updated spent amounts
    const updatedBudgets = await Budget.find(filter).sort({ startDate: -1 });

    res.json({
      success: true,
      data: { budgets: updatedBudgets }
    });

  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting budgets'
    });
  }
});

// @route   GET /api/budgets/active
// @desc    Get active budgets for current period
// @access  Private
router.get('/active', auth, async (req, res) => {
  try {
    // Update spent amounts first
    await Budget.updateSpentAmounts(req.user._id);
    
    const activeBudgets = await Budget.getUserActiveBudgets(req.user._id);

    res.json({
      success: true,
      data: { budgets: activeBudgets }
    });

  } catch (error) {
    console.error('Get active budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting active budgets'
    });
  }
});

// @route   GET /api/budgets/overview
// @desc    Get budget overview and alerts
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    // Update spent amounts first
    await Budget.updateSpentAmounts(req.user._id);
    
    const activeBudgets = await Budget.getUserActiveBudgets(req.user._id);
    
    // Calculate overview statistics
    const totalBudgeted = activeBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = activeBudgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalRemaining = totalBudgeted - totalSpent;
    
    // Find budgets with alerts
    const alerts = activeBudgets.filter(budget => {
      const percentage = budget.percentageSpent;
      return percentage >= budget.alertThreshold;
    });

    // Budget status breakdown
    const statusBreakdown = {
      onTrack: activeBudgets.filter(b => b.status === 'on-track').length,
      warning: activeBudgets.filter(b => b.status === 'warning').length,
      exceeded: activeBudgets.filter(b => b.status === 'exceeded').length
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalBudgeted,
          totalSpent,
          totalRemaining,
          budgetCount: activeBudgets.length
        },
        statusBreakdown,
        alerts: alerts.map(budget => ({
          id: budget._id,
          name: budget.name,
          category: budget.category,
          percentageSpent: budget.percentageSpent,
          status: budget.status,
          remaining: budget.remaining
        }))
      }
    });

  } catch (error) {
    console.error('Get budget overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting budget overview'
    });
  }
});

// @route   GET /api/budgets/:id
// @desc    Get single budget
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Update spent amount for this budget
    await Budget.updateSpentAmounts(req.user._id, budget.category);
    
    // Refetch budget with updated spent amount
    const updatedBudget = await Budget.findById(req.params.id);

    res.json({
      success: true,
      data: { budget: updatedBudget }
    });

  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting budget'
    });
  }
});

// @route   POST /api/budgets
// @desc    Create new budget
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate request body
    const validatedData = budgetSchema.parse(req.body);

    // Check for existing budget in same period and category
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category: validatedData.category,
      isActive: true,
      $or: [
        {
          startDate: {
            $lte: new Date(validatedData.endDate)
          },
          endDate: {
            $gte: new Date(validatedData.startDate)
          }
        }
      ]
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: 'A budget for this category already exists in the specified period'
      });
    }

    // Create budget
    const budget = new Budget({
      ...validatedData,
      user: req.user._id,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate)
    });

    await budget.save();

    // Update spent amount
    await Budget.updateSpentAmounts(req.user._id, budget.category);
    
    // Refetch budget with updated spent amount
    const updatedBudget = await Budget.findById(budget._id);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: { budget: updatedBudget }
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

    console.error('Create budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating budget'
    });
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update budget
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate request body
    const validatedData = updateBudgetSchema.parse(req.body);

    // Convert date strings to Date objects if present
    if (validatedData.startDate) validatedData.startDate = new Date(validatedData.startDate);
    if (validatedData.endDate) validatedData.endDate = new Date(validatedData.endDate);

    // Find and update budget
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...validatedData },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Update spent amount
    await Budget.updateSpentAmounts(req.user._id, budget.category);
    
    // Refetch budget with updated spent amount
    const updatedBudget = await Budget.findById(budget._id);

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: { budget: updatedBudget }
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

    console.error('Update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating budget'
    });
  }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete budget
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });

  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting budget'
    });
  }
});

// @route   POST /api/budgets/:id/toggle
// @desc    Toggle budget active status
// @access  Private
router.post('/:id/toggle', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    budget.isActive = !budget.isActive;
    await budget.save();

    res.json({
      success: true,
      message: `Budget ${budget.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { budget }
    });

  } catch (error) {
    console.error('Toggle budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling budget status'
    });
  }
});

module.exports = router;