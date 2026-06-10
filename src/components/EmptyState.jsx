// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\EmptyState.jsx
import React from 'react';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction 
}) {
  return (
    <div className="glassmorphism p-8 rounded-2xl text-center border border-neutral-900/60 max-w-md mx-auto flex flex-col items-center justify-center space-y-4 shadow-xl">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex items-center justify-center text-neutral-400">
          <Icon size={20} className="stroke-[1.5]" />
        </div>
      )}
      
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
        <p className="text-xs text-neutral-500 max-w-xs leading-normal">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-md shadow-blue-500/10"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
