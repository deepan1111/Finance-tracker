

import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, CreditCard, DollarSign, Home, Car, ShoppingBag, Users, Calendar, Bell, Search, Settings, ChevronRight, AlertTriangle, PiggyBank, Target, Activity, Zap, Coffee, Heart, Menu, X } from 'lucide-react';
import L from "../components/layout/Layout"


const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex relative">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 bg-slate-900/95 lg:bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="text-white font-bold text-sm sm:text-base">Other Level's</h2>
                  <p className="text-slate-400 text-xs">Finance Tracker</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {months.map((month, index) => (
              <button
                key={month}
                className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-all text-sm ${
                  index === currentMonth 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-l-2 border-cyan-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {!sidebarCollapsed ? month : month.slice(0, 1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 sm:p-6 hidden lg:block">
          <div className="w-full h-24 sm:h-32 bg-slate-800/30 rounded-lg"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto w-full">
        {children}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25 z-30"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [animateNumbers, setAnimateNumbers] = useState(false);

  useEffect(() => {
    setAnimateNumbers(true);
  }, []);

  const incomeExpenseData = [
    { month: 'Jan', income: 18000, expenses: 12000 },
    { month: 'Feb', income: 22000, expenses: 15000 },
    { month: 'Mar', income: 19000, expenses: 13000 },
    { month: 'Apr', income: 24000, expenses: 16000 },
    { month: 'May', income: 21000, expenses: 14000 },
    { month: 'Jun', income: 25000, expenses: 17000 },
    { month: 'Jul', income: 23000, expenses: 15500 },
    { month: 'Aug', income: 26000, expenses: 18000 },
    { month: 'Sep', income: 24500, expenses: 16500 },
    { month: 'Oct', income: 27000, expenses: 19000 },
    { month: 'Nov', income: 25500, expenses: 17500 },
    { month: 'Dec', income: 28000, expenses: 20000 }
  ];

  const incomeSourceData = [
    { name: 'E-commerce', value: 2100 },
    { name: 'Google AdSense', value: 950 },
    { name: 'My Shop', value: 8000 },
    { name: 'Salary', value: 13000 }
  ];

  const assetsData = [
    { name: 'Gold', value: 15700, color: '#f59e0b' },
    { name: 'Stock', value: 22500, color: '#8b5cf6' },
    { name: 'Warehouse', value: 120000, color: '#10b981' },
    { name: 'Land', value: 135000, color: '#ec4899' }
  ];

  const spendingCategories = [
    { name: 'Housing', amount: 3452, icon: Home, color: 'from-purple-400 to-purple-600' },
    { name: 'Personal', amount: 2200, icon: Users, color: 'from-pink-400 to-pink-600' },
    { name: 'Transportation', amount: 2190, icon: Car, color: 'from-orange-400 to-orange-600' }
  ];

  const petExpenses = [
    { name: 'Routine Vet', amount: 140, icon: Heart },
    { name: 'Food', amount: 950, icon: Coffee },
    { name: 'Food Treats', amount: 231, icon: ShoppingBag },
    { name: 'Kennel Boarding', amount: 65, icon: Home }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-xl p-3 rounded-lg border border-slate-700/50 shadow-xl">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-400">{entry.name}:</span>
              <span className="text-white font-semibold">${entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <L>
      <Layout>
        <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 sm:gap-4 lg:gap-0 mb-4 sm:mb-6 lg:mb-8">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Personal Finance Tracker</p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1">Available Balance</h1>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  $14,822
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-6">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-initial px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-xl flex items-center justify-center gap-2 transition-all text-xs sm:text-sm">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button className="flex-1 sm:flex-initial px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-xl flex items-center justify-center gap-2 transition-all text-xs sm:text-sm">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Spreadsheet</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Sunday, February 5, 2023</span>
                  <span className="md:hidden">Feb 5, 2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
            {/* Net Worth Card */}
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <p className="text-white/90 text-xs sm:text-sm mb-1 sm:mb-2">Total Net Worth</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">$278,378</p>
                </div>
              </div>
            </div>

            {/* Spendings Card */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <p className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Spendings</p>
                <p className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">$9,228</p>
                <ResponsiveContainer width="100%" height={50}>
                  <AreaChart data={incomeExpenseData.slice(0, 6)}>
                    <Area type="monotone" dataKey="expenses" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income Card */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <p className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Income</p>
                <p className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">$24,050</p>
                <ResponsiveContainer width="100%" height={50}>
                  <AreaChart data={incomeExpenseData.slice(0, 6)}>
                    <Area type="monotone" dataKey="income" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spending Categories */}
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Spendings</p>
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {spendingCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br ${category.color} rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg`}>
                          <category.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <span className="text-white font-medium text-xs sm:text-sm lg:text-base">{category.name}</span>
                      </div>
                      <span className="text-white font-bold text-xs sm:text-sm lg:text-base">${category.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Income Source Chart */}
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <p className="text-white font-semibold mb-3 sm:mb-4 lg:mb-6 text-sm lg:text-base">Income Source</p>
                <div className="flex items-end justify-between gap-1 sm:gap-2 lg:gap-4">
                  {incomeSourceData.map((source, index) => (
                    <div key={index} className="flex-1">
                      <div className="text-center">
                        <div 
                          className={`${index === 3 ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' : 'bg-slate-700'} rounded-lg transition-all hover:opacity-80`}
                          style={{ height: `${Math.max((source.value / 13000) * 80, 20)}px` }}
                        ></div>
                        <p className="text-white font-bold mt-1 sm:mt-2 text-xs lg:text-base">${source.value.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs mt-1 truncate">{source.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Income & Expenses Chart */}
            <div className="sm:col-span-2 lg:col-span-5">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                  <p className="text-white font-semibold text-sm lg:text-base">Income & Expenses</p>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-slate-400">Max. Exp.</span>
                      <span className="text-orange-500 font-bold">$20,239</span>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      <span className="text-slate-400">Max. Inc.</span>
                      <span className="text-cyan-500 font-bold">$20,239</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={incomeExpenseData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="income" stroke="#06b6d4" fill="url(#incomeGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="#f97316" fill="url(#expenseGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assets Pie Chart */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <p className="text-white font-semibold mb-3 sm:mb-4 lg:mb-6 text-sm lg:text-base">Assets</p>
                <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie
                        data={assetsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  {assetsData.map((asset, index) => (
                    <div key={index}>
                      <p className="text-slate-400 text-xs lg:text-sm">{asset.name}</p>
                      <p className="text-white font-bold text-xs sm:text-sm lg:text-base">${asset.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Income Goal Progress */}
            <div className="sm:col-span-2 lg:col-span-5">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div>
                    <p className="text-cyan-400 text-xl sm:text-2xl lg:text-3xl font-bold">61%</p>
                    <p className="text-white font-semibold text-sm lg:text-base">Income Goal</p>
                    <p className="text-slate-400 text-xs lg:text-sm">Progress to month</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-white text-base sm:text-lg lg:text-2xl font-bold">$24,050 / 39,276</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 lg:h-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: '61%' }}>
                    <div className="h-full bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification */}
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-orange-500/50 h-full">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-xs sm:text-sm lg:text-base">Notification</p>
                      <p className="text-orange-400 text-xs lg:text-sm">3 Bills are past Due. Pay soon to avoid late fees.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Pet Expenses */}
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 h-full">
                <p className="text-white font-semibold mb-1 sm:mb-2 lg:mb-4 text-sm lg:text-base">Expenses for My Dogs and Cats</p>
                <p className="text-slate-400 text-xs mb-2 sm:mb-3 lg:mb-4">www.other-levels.com</p>
                <div className="space-y-2 lg:space-y-3">
                  {petExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                          <expense.icon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm sm:text-base lg:text-lg">{expense.amount}</p>
                          <p className="text-slate-400 text-xs lg:text-sm">{expense.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 lg:mt-4 flex justify-center">
                  <div className="w-32 h-20 sm:w-36 sm:h-24 bg-slate-700/30 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0.6, 1) infinite;
          }
        `}</style>
      </Layout>
    </L>
  );
};

export default Dashboard;