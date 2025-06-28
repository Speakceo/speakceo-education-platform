import React from 'react';

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center p-6">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">SpeakCEO</h1>
      <p className="text-gray-600">Loading your entrepreneurial journey...</p>
    </div>
  </div>
);

export default LoadingFallback; 