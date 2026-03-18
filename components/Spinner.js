import React from 'react';

export default function Spinner({ size = '2rem', color = '#D4AF37', className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        style={{ 
          width: size, 
          height: size, 
          border: '3px solid rgba(212, 175, 55, 0.1)',
          borderTopColor: color,
          borderRadius: '50%'
        }}
        className="animate-spin"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
