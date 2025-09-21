import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm();

  useEffect(() => setFocus('email'), [setFocus]);
  useEffect(() => () => error && clearError(), []);

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-700 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to your Finance Tracker account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm animate-shake">
            <svg
              className="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-6h2v4h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-200">
              Email Address
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              type="email"
              id="email"
              className={`w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
              } focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm`}
              placeholder="you@example.com"
              onChange={clearError}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-200">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border pr-10 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
                } focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm`}
                placeholder="Enter your password"
                onChange={clearError}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-gray-100"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500 focus:ring-2"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-primary-400 hover:underline text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Sign-up link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              Sign up now
            </Link>
          </p>
        </form>

        {/* Demo Credentials */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg text-blue-300 text-sm">
            <p><span className="font-semibold">Email:</span> demo@financetracker.com</p>
            <p><span className="font-semibold">Password:</span> demo123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
