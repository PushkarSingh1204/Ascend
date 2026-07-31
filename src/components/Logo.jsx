// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Logo.jsx
import React from 'react';

/**
 * Reusable Ascend Logo Component.
 * Renders the official purple-cyan gradient lightning bolt SVG icon and brand text.
 */
export default function Logo({ 
  className = '', 
  size = 32, 
  onlyIcon = false,
  animated = false
}) {
  const iconSvg = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={Math.round(size * 46 / 48)} 
      viewBox="0 0 48 46" 
      fill="none"
      className={`${animated ? 'hover:scale-110 transition-transform duration-300' : ''}`}
      aria-hidden="true"
    >
      <path 
        fill="url(#ascend-logo-grad-component)" 
        d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
      />
      <defs>
        <linearGradient id="ascend-logo-grad-component" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (onlyIcon) {
    return iconSvg;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#7C3AED]/20 to-[#22D3EE]/20 border border-[#7C3AED]/30 p-1.5 shadow-sm shadow-[#7C3AED]/20 shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {iconSvg}
      </div>
      <span className="text-base font-black tracking-widest text-foreground uppercase font-sans">
        ASCEND
      </span>
    </div>
  );
}
