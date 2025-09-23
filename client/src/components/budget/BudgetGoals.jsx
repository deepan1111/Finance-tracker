import React, { useState } from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetGoals = ({ budgets = [], onGoalCreate, onGoalUpdate, onGoalDelete }) => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  // Sample goals data (in a real app, this would come from props or API)
  const [goals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 3500,
      targetDate: '2024-12-31',
      category: 'savings',
      priority: 'high',
      description: 'Build a 6-month emergency fund',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Vacation Fund',
      targetAmount: 3000,
      currentAmount: 1200,
      targetDate: '2024-08-15',
      category: 'travel',
      priority: 'medium',
      description: 'Save for summer vacation',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'New Laptop',
      targetAmount: 2000,
      currentAmount: 800,
      targetDate: '2024-06-30',
      category: 'shopping',
      priority: 'low',
      description: 'Upgrade to a new MacBook Pro',
      createdAt: '2024-02-01'
    }
  ]);

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const goalData = {
      ...goalForm,
      targetAmount: parseFloat(goalForm.targetAmount),
      currentAmount: parseFloat(goalForm.currentAmount)
    };

    if (editingGoal) {
      onGoalUpdate(editingGoal.id, goalData);
    } else {
      onGoalCreate(goalData);
    }

    setShowGoalForm(false);
    setEditingGoal(null);
    setGoalForm({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: '',
      priority: 'medium',
      description: ''
    });
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category,
      priority: goal.priority,
      description: goal.description
    });
    setShowGoalForm(true);
  };

  const getProgressPercentage = (goal) => {
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  };

  const getDaysRemaining = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger-600 bg-danger-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-success-600 bg-success-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Unknown';
    }
  };

  const categories = budgetService.getCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Budget Goals</h3>
          <p className="text-sm text-gray-600">Set and track your financial goals</p>
        </div>
        <button
          onClick={() => setShowGoalForm(true)}
          className="btn-primary"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal);
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const isCompleted = progressPercentage >= 100;
          const isOverdue = daysRemaining === 0 && !isCompleted;

          return (
            <div key={goal.id} className={`card ${isCompleted ? 'bg-success-50 border-success-200' : ''}`}>
              <div className="space-y-4">
                {/* Goal Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {getPriorityLabel(goal.priority)}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-success-600 bg-success-100">
                        Completed
                      </span>
                    )}
                    {isOverdue && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-danger-600 bg-danger-100">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-success-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Amount and Date Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Date</span>
                    <span className="font-medium">
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-medium text-primary-600">
                      ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="flex-1 btn-outline btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onGoalDelete(goal.id)}
                    className="flex-1 btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                </h3>
                <button
                  onClick={() => {
                    setShowGoalForm(false);
                    setEditingGoal(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={goalForm.name}
                    onChange={(e) => setGoalForm({...goalForm, name: e.target.value})}
                    className="input"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                    <input
                      type="number"
                      value={goalForm.targetAmount}
                      onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})}
                      className="input"
                      placeholder="10000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
                    <input
                      type="number"
                      value={goalForm.currentAmount}
                      onChange={(e) => setGoalForm({...goalForm, currentAmount: e.target.value})}
                      className="input"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm({...goalForm, targetDate: e.target.value})}
                    className="input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={goalForm.category}
                      onChange={(e) => setGoalForm({...goalForm, category: e.target.value})}
                      className="input"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={goalForm.priority}
                      onChange={(e) => setGoalForm({...goalForm, priority: e.target.value})}
                      className="input"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={goalForm.description}
                    onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
                    className="input"
                    rows={3}
                    placeholder="Describe your goal..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoalForm(false);
                      setEditingGoal(null);
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetGoals;
