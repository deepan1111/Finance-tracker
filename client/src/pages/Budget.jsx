import React from 'react';
import Layout from '../components/layout/Layout';

const Budget = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
            <p className="text-gray-600">Plan and track your spending limits</p>
          </div>
          <button className="btn-primary">
            Create Budget
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="card text-center py-12">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Budget management coming soon
          </h3>
          <p className="text-gray-600">
            This page will contain budget creation and tracking functionality.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Budget;