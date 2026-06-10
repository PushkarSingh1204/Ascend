// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\SkeletonLoader.jsx
import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'list') {
    return (
      <div className="space-y-3 w-full">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-900 bg-neutral-950/40 animate-pulse">
            <div className="w-5 h-5 rounded bg-neutral-800"></div>
            <div className="flex-1 space-y-1.5">
              <div className="w-1/2 h-3.5 bg-neutral-800 rounded"></div>
              <div className="w-1/4 h-2.5 bg-neutral-900 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'analysis') {
    return (
      <div className="glassmorphism p-6 rounded-2xl border border-neutral-800/80 w-full animate-pulse flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-800"></div>
        <div className="w-2/3 h-4 bg-neutral-800 rounded"></div>
        <div className="w-1/3 h-3 bg-neutral-900 rounded"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map((_, i) => (
        <div key={i} className="glassmorphism p-6 rounded-2xl border border-neutral-800/80 animate-pulse space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-neutral-800"></div>
            <div className="w-16 h-4 bg-neutral-800 rounded"></div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="w-3/4 h-4 bg-neutral-800 rounded"></div>
            <div className="w-5/6 h-3 bg-neutral-900 rounded"></div>
            <div className="w-1/2 h-3 bg-neutral-900 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
