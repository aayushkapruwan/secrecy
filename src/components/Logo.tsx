import React from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', showIcon = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {showIcon && (
        <div className="relative">
          <div className={`bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 ${iconSizes[size]}`}>
            <Eye className="w-full h-full text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      )}
      <div className="flex flex-col">
        <span className={`font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent group-hover:from-purple-800 group-hover:to-purple-600 transition-all duration-300 ${sizeClasses[size]}`}>
          secrecy
        </span>
        {size === 'lg' && (
          <span className="text-xs text-purple-600 font-medium tracking-wider uppercase">
            Anonymous Messaging
          </span>
        )}
      </div>
    </Link>
  );
}