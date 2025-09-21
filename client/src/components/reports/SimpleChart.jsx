import React, { useState, useEffect } from 'react';

const SimpleCharts = ({ transactions = [] }) => {
  const [chartData, setChartData] = useState({
    categoryData: [],
    monthlyData: [],
    incomeVsExpense: { income: 0, expense: 0 }
  });

  useEffect(() => {
    if (transactions.length === 0) return;

    // Process category data
    const categoryTotals = {};
    const monthlyTotals = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      // Category breakdown
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.amount;

      // Monthly breakdown
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { income: 0, expense: 0 };
      }
      monthlyTotals[month][transaction.type] += transaction.amount;

      // Income vs Expense
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    setChartData({
      categoryData: Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 6),
      monthlyData: Object.entries(monthlyTotals)
        .map(([month, data]) => ({ month, ...data })),
      incomeVsExpense: { income: totalIncome, expense: totalExpense }
    });
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMaxValue = (data, key) => {
    return Math.max(...data.map(item => item[key] || 0));
  };

  return (
    <div className="space-y-6">
      {/* Income vs Expense Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-success-500 rounded"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <span className="font-medium text-success-600">
              {formatCurrency(chartData.incomeVsExpense.income)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="bg-success-500 h-6 rounded-full flex items-center justify-end pr-2"
              style={{ 
                width: `${Math.max(10, (chartData.incomeVsExpense.income / (chartData.incomeVsExpense.income + chartData.incomeVsExpense.expense)) * 100)}%` 
              }}
            >
              <span className="text-xs text-white font-medium">
                {Math.round((chartData.incomeVsExpense.income / (chartData.incomeVsExpense.income + chartData.incomeVsExpense.expense)) * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-danger-500 rounded"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
            <span className="font-medium text-danger-600">
              {formatCurrency(chartData.incomeVsExpense.expense)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="bg-danger-500 h-6 rounded-full flex items-center justify-end pr-2"
              style={{ 
                width: `${Math.max(10, (chartData.incomeVsExpense.expense / (chartData.incomeVsExpense.income + chartData.incomeVsExpense.expense)) * 100)}%` 
              }}
            >
              <span className="text-xs text-white font-medium">
                {Math.round((chartData.incomeVsExpense.expense / (chartData.incomeVsExpense.income + chartData.incomeVsExpense.expense)) * 100)}%
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Net Balance</span>
              <span className={`font-bold ${
                chartData.incomeVsExpense.income - chartData.incomeVsExpense.expense >= 0 
                  ? 'text-success-600' 
                  : 'text-danger-600'
              }`}>
                {formatCurrency(chartData.incomeVsExpense.income - chartData.incomeVsExpense.expense)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
        {chartData.categoryData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No category data available</p>
        ) : (
          <div className="space-y-3">
            {chartData.categoryData.map((item, index) => {
              const maxAmount = getMaxValue(chartData.categoryData, 'amount');
              const percentage = (item.amount / maxAmount) * 100;
              const colors = [
                'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
              ];
              
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                      <span className="text-sm text-gray-600 capitalize">
                        {item.category.replace('-', ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index % colors.length]}`}
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Trends Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        {chartData.monthlyData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No monthly data available</p>
        ) : (
          <div className="space-y-4">
            {chartData.monthlyData.map((monthData) => {
              const maxIncome = getMaxValue(chartData.monthlyData, 'income');
              const maxExpense = getMaxValue(chartData.monthlyData, 'expense');
              const maxTotal = Math.max(maxIncome, maxExpense);
              
              return (
                <div key={monthData.month} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">{monthData.month}</h4>
                  
                  {/* Income Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="w-16 text-xs text-gray-600">Income</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-success-500 h-4 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(5, (monthData.income / maxTotal) * 100)}%` }}
                      >
                        {monthData.income > 0 && (
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(monthData.income)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expense Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="w-16 text-xs text-gray-600">Expense</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-danger-500 h-4 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(5, (monthData.expense / maxTotal) * 100)}%` }}
                      >
                        {monthData.expense > 0 && (
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(monthData.expense)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCharts;