import React from 'react';
import Layout from '../components/layout/Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Financial insights and analytics</p>
          </div>
          <button className="btn-outline">
            Export Report
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="card text-center py-12">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Reports and analytics coming soon
          </h3>
          <p className="text-gray-600">
            This page will contain charts, graphs, and financial insights.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;