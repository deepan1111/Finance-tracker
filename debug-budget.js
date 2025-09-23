// Debug script to test budget functionality
const mongoose = require('mongoose');

// Connect to MongoDB (adjust connection string as needed)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test budget model
const testBudgetModel = async () => {
  try {
    const Budget = require('./server/src/models/Budget');
    
    console.log('Testing Budget model...');
    
    // Test if we can find budgets
    const budgets = await Budget.find({});
    console.log(`Found ${budgets.length} budgets in database`);
    
    // Test getUserActiveBudgets method
    if (budgets.length > 0) {
      const userId = budgets[0].user;
      const activeBudgets = await Budget.getUserActiveBudgets(userId);
      console.log(`Found ${activeBudgets.length} active budgets for user ${userId}`);
    }
    
    console.log('Budget model test completed successfully');
  } catch (error) {
    console.error('Budget model test error:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await testBudgetModel();
  process.exit(0);
};

main().catch(console.error);
