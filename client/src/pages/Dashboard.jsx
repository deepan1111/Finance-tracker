import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, CreditCard, DollarSign, Home, Car, ShoppingBag, Users, Calendar, Bell, Search, Settings, ChevronRight, AlertTriangle, PiggyBank, Target, Activity, Zap, Coffee, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const L = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Budget', href: '/budget' },
    { name: 'Reports', href: '/reports' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActiveRoute = (href) => location.pathname.startsWith(href);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center text-white font-bold text-xl">
              FinanceTracker
            </div>

            <nav className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hidden md:block">{user?.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
};

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = 5; // June

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-white font-bold">Other Level's</h2>
                <p className="text-slate-400 text-xs">Finance Tracker</p>
              </div>
            )}
          </div>
          
          <nav className="space-y-2">
            {months.map((month, index) => (
              <button
                key={month}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
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

        <div className="mt-auto p-6">
          <img src="/api/placeholder/120/120" alt="Decoration" className="w-full opacity-50" />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
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
              <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-400">{entry.name}:</span>
              <span className="text-white font-semibold">${entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <L>
      <Layout>
        <div className="min-h-screen p-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-slate-400 text-sm mb-2">Personal Finance Tracker</p>
                <h1 className="text-4xl font-bold text-white mb-1">Available Balance</h1>
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  $14,822
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-xl flex items-center gap-2 transition-all">
                    <Activity className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-xl flex items-center gap-2 transition-all">
                    <BarChart className="w-4 h-4" />
                    Spreadsheet
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Sunday, February 5, 2023</span>
                </div>

                {/* <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="/api/placeholder/48/48" alt="Profile" className="w-12 h-12 rounded-full border-2 border-cyan-500/50" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <p className="text-white/90 text-sm mb-2">Total Net Worth</p>
                  <p className="text-4xl font-bold text-white">$278,378</p>
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-2">Spendings</p>
                <p className="text-2xl font-bold text-white mb-4">$9,228</p>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={incomeExpenseData.slice(0, 6)}>
                    <Area type="monotone" dataKey="expenses" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-2">Income</p>
                <p className="text-2xl font-bold text-white mb-4">$24,050</p>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={incomeExpenseData.slice(0, 6)}>
                    <Area type="monotone" dataKey="income" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-4">Spendings</p>
                <div className="space-y-4">
                  {spendingCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <span className="text-white font-bold">${category.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <p className="text-white font-semibold mb-6">Income Source</p>
                <div className="flex items-end justify-between gap-4">
                  {incomeSourceData.map((source, index) => (
                    <div key={index} className="flex-1">
                      <div className="text-center">
                        <div 
                          className={`${index === 3 ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' : 'bg-slate-700'} rounded-lg transition-all hover:opacity-80`}
                          style={{ height: `${(source.value / 13000) * 120}px` }}
                        ></div>
                        <p className="text-white font-bold mt-2">${source.value.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs mt-1">{source.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-5">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-white font-semibold">Income & Expenses</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-slate-400 text-sm">Max. Expenses</span>
                      <span className="text-orange-500 font-bold">$20,239</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                      <span className="text-slate-400 text-sm">Max. Income</span>
                      <span className="text-cyan-500 font-bold">$20,239</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
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
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="income" stroke="#06b6d4" fill="url(#incomeGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="#f97316" fill="url(#expenseGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <p className="text-white font-semibold mb-6">Assets</p>
                <div className="flex justify-center mb-6">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie
                        data={assetsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
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
                <div className="grid grid-cols-2 gap-4">
                  {assetsData.map((asset, index) => (
                    <div key={index}>
                      <p className="text-slate-400 text-sm">{asset.name}</p>
                      <p className="text-white font-bold">${asset.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-5">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-cyan-400 text-3xl font-bold">61%</p>
                    <p className="text-white font-semibold">Income Goal</p>
                    <p className="text-slate-400 text-sm">Progress to month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-2xl font-bold">$24,050 / 39,276</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: '61%' }}>
                    <div className="h-full bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Notification</p>
                      <p className="text-orange-400">3 Bills are past Due. Pay soon to avoid late fees.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
                <p className="text-white font-semibold mb-4">Expenses for My Dogs and Cats</p>
                <p className="text-slate-400 text-xs mb-4">www.other-levels.com</p>
                <div className="space-y-3">
                  {petExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                          <expense.icon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{expense.amount}</p>
                          <p className="text-slate-400 text-sm">{expense.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <img src="/api/placeholder/150/100" alt="Pets" className="opacity-75" />
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
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </Layout>
    </L>
  );
};

export default Dashboard;
