import React, { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetService';

const BudgetNotifications = ({ budgets = [], onNotificationDismiss }) => {
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, [budgets]);

  const generateNotifications = () => {
    const newNotifications = [];
    const activeBudgets = budgets.filter(b => b.isActive);

    activeBudgets.forEach(budget => {
      const status = budgetService.getBudgetStatus(budget);
      const percentage = budgetService.calculateProgress(budget);
      
      // Budget exceeded notification
      if (status === 'exceeded') {
        const overspent = budget.spent - budget.amount;
        newNotifications.push({
          id: `exceeded-${budget._id}`,
          type: 'error',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${budget.name} budget by $${overspent.toLocaleString()}`,
          budgetId: budget._id,
          budgetName: budget.name,
          timestamp: new Date(),
          priority: 'high'
        });
      }
      // Warning notification
      else if (status === 'warning') {
        newNotifications.push({
          id: `warning-${budget._id}`,
          type: 'warning',
          title: 'Budget Warning',
          message: `You've spent ${Math.round(percentage)}% of your ${budget.name} budget`,
          budgetId: budget._id,
          budgetName: budget.name,
          timestamp: new Date(),
          priority: 'medium'
        });
      }
      // Approaching limit notification
      else if (percentage >= 70 && percentage < budget.alertThreshold) {
        newNotifications.push({
          id: `approaching-${budget._id}`,
          type: 'info',
          title: 'Approaching Limit',
          message: `You're approaching the limit for ${budget.name} (${Math.round(percentage)}% spent)`,
          budgetId: budget._id,
          budgetName: budget.name,
          timestamp: new Date(),
          priority: 'low'
        });
      }
    });

    // Check for budget end dates approaching
    activeBudgets.forEach(budget => {
      const daysRemaining = budgetService.getDaysRemaining(budget.endDate);
      if (daysRemaining <= 7 && daysRemaining > 0) {
        newNotifications.push({
          id: `ending-${budget._id}`,
          type: 'info',
          title: 'Budget Ending Soon',
          message: `Your ${budget.name} budget ends in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
          budgetId: budget._id,
          budgetName: budget.name,
          timestamp: new Date(),
          priority: 'medium'
        });
      }
    });

    // Sort by priority and timestamp
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setNotifications(newNotifications);
  };

  const handleDismiss = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (onNotificationDismiss) {
      onNotificationDismiss(notificationId);
    }
  };

  const handleDismissAll = () => {
    setNotifications([]);
    if (onNotificationDismiss) {
      notifications.forEach(n => onNotificationDismiss(n.id));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return (
          <svg className="h-5 w-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.726-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'error': return 'bg-danger-50 border-danger-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Budget Notifications</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {notifications.length}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            {isExpanded ? 'Show Less' : 'Show All'}
          </button>
          <button
            onClick={handleDismissAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Dismiss All
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.slice(0, isExpanded ? notifications.length : 3).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${getNotificationBgColor(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    <button
                      onClick={() => handleDismiss(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    Budget: {notification.budgetName}
                  </span>
                  <span className={`text-xs font-medium ${
                    notification.priority === 'high' ? 'text-danger-600' :
                    notification.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {!isExpanded && notifications.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Show {notifications.length - 3} more notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetNotifications;
