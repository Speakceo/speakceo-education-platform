import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'top' | 'right' | 'bottom';
  color?: 'indigo' | 'green' | 'purple' | 'blue';
  className?: string;
  tooltip?: string;
  animate?: boolean;
}

export default function ProgressBar({
  progress,
  size = 'md',
  showLabel = true,
  labelPosition = 'right',
  color = 'indigo',
  className = '',
  tooltip,
  animate = true
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Determine height based on size
  const heightClass = 
    size === 'sm' ? 'h-1.5' : 
    size === 'md' ? 'h-2.5' : 
    'h-4';
  
  // Determine color gradient
  const colorGradient = 
    color === 'indigo' ? 'from-indigo-600 to-purple-600' :
    color === 'green' ? 'from-green-500 to-emerald-500' :
    color === 'purple' ? 'from-purple-600 to-pink-600' :
    'from-blue-600 to-indigo-600';
  
  // Generate unique ID for tooltip
  const tooltipId = `progress-tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center ${className}`}>
      {showLabel && labelPosition === 'top' && (
        <div className="mb-1 text-xs font-medium text-gray-700">
          {normalizedProgress}%
        </div>
      )}
      
      <div 
        className={`w-full bg-gray-200 rounded-full ${heightClass} ${showLabel && labelPosition === 'top' ? 'mt-1' : ''} ${showLabel && labelPosition === 'bottom' ? 'mb-1' : ''}`}
        data-tooltip-id={tooltip ? tooltipId : undefined}
        data-tooltip-content={tooltip}
      >
        <div 
          className={`${heightClass} rounded-full bg-gradient-to-r ${colorGradient} ${animate ? 'transition-all duration-1000 ease-out' : ''}`}
          style={{ width: `${normalizedProgress}%` }}
        ></div>
        {tooltip && <Tooltip id={tooltipId} />}
      </div>
      
      {showLabel && labelPosition === 'right' && (
        <span className="ml-2 text-xs font-medium text-gray-700">
          {normalizedProgress}%
        </span>
      )}
      
      {showLabel && labelPosition === 'bottom' && (
        <div className="mt-1 text-xs font-medium text-gray-700">
          {normalizedProgress}%
        </div>
      )}
    </div>
  );
}