import React from 'react';

const ProgressChart = () => {
  // A simple static progress chart that doesn't rely on external data
  return (
    <div className="bg-white p-4 rounded-xl">
      <h3 className="text-md font-medium text-gray-700 mb-4">Your Progress</h3>
      
      {/* Static progress display */}
      <div className="relative pt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
              In Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-indigo-600">
              65%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mt-2 text-xs flex rounded bg-indigo-200">
          <div 
            style={{ width: "65%" }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
          ></div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>You're making good progress! Keep going to reach your goals.</p>
      </div>
    </div>
  );
};

export default ProgressChart;