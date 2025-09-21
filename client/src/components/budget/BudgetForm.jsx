import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { budgetService } from '../../services/budgetService';

const BudgetForm = ({ onSubmit, onCancel, initialData = null, isEdit = false }) => {
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
      name: '',
      category: '',
      amount: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      alertThreshold: 80,
      color: '#3B82F6'
    }
  });

  const watchPeriod = watch('period');
  const watchCategory = watch('category');
  const categories = budgetService.getCategories();
  const periods = budgetService.getPeriods();

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        startDate: new Date(initialData.startDate).toISOString().split('T')[0],
        endDate: new Date(initialData.endDate).toISOString().split('T')[0]
      });
    }
  }, [initialData, reset]);

  // Auto-calculate dates based on period
  useEffect(() => {
    if (!isEdit) {
      const now = new Date();
      let startDate, endDate;

      switch (watchPeriod) {
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
        default:
          return;
      }

      setValue('startDate', startDate.toISOString().split('T')[0]);
      setValue('endDate', endDate.toISOString().split('T')[0]);
    }
  }, [watchPeriod, setValue, isEdit]);

  // Auto-generate budget name
  useEffect(() => {
    if (!isEdit && watchCategory && watchPeriod) {
      const categoryInfo = budgetService.getCategoryInfo(watchCategory);
      const now = new Date();
      let periodLabel;

      switch (watchPeriod) {
        case 'weekly':
          periodLabel = `Week of ${now.toLocaleDateString()}`;
          break;
        case 'monthly':
          periodLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          break;
        case 'yearly':
          periodLabel = now.getFullYear().toString();
          break;
        default:
          periodLabel = '';
      }

      setValue('name', `${categoryInfo.label} - ${periodLabel}`);
      setValue('color', categoryInfo.color);
    }
  }, [watchCategory, watchPeriod, setValue, isEdit]);

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      // Format data for API
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount),
        alertThreshold: parseInt(data.alertThreshold),
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString()
      };

      await onSubmit(formattedData);
    } catch (error) {
      setError(error.message || 'Failed to save budget');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEdit ? 'Edit Budget' : 'Create New Budget'}
        </h2>
        <p className="text-gray-600">
          {isEdit ? 'Update budget details' : 'Set a spending limit for a category'}
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
        {/* Budget Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">Budget Name</label>
          <input
            {...register('name', {
              required: 'Budget name is required',
              maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
            })}
            type="text"
            id="name"
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="e.g., Groceries - January 2024"
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
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
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Budget Amount</label>
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
          {/* Period */}
          <div className="form-group">
            <label htmlFor="period" className="form-label">Budget Period</label>
            <select
              {...register('period', { required: 'Period is required' })}
              id="period"
              className={`input ${errors.period ? 'input-error' : ''}`}
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            {errors.period && <p className="form-error">{errors.period.message}</p>}
          </div>

          {/* Alert Threshold */}
          <div className="form-group">
            <label htmlFor="alertThreshold" className="form-label">
              Alert Threshold ({watch('alertThreshold')}%)
            </label>
            <input
              {...register('alertThreshold', {
                required: 'Alert threshold is required',
                min: { value: 0, message: 'Threshold must be at least 0%' },
                max: { value: 100, message: 'Threshold cannot exceed 100%' }
              })}
              type="range"
              id="alertThreshold"
              min="0"
              max="100"
              step="5"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Get notified when you spend {watch('alertThreshold')}% of your budget
            </p>
            {errors.alertThreshold && <p className="form-error">{errors.alertThreshold.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              {...register('startDate', { required: 'Start date is required' })}
              type="date"
              id="startDate"
              className={`input ${errors.startDate ? 'input-error' : ''}`}
            />
            {errors.startDate && <p className="form-error">{errors.startDate.message}</p>}
          </div>

          {/* End Date */}
          <div className="form-group">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              {...register('endDate', { required: 'End date is required' })}
              type="date"
              id="endDate"
              className={`input ${errors.endDate ? 'input-error' : ''}`}
            />
            {errors.endDate && <p className="form-error">{errors.endDate.message}</p>}
          </div>
        </div>

        {/* Color */}
        <div className="form-group">
          <label htmlFor="color" className="form-label">Budget Color</label>
          <div className="flex items-center space-x-4">
            <input
              {...register('color')}
              type="color"
              id="color"
              className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              Choose a color to identify this budget in charts and reports
            </span>
          </div>
        </div>

        {/* Budget Preview */}
        {watch('name') && watch('amount') && (
          <div className="form-group">
            <label className="form-label">Budget Preview</label>
            <div 
              className="p-4 rounded-lg border-2 border-dashed"
              style={{ borderColor: watch('color'), backgroundColor: `${watch('color')}15` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{watch('name')}</h4>
                  <p className="text-sm text-gray-600">
                    {budgetService.getCategoryInfo(watch('category')).label} • {watch('period')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold" style={{ color: watch('color') }}>
                    ${parseFloat(watch('amount') || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Alert at {watch('alertThreshold')}%
                  </p>
                </div>
              </div>
            </div>
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
                {isEdit ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              isEdit ? 'Update Budget' : 'Create Budget'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;