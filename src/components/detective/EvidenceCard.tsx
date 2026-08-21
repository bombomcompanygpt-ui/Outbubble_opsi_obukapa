import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Clock, 
  Users, 
  FastForward, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';
import { EvidenceItem } from '../../types/detective';
import { cn } from '../../lib/utils';

interface EvidenceCardProps {
  evidence: EvidenceItem;
  isDiscovered: boolean;
  onInspect: (evidence: EvidenceItem) => void;
  index: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  isDiscovered,
  onInspect,
  index
}) => {
  const getIcon = () => {
    switch (evidence.iconType) {
      case 'like':
        return <Heart size={20} className="text-rose-500 fill-rose-500" />;
      case 'watch':
        return <Clock size={20} className="text-amber-500 fill-amber-400" />;
      case 'follow':
        return <Users size={20} className="text-indigo-600" />;
      case 'skip':
        return <FastForward size={20} className="text-cyan-600" />;
      case 'search':
        return <Search size={20} className="text-emerald-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getThemeBg = () => {
    switch (evidence.iconType) {
      case 'like':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'watch':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'follow':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'skip':
        return 'bg-cyan-50 border-cyan-200 text-cyan-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onInspect(evidence)}
      className={cn(
        "rounded-2xl p-4 border-2 transition-all cursor-pointer select-none relative overflow-hidden group shadow-sm",
        isDiscovered
          ? "bg-white border-indigo-400 shadow-md ring-2 ring-indigo-500/15"
          : "bg-slate-50/90 border-slate-200 hover:border-indigo-300 hover:bg-white"
      )}
    >
      {/* Active Discovered Glow Edge */}
      {isDiscovered && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3.5">
          {/* Icon Badge */}
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs shrink-0 transition-transform group-hover:scale-110",
            getThemeBg()
          )}>
            {getIcon()}
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                BUKTI 0{index + 1}
              </span>
              {isDiscovered && (
                <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                  <CheckCircle2 size={11} /> Terperiksa
                </span>
              )}
            </div>

            <h4 className="text-sm font-black text-[#031466] group-hover:text-indigo-700 transition-colors">
              {evidence.title}
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {evidence.subtitle}
            </p>
          </div>
        </div>

        {/* Action arrow indicator */}
        <div className="text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 pt-2">
          <ChevronRight size={18} />
        </div>
      </div>

      {/* Expanded detail box when discovered */}
      <AnimatePresence>
        {isDiscovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/60 leading-relaxed font-medium space-y-1"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-900 uppercase">
              <Sparkles size={12} className="text-cyan-600" />
              <span>Hasil Analisis Telemetri:</span>
            </div>
            <p>{evidence.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EvidenceCard;
