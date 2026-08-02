import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Preloader({ label = "Ascending God..." }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="preloader-container"
    >
      {/* Official Ascend Brand Logo */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30">
        <Logo size={72} showText={true} />
      </div>

      {/* Background Clouds */}
      <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="cloud cloud4"></div>
        <div className="cloud cloud5"></div>
      </div>

      {/* Speeder Character */}
      <div className="loader">
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="base">
          <span></span>
          <div className="face"></div>
        </div>
      </div>

      {/* Long Speed Fazers */}
      <div className="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Label Badge */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 border border-border backdrop-blur-md text-xs font-bold text-foreground tracking-wider uppercase shadow-xl">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>{label}</span>
      </div>
    </motion.div>
  );
}
