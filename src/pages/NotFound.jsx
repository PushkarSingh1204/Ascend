// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\NotFound.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center space-y-8 max-w-md w-full"
      >
        {/* Retro TV Screen Glitch 404 Component */}
        <div className="tv-container relative group">
          <div className="tv-screen">
            <div className="static"></div>
            <div className="error-text">404 ERROR</div>
          </div>
          <div className="tv-stand"></div>
        </div>

        {/* Text Messaging */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider">
            <AlertTriangle size={14} />
            <span>Signal Lost</span>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Page Not Found
          </h1>
          
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            The page or biometric route you are attempting to access does not exist or has been relocated.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <button 
            onClick={() => navigate(-1)}
            className="btn-secondary-v2 w-full sm:w-1/2 justify-center"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary-v2 w-full sm:w-1/2 justify-center"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
