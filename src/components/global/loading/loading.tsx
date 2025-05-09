"use client"
import React from 'react';

const LoadingScreen = ({ message = "Loading..." }) => {
  // Creating a pastel green color palette
  const colorTheme = {
    primary: '#5CAB7D',
    primaryLight: '#7DCCA0',
    primaryLighter: '#A8E6C3',
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-50">
      <div className="w-16 h-16 mb-8 relative">
        {/* Three spinning circles animation */}
        <div 
          className="absolute inset-0 rounded-full animate-ping"
          style={{ 
            backgroundColor: colorTheme.primaryLighter,
            animationDuration: '1.5s',
            animationDelay: '0s',
            opacity: 0.7
          }}
        ></div>
        <div 
          className="absolute inset-2 rounded-full animate-ping"
          style={{ 
            backgroundColor: colorTheme.primaryLight,
            animationDuration: '1.5s',
            animationDelay: '0.2s',
            opacity: 0.8
          }}
        ></div>
        <div 
          className="absolute inset-4 rounded-full animate-ping"
          style={{ 
            backgroundColor: colorTheme.primary,
            animationDuration: '1.5s',
            animationDelay: '0.4s',
            opacity: 0.9
          }}
        ></div>
      </div>
      
      <div className="flex flex-col items-center">
        <p 
          className="text-xl font-medium mb-2"
          style={{ color: colorTheme.primary }}
        >
          {message}
        </p>
        
        {/* Loading bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full animate-pulse"
            style={{ 
              backgroundColor: colorTheme.primary,
              width: '100%'
            }}
          ></div>
        </div>
        
        <p className="text-gray-500 mt-2 text-sm">Just a moment...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;