// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Logo.jsx
import React from 'react';

/**
 * Reusable Ascend Logo Component.
 * Supports inline vector icon rendering or full image asset rendering.
 */
export default function Logo({ 
  className = '', 
  size = 32, 
  onlyIcon = false,
  animated = false
}) {
  if (onlyIcon) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={Math.round(size * 46 / 48)} 
        viewBox="0 0 48 46" 
        fill="none"
        className={`${className} ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}`}
        aria-hidden="true"
      >
        <path 
          fill="url(#ascend-logo-grad)" 
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
        />
        <defs>
          <linearGradient id="ascend-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#863bff" />
            <stop offset="100%" stopColor="#4fbfff" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className={`rounded-xl flex items-center justify-center bg-gradient-to-tr from-violet-650 to-indigo-650 shadow-[0_8px_20px_rgba(134,59,255,0.15)] overflow-hidden`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img 
          src="/logo.png" 
          alt="Ascend Icon" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image asset fails to resolve
            e.target.style.display = 'none';
          }}
        />
      </div>
      <span className="text-base font-black tracking-widest text-foreground bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent uppercase font-sans">
        Ascend
      </span>
    </div>
  );
}
