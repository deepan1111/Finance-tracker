// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const connectDB = require('./config/database');
// const errorHandler = require('./middleware/errorHandler');

// // Import routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const transactionRoutes = require('./routes/transactions');
// const budgetRoutes = require('./routes/budgets');

// const app = express();

// // Connect to database
// connectDB();

// // Security middleware
// app.use(helmet());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use('/api/', limiter);

// // CORS configuration
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// }));

// // Body parser middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/budgets', budgetRoutes);

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'OK', 
//     message: 'Finance Tracker API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // 404 handler - Fix the wildcard route
// app.use((req, res) => {
//   res.status(404).json({ 
//     success: false, 
//     message: 'Route not found' 
//   });
// });

// // Error handling middleware (must be last)
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 Finance Tracker API is live!`);
// });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis'); // Add Redis
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const dashboardRoutes = require('./routes/dashboard'); // ADD THIS LINE

const app = express();

// Connect to database and Redis
connectDB();
connectRedis(); // Add Redis connection

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - more specific limits
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const dashboardLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // More generous for dashboard as it needs frequent updates
  message: 'Too many dashboard requests, please wait a moment.',
});

app.use('/api/', generalLimiter);
app.use('/api/dashboard', dashboardLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes); // ADD THIS LINE

// Health check route with more details
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Finance Tracker API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Finance Tracker API is live!`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});