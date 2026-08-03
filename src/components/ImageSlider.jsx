// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\ImageSlider.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

export default function ImageSlider({ 
  beforeImage = '', 
  afterImage = '', 
  beforeLabel = "Week 1", 
  afterLabel = "Current" 
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();

    const resizeObserver = new ResizeObserver(() => updateWidth());
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

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
    if (e.touches && e.touches.length > 0) {
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

  if (!beforeImage || !afterImage) {
    return (
      <div className="w-full aspect-square md:aspect-[4/3] rounded-2xl border border-border bg-card flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-muted-foreground">
          <Camera size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground">Select Two Photos to Compare</h4>
          <p className="text-xs text-muted-foreground">Choose baseline and current progress photos from your history dropdowns.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card select-none cursor-ew-resize shadow-xl"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Before Image (Background) */}
      <img 
        src={beforeImage} 
        alt={beforeLabel || "Before photo"} 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          console.warn("[ImageSlider] Failed to load beforeImage:", beforeImage);
          e.target.src = '/looksmaxing_before.jpg';
        }}
      />
      
      {/* Before Label badge */}
      <span className="absolute bottom-4 left-4 z-10 text-xs font-extrabold tracking-wider text-foreground bg-background/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border uppercase shadow-md">
        {beforeLabel}
      </span>

      {/* After Image (Foreground, clipped) */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt={afterLabel || "After photo"} 
          className="absolute inset-y-0 left-0 h-full object-cover max-w-none pointer-events-none"
          style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
          onError={(e) => {
            console.warn("[ImageSlider] Failed to load afterImage:", afterImage);
            e.target.src = '/looksmaxing_after.jpg';
          }}
        />
        
        {/* After Label badge */}
        <span className="absolute bottom-4 right-4 z-10 text-xs font-extrabold tracking-wider text-accent bg-background/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-accent/30 uppercase shadow-md">
          {afterLabel}
        </span>
      </div>

      {/* Divider Bar */}
      <div 
        className="absolute inset-y-0 z-10 w-0.5 bg-primary cursor-ew-resize shadow-[0_0_15px_rgba(124,58,237,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Glowing Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white shadow-xl shadow-primary/40">
          <div className="flex gap-0.5">
            <span className="w-0.5 h-3 bg-white/80 rounded-full"></span>
            <span className="w-0.5 h-3 bg-white/80 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
