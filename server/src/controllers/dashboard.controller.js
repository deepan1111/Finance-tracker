// controllers/dashboard.controller.js - Minimal test version
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

class DashboardController {
  async getStats(req, res) {
    try {
      res.json({ message: "Stats endpoint working", success: true });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOverview(req, res) {
    try {
      res.json({ message: "Overview endpoint working", success: true });
    } catch (error) {
      console.error('Overview error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRecentTransactions(req, res) {
    try {
      res.json({ message: "Recent transactions endpoint working", success: true });
    } catch (error) {
      console.error('Recent transactions error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSpendingTrends(req, res) {
    try {
      res.json({ message: "Spending trends endpoint working", success: true });
    } catch (error) {
      console.error('Spending trends error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFinancialHealth(req, res) {
    try {
      res.json({ message: "Financial health endpoint working", success: true });
    } catch (error) {
      console.error('Financial health error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSavingsProgress(req, res) {
    try {
      res.json({ message: "Savings progress endpoint working", success: true });
    } catch (error) {
      console.error('Savings progress error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new DashboardController();