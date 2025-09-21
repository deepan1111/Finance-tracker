import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import SimpleCharts from '../components/reports/SimpleChart';
import { transactionService } from '../services/transactionService';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  // Load transactions for reports
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await transactionService.getTransactionsByDateRange(
        new Date(dateRange.startDate),
        new Date(dateRange.endDate)
      );
      
      if (response.success) {
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      setError(error.message || 'Failed to load transaction data');
      // For demo purposes, use mock data if API fails
      setTransactions([
        {
          _id: '1',
          title: 'Salary',
          amount: 5000,
          type: 'income',
          category: 'salary',
          date: new Date(2024, 0, 1).toISOString()
        },
        {
          _id: '2',
          title: 'Groceries',
          amount: 150,
          type: 'expense',
          category: 'food',
          date: new Date(2024, 0, 5).toISOString()
        },
        {
          _id: '3',
          title: 'Gas',
          amount: 60,
          type: 'expense',
          category: 'transport',
          date: new Date(2024, 0, 10).toISOString()
        },
        {
          _id: '4',
          title: 'Freelance',
          amount: 800,
          type: 'income',
          category: 'freelance',
          date: new Date(2024, 1, 1).toISOString()
        },
        {
          _id: '5',
          title: 'Movie',
          amount: 25,
          type: 'expense',
          category: 'entertainment',
          date: new Date(2024, 1, 15).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [dateRange]);

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Title', 'Type', 'Category', 'Amount'],
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.title,
        t.type,
        t.category,
        t.amount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600">Analyze your financial data and trends</p>
          </div>
          <button 
            onClick={exportData}
            className="btn-outline"
            disabled={transactions.length === 0}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quick Ranges</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'This Year', days: 0, startOfYear: true },
                  { label: 'Last 30 Days', days: 30 },
                  { label: 'Last 90 Days', days: 90 },
                  { label: 'Last 6 Months', days: 180 }
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      const end = new Date();
                      const start = range.startOfYear 
                        ? new Date(end.getFullYear(), 0, 1)
                        : new Date(end.getTime() - range.days * 24 * 60 * 60 * 1000);
                      
                      setDateRange({
                        startDate: start.toISOString().split('T')[0],
                        endDate: end.toISOString().split('T')[0]
                      });
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-sm font-medium">Using demo data</span>
                <p className="text-sm mt-1">Unable to connect to API. Showing sample data for demonstration.</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Total Income', 'Total Expenses', 'Net Balance', 'Transactions'].map((label, index) => {
            const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const netBalance = totalIncome - totalExpenses;
            
            const values = [totalIncome, totalExpenses, netBalance, transactions.length];
            const colors = ['text-success-600', 'text-danger-600', netBalance >= 0 ? 'text-success-600' : 'text-danger-600', 'text-gray-900'];
            
            return (
              <div key={label} className="card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className={`text-2xl font-bold ${colors[index]}`}>
                    {index < 3 
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(values[index])
                      : values[index].toLocaleString()
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        {isLoading ? (
          <div className="card text-center py-12">
            <div className="spinner h-8 w-8 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report data...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data for selected period
            </h3>
            <p className="text-gray-600">
              Try adjusting the date range or add some transactions first.
            </p>
          </div>
        ) : (
          <SimpleCharts transactions={transactions} />
        )}
      </div>
    </Layout>
  );
};

export default Reports;
