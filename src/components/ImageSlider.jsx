// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\ImageSlider.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function ImageSlider({ beforeImage, afterImage, beforeLabel = "Week 1", afterLabel = "Current" }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 select-none cursor-ew-resize"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Before Image (Background) */}
      <img 
        src={beforeImage} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Before Label badge */}
      <span className="absolute bottom-4 left-4 z-10 text-xs font-bold tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 uppercase">
        {beforeLabel}
      </span>

      {/* After Image (Foreground, clipped) */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none pointer-events-none"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
        />
        
        {/* After Label badge */}
        <span className="absolute bottom-4 right-4 z-10 text-xs font-bold tracking-wider text-blue-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/25 uppercase">
          {afterLabel}
        </span>
      </div>

      {/* Divider Bar */}
      <div 
        className="absolute inset-y-0 z-10 w-0.5 bg-blue-500 cursor-ew-resize glow-primary"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Glowing Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
          <div className="flex gap-0.5">
            <span className="w-0.5 h-3 bg-white/70 rounded-full"></span>
            <span className="w-0.5 h-3 bg-white/70 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
