// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Layout from '../components/layout/Layout';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     totalBalance: 0,
//     monthlyIncome: 0,
//     monthlyExpenses: 0,
//     savingsRate: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate loading dashboard data
//     const loadDashboardData = async () => {
//       try {
//         // TODO: Replace with actual API calls
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Mock data for now
//         setStats({
//           totalBalance: 12450.00,
//           monthlyIncome: 5000.00,
//           monthlyExpenses: 3200.00,
//           savingsRate: 36,
//         });
//       } catch (error) {
//         console.error('Error loading dashboard data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadDashboardData();
//   }, []);

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="spinner h-8 w-8 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading dashboard...</p>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="space-y-6">
//         {/* Welcome Header */}
//         <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
//           <h1 className="text-2xl font-bold mb-2">
//             Welcome back, {user?.name}! 👋
//           </h1>
//           <p className="text-primary-100">
//             Here's your financial overview for this month
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Total Balance */}
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Balance</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${stats.totalBalance.toLocaleString()}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
//                 <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Monthly Income */}
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Monthly Income</p>
//                 <p className="text-2xl font-bold text-success-600">
//                   +${stats.monthlyIncome.toLocaleString()}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-success-100 rounded-full flex items-center justify-center">
//                 <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Monthly Expenses */}
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
//                 <p className="text-2xl font-bold text-danger-600">
//                   -${stats.monthlyExpenses.toLocaleString()}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-danger-100 rounded-full flex items-center justify-center">
//                 <svg className="h-6 w-6 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Savings Rate */}
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Savings Rate</p>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {stats.savingsRate}%
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
//                 <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Quick Add Transaction */}
//           <div className="card">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <button className="btn-success p-4 flex flex-col items-center space-y-2">
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 <span className="text-sm font-medium">Add Income</span>
//               </button>
//               <button className="btn-danger p-4 flex flex-col items-center space-y-2">
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                 </svg>
//                 <span className="text-sm font-medium">Add Expense</span>
//               </button>
//             </div>
//           </div>

//           {/* Recent Transactions */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
//               <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
//                 View all
//               </button>
//             </div>
//             <div className="space-y-3">
//               {/* Mock transactions */}
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-8 w-8 bg-success-100 rounded-full flex items-center justify-center">
//                     <svg className="h-4 w-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Salary</p>
//                     <p className="text-xs text-gray-500">Today</p>
//                   </div>
//                 </div>
//                 <span className="text-sm font-medium text-success-600">+$3,000</span>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-8 w-8 bg-danger-100 rounded-full flex items-center justify-center">
//                     <svg className="h-4 w-4 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Groceries</p>
//                     <p className="text-xs text-gray-500">Yesterday</p>
//                   </div>
//                 </div>
//                 <span className="text-sm font-medium text-danger-600">-$150</span>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-8 w-8 bg-danger-100 rounded-full flex items-center justify-center">
//                     <svg className="h-4 w-4 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Coffee</p>
//                     <p className="text-xs text-gray-500">2 days ago</p>
//                   </div>
//                 </div>
//                 <span className="text-sm font-medium text-danger-600">-$5</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Budget Overview */}
//         <div className="card">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
//             <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
//               Manage budgets
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Food Budget */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Food & Dining</span>
//                 <span className="font-medium">$450 / $600</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-success-600 h-2 rounded-full" style={{ width: '75%' }}></div>
//               </div>
//               <p className="text-xs text-gray-500">$150 remaining</p>
//             </div>

//             {/* Transport Budget */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Transportation</span>
//                 <span className="font-medium">$320 / $400</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '80%' }}></div>
//               </div>
//               <p className="text-xs text-gray-500">$80 remaining</p>
//             </div>

//             {/* Entertainment Budget */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Entertainment</span>
//                 <span className="font-medium">$280 / $250</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-danger-600 h-2 rounded-full" style={{ width: '100%' }}></div>
//               </div>
//               <p className="text-xs text-danger-600">$30 over budget</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalBalance: 12450.00,
          monthlyIncome: 5000.00,
          monthlyExpenses: 3200.00,
          savingsRate: 36,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
              <div className="w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2 animation-delay-150"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your finances...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Enhanced Welcome Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-56 h-56 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.name}! ✨
              </h1>
              <p className="text-indigo-100 text-lg">
                Your financial dashboard for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 text-sm font-medium">
                  📊 View Reports
                </button>
                <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 text-sm font-medium">
                  🎯 Set Goals
                </button>
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Balance Card */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+2.4%</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Balance</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalBalance.toLocaleString()}
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>+$450 from last month</span>
                </div>
              </div>
            </div>

            {/* Monthly Income Card */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+8.1%</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Monthly Income</p>
                <p className="text-3xl font-bold text-green-600">
                  +${stats.monthlyIncome.toLocaleString()}
                </p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            {/* Monthly Expenses Card */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-3.2%</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Monthly Expenses</p>
                <p className="text-3xl font-bold text-red-600">
                  -${stats.monthlyExpenses.toLocaleString()}
                </p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>

            {/* Savings Rate Card */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Excellent</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Savings Rate</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.savingsRate}%
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
                      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" 
                        className="text-purple-600" 
                        strokeDasharray={`${2 * Math.PI * 36 * stats.savingsRate / 100} ${2 * Math.PI * 36}`}
                        strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="h-8 w-8 mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-semibold">Add Income</span>
                </button>
                <button className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="h-8 w-8 mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span className="text-sm font-semibold">Add Expense</span>
                </button>
                <button className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="h-8 w-8 mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold">Set Budget</span>
                </button>
                <button className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg className="h-8 w-8 mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v7m3-2h6l2 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5l2-2z" />
                  </svg>
                  <span className="text-sm font-semibold">Export Data</span>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200">
                  View all →
                </button>
              </div>
              <div className="space-y-4">
                {/* Transaction Items */}
                <div className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Monthly Salary</p>
                      <p className="text-xs text-gray-500">Today at 9:00 AM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">+$3,000</span>
                    <p className="text-xs text-gray-500">Income</p>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Grocery Shopping</p>
                      <p className="text-xs text-gray-500">Yesterday at 6:30 PM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-red-600">-$150</span>
                    <p className="text-xs text-gray-500">Food & Dining</p>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Netflix Subscription</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-red-600">-$15.99</span>
                    <p className="text-xs text-gray-500">Entertainment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Budget Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Budget Overview</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200">
                Manage budgets →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Food & Dining Budget */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🍕</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Food & Dining</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">$450 / $600</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: '75%' }}></div>
                  </div>
                  <div className="absolute -top-1 left-[75%] transform -translate-x-1/2">
                    <div className="h-5 w-5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">75% used</span>
                  <span className="text-green-600 font-medium">$150 remaining</span>
                </div>
              </div>

              {/* Transportation Budget */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🚗</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Transportation</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">$320 / $400</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: '80%' }}></div>
                  </div>
                  <div className="absolute -top-1 left-[80%] transform -translate-x-1/2">
                    <div className="h-5 w-5 bg-yellow-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">80% used</span>
                  <span className="text-yellow-600 font-medium">$80 remaining</span>
                </div>
              </div>

              {/* Entertainment Budget */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎮</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Entertainment</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">$280 / $250</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full transition-all duration-500 ease-out animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                  <div className="absolute -top-1 left-full transform -translate-x-1/2">
                    <div className="h-5 w-5 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">112% used</span>
                  <span className="text-red-600 font-medium">$30 over budget ⚠️</span>
                </div>
              </div>
            </div>

            {/* Monthly Spending Trend */}
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Spending Trend</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$3,200</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">-12% from last month</span>
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;