import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  href?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
}

export default function CTAButton({ 
  text, 
  onClick,
  href,
  size = 'large',
  variant = 'primary'
}: CTAButtonProps) {
  // Size classes
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-md hover:shadow-lg'
  };
  
  const buttonClasses = `
    inline-flex items-center justify-center
    ${sizeClasses[size]}
    font-medium rounded-md
    ${variantClasses[variant]}
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    cursor-pointer
  `;
  
  if (onClick) {
    return (
      <button onClick={onClick} className={buttonClasses}>
        {text}
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    );
  }
  
  return (
    <a href={href} className={buttonClasses}>
      {text}
      <ArrowRight className="ml-2 h-5 w-5" />
    </a>
  );
} 