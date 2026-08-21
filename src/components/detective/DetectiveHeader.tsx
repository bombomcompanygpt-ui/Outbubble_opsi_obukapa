import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Compass
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { DetectivePhase } from '../../types/detective';

interface DetectiveHeaderProps {
  phase: DetectivePhase;
  caseNumber: number; // 1, 2, 3
  totalCases?: number;
  score: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExit: () => void;
}

export const DetectiveHeader: React.FC<DetectiveHeaderProps> = ({
  phase,
  caseNumber,
  totalCases = 3,
  score,
  soundEnabled,
  onToggleSound,
  onExit
}) => {
  const getProgressPercentage = () => {
    if (phase === 'intro') return 0;
    if (phase === 'case1') return 33;
    if (phase === 'case2') return 66;
    if (phase === 'case3' || phase === 'final_eval') return 90;
    if (phase === 'result') return 100;
    return 0;
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-indigo-100/80 sticky top-0 z-40 px-4 sm:px-6 py-3.5 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-indigo-900 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="Kembali ke OutBubble"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Shield size={16} />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-[#031466] flex items-center gap-1 leading-tight">
                Algorithm Detective <span className="text-cyan-600 font-extrabold text-[11px] hidden sm:inline">• OutBubble</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold hidden md:block">
                Investigasi Digital & Nalar Kritis Algoritma
              </p>
            </div>
          </div>
        </div>

        {/* Center: Case Dots & Progress Indicator */}
        {phase !== 'intro' && phase !== 'result' && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#031466]">
                CASE 0{caseNumber} / 0{totalCases}
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    animate={{
                      scale: step === caseNumber ? 1.25 : 1,
                      backgroundColor: step <= caseNumber ? '#031466' : '#cbd5e1'
                    }}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      step <= caseNumber ? "shadow-xs" : "bg-slate-300"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-28 sm:w-36 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-[#031466] rounded-full"
              />
            </div>
          </div>
        )}

        {/* Right: Score Pill & Sound Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200/80 rounded-xl flex items-center gap-1.5 text-xs font-black text-[#031466] shadow-2xs">
            <Sparkles size={14} className="text-amber-500 fill-amber-400" />
            <span>Skor: <strong className="text-indigo-700">{score}</strong></span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs active:scale-95"
            title={soundEnabled ? "Matikan Suara Efek" : "Nyalakan Suara Efek"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

      </div>
    </header>
  );
};

export default DetectiveHeader;
