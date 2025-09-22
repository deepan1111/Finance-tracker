const router = require('express').Router();
const DashboardController = require('../controllers/dashboard.controller');
const { auth } = require('../middleware/auth');

// Debug: Check what's actually exported
console.log('DashboardController:', DashboardController);
console.log('getStats method:', typeof DashboardController.getStats);
console.log('getOverview method:', typeof DashboardController.getOverview);

// Routes without validation
router.get('/stats', auth, DashboardController.getStats);
router.get('/overview', auth, DashboardController.getOverview);
router.get('/recent-transactions', auth, DashboardController.getRecentTransactions);
router.get('/spending-trends', auth, DashboardController.getSpendingTrends);
router.get('/financial-health', auth, DashboardController.getFinancialHealth);
router.get('/savings-progress', auth, DashboardController.getSavingsProgress);

module.exports = router;