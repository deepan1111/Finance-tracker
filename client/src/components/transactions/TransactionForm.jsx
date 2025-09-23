import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { transactionService } from '../../services/transactionService';

const TransactionForm = ({ onSubmit, onCancel, initialData = null, isEdit = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: initialData || {
      type: 'expense',
      category: '',
      paymentMethod: 'card',
      date: new Date().toISOString().split('T')[0],
      // Keep tags as a string in the form input; convert on submit
      tags: ''
    }
  });

  const watchType = watch('type');
  const categories = transactionService.getCategories();
  const paymentMethods = transactionService.getPaymentMethods();

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0],
        // Normalize tags to a comma-separated string for the text input
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(', ')
          : (initialData.tags || '')
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      // Format data for API
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
        // Ensure tags is an array of trimmed non-empty strings
        tags: Array.isArray(data.tags)
          ? data.tags.map(tag => String(tag).trim()).filter(Boolean)
          : (typeof data.tags === 'string' && data.tags.length > 0
              ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
              : [])
      };

      await onSubmit(formattedData);
    } catch (error) {
      setError(error.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEdit ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <p className="text-gray-600">
          {isEdit ? 'Update transaction details' : 'Record a new income or expense'}
        </p>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-danger-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Transaction Type */}
        <div className="form-group">
          <label className="form-label">Transaction Type</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                {...register('type', { required: 'Transaction type is required' })}
                type="radio"
                value="income"
                className="h-4 w-4 text-success-600 focus:ring-success-500"
              />
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-success-100 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Income</span>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                {...register('type', { required: 'Transaction type is required' })}
                type="radio"
                value="expense"
                className="h-4 w-4 text-danger-600 focus:ring-danger-500"
              />
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-danger-100 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Expense</span>
              </div>
            </label>
          </div>
          {errors.type && <p className="form-error">{errors.type.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
              })}
              type="text"
              id="title"
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Grocery shopping, Salary, Coffee"
            />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                type="number"
                step="0.01"
                id="amount"
                className={`input pl-8 ${errors.amount ? 'input-error' : ''}`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="form-error">{errors.amount.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              id="category"
              className={`input ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">Select category</option>
              {(categories[watchType] || []).map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              id="date"
              className={`input ${errors.date ? 'input-error' : ''}`}
            />
            {errors.date && <p className="form-error">{errors.date.message}</p>}
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
          <select
            {...register('paymentMethod')}
            id="paymentMethod"
            className="input"
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description (Optional)</label>
          <textarea
            {...register('description', {
              maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
            })}
            id="description"
            rows={3}
            className={`input ${errors.description ? 'input-error' : ''}`}
            placeholder="Add any additional details..."
          />
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags" className="form-label">Tags (Optional)</label>
          <input
            {...register('tags')}
            type="text"
            id="tags"
            className="input"
            placeholder="Enter tags separated by commas (e.g., work, lunch, important)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Recurring Transaction */}
        <div className="form-group">
          <div className="flex items-center space-x-3">
            <input
              {...register('isRecurring')}
              type="checkbox"
              id="isRecurring"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isRecurring" className="form-label mb-0">
              This is a recurring transaction
            </label>
          </div>
        </div>

        {/* Recurring Frequency (shown only if isRecurring is checked) */}
        {watch('isRecurring') && (
          <div className="form-group">
            <label htmlFor="recurringFrequency" className="form-label">Frequency</label>
            <select
              {...register('recurringFrequency', {
                required: watch('isRecurring') ? 'Frequency is required for recurring transactions' : false
              })}
              id="recurringFrequency"
              className={`input ${errors.recurringFrequency ? 'input-error' : ''}`}
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.recurringFrequency && <p className="form-error">{errors.recurringFrequency.message}</p>}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="spinner h-4 w-4 mr-2"></div>
                {isEdit ? 'Updating...' : 'Saving...'}
              </div>
            ) : (
              isEdit ? 'Update Transaction' : 'Save Transaction'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;