import React from 'react';
import { motion } from 'framer-motion';

const NounDisplay = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative"
    >
      <div className="w-96 h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-nouns-red/10 to-nouns-blue/10 p-4">
        <div className="w-full h-full rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <iframe 
            title="noun 4521" 
            frameBorder="0" 
            allowFullScreen 
            mozallowfullscreen="true" 
            webkitallowfullscreen="true" 
            allow="autoplay; fullscreen; xr-spatial-tracking" 
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true" 
            web-share="true"
            src="https://sketchfab.com/models/1a8c89d943b94236aa5831b834392e97/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0"
            className="w-full h-full rounded-2xl"
          />
        </div>
      </div>
      
      {/* Enhanced floating particles with better positioning */}
      <motion.div
        animate={{ 
          x: [0, 30, 0],
          y: [0, -40, 0],
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 w-6 h-6 bg-nouns-red rounded-full shadow-lg"
      />
      <motion.div
        animate={{ 
          x: [0, -35, 0],
          y: [0, -25, 0],
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
        className="absolute -bottom-4 -left-4 w-5 h-5 bg-nouns-blue rounded-full shadow-lg"
      />
      <motion.div
        animate={{ 
          x: [0, 25, 0],
          y: [0, -50, 0],
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 3, ease: "easeInOut" }}
        className="absolute top-1/2 -right-8 w-4 h-4 bg-nouns-green rounded-full shadow-lg"
      />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-nouns-red/20 to-nouns-blue/20 animate-pulse pointer-events-none" />
    </motion.div>
  );
};

export default NounDisplay;