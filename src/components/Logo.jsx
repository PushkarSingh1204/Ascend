// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Logo.jsx
import React from 'react';

/**
 * Reusable Official Ascend Logo Component.
 * Standardizes branding across the entire application UI using the official
 * Ascend logo asset (/ascend.png) identical to the browser tab favicon.
 */
export default function Logo({ 
  className = '', 
  size = 36, 
  showText = true,
  onlyIcon = false,
  animated = false
}) {
  const logoImage = (
    <img 
      src="/ascend.png" 
      alt="Ascend Official Logo" 
      style={{ width: `${size}px`, height: `${size}px` }} 
      className={`object-contain shrink-0 ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
    />
  );

  if (onlyIcon || !showText) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {logoImage}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {logoImage}
      <span className="text-base font-black tracking-widest text-foreground uppercase font-sans whitespace-nowrap">
        ASCEND GOD
      </span>
    </div>
  );
}
