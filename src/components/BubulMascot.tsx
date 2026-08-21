import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export type BubulExpression = 'normal' | 'thinking' | 'happy' | 'guide' | 'sparkle';

interface BubulMascotProps {
  expression?: BubulExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const BubulMascot: React.FC<BubulMascotProps> = ({
  expression = 'normal',
  size = 'md',
  className,
  animate = true
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <motion.div
      animate={animate ? { y: [-2, 2, -2] } : undefined}
      transition={animate ? { repeat: Infinity, duration: 3.5, ease: 'easeInOut' } : undefined}
      className={cn("relative flex items-center justify-center select-none shrink-0", sizeMap[size], className)}
    >
      {/* Outer Glow Halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-400 to-indigo-500 rounded-full blur-[4px] opacity-70 animate-pulse pointer-events-none" />

      {/* Main Glassy Bubble Body */}
      <div className="w-full h-full bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-700 rounded-full border-2 border-white/80 shadow-[0_6px_20px_rgba(2,132,199,0.35)] flex items-center justify-center relative overflow-hidden">
        
        {/* Top-Left Glossy Highlight Reflection */}
        <div className="absolute top-1 left-2 w-2/5 h-2/5 bg-white/50 rounded-full blur-[1px] pointer-events-none transform -rotate-12" />
        
        {/* Bottom Secondary Glow Reflection */}
        <div className="absolute bottom-1 right-2 w-1/3 h-1/4 bg-cyan-200/40 rounded-full blur-[2px] pointer-events-none" />

        {/* Eyes & Facial Expression Layer */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pb-0.5">
          
          {/* Eyes Container */}
          <div className="flex items-center gap-1.5 sm:gap-2 justify-center mb-0.5">
            {expression === 'happy' || expression === 'sparkle' ? (
              // Happy / Sparkle Eyes (curved joyful eyes)
              <>
                <div className="w-2.5 h-2 border-b-2 border-r-2 border-[#031466] rounded-br-full rotate-45 transform" />
                <div className="w-2.5 h-2 border-b-2 border-l-2 border-[#031466] rounded-bl-full -rotate-45 transform" />
              </>
            ) : expression === 'thinking' ? (
              // Thinking Eyes (one eye curious, one normal)
              <>
                <div className="w-2.5 h-3 bg-[#031466] rounded-full relative flex items-start justify-end p-0.5">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <div className="w-2 h-2 bg-[#031466] rounded-full relative flex items-start justify-end p-0.5">
                  <div className="w-0.5 h-0.5 bg-white rounded-full" />
                </div>
              </>
            ) : (
              // Normal / Guide Eyes with glossy pupil reflections
              <>
                <div className="w-2.5 h-3 bg-[#031466] rounded-full relative flex items-start justify-end p-0.5">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <div className="w-2.5 h-3 bg-[#031466] rounded-full relative flex items-start justify-end p-0.5">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              </>
            )}
          </div>

          {/* Friendly Mouth */}
          {expression === 'happy' || expression === 'sparkle' ? (
            <div className="w-3.5 h-2 bg-[#031466] rounded-b-full overflow-hidden flex items-end justify-center">
              <div className="w-2 h-1 bg-pink-400 rounded-t-full" />
            </div>
          ) : expression === 'thinking' ? (
            <div className="w-2 h-0.5 bg-[#031466] rounded-full transform -rotate-6" />
          ) : (
            <div className="w-2.5 h-1 border-b-2 border-[#031466] rounded-b-full" />
          )}

          {/* Soft Cheeks Blushing */}
          <div className="absolute bottom-[28%] left-[16%] w-2 h-1 bg-pink-400/60 rounded-full blur-[0.5px]" />
          <div className="absolute bottom-[28%] right-[16%] w-2 h-1 bg-pink-400/60 rounded-full blur-[0.5px]" />
        </div>

        {/* Small floating sparkles ornament */}
        {expression === 'sparkle' && (
          <div className="absolute top-1 right-1 text-[9px] pointer-events-none animate-spin">
            ✨
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BubulMascot;
