import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <svg
            className="h-32 w-32 text-gray-300 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H2.05A7.963 7.963 0 014.636 4.636L7.757 7.757A5.978 5.978 0 0012 6c1.657 0 3.157.672 4.243 1.757L19.364 4.636A7.963 7.963 0 0121.95 12H20a7.962 7.962 0 01-2.05 5.364l-3.122-3.121A5.978 5.978 0 0012 18a5.978 5.978 0 00-2.828-.693L6.05 20.429A7.963 7.963 0 014.636 19.364L7.757 16.243A5.978 5.978 0 006 12c0-1.657.672-3.157 1.757-4.243L4.636 4.636z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary px-6 py-3"
          >
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="btn-outline px-6 py-3"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            If you believe this is an error, please{' '}
            <a
              href="mailto:support@financetracker.com"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;