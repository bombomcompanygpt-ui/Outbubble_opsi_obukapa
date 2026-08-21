import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  Target,
  Layers,
  Check
} from 'lucide-react';
import { QuestionOption, ActionCardItem } from '../../types/detective';
import { BubulMascot } from '../BubulMascot';
import { cn } from '../../lib/utils';

interface SingleQuestionProps {
  type: 'single';
  question: string;
  cognitiveLevel?: string;
  options: QuestionOption[];
  onAnswerSelected: (option: QuestionOption) => void;
  onNext: () => void;
  selectedOptionId: string | null;
  isAnswered: boolean;
  isCorrect: boolean;
  attempts?: number;
  onRetry?: () => void;
}

interface MultiActionProps {
  type: 'multi';
  title: string;
  subtitle: string;
  actionCards: ActionCardItem[];
  selectedActionIds: string[];
  onToggleAction: (id: string) => void;
  onSubmitActions: () => void;
  onNext: () => void;
  isEvaluated: boolean;
  isCorrect: boolean;
}

export type InvestigationQuestionCardProps = SingleQuestionProps | MultiActionProps;

export const InvestigationQuestionCard: React.FC<InvestigationQuestionCardProps> = (props) => {
  if (props.type === 'single') {
    const {
      question,
      cognitiveLevel = "C4 Analisis",
      options,
      onAnswerSelected,
      onNext,
      selectedOptionId,
      isAnswered,
      isCorrect,
      attempts = 0,
      onRetry
    } = props;

    const selectedOption = options.find((o) => o.id === selectedOptionId);

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-xl space-y-6 text-left relative overflow-hidden">
        
        {/* Header Question */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded-full uppercase tracking-wider border border-indigo-200/60">
              🎯 {cognitiveLevel}
            </span>
            {isAnswered && (
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5",
                isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
              )}>
                {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {isCorrect ? "Analisis Tepat (+20 Skor)" : "Perlu Koreksi"}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-[#031466] leading-snug">
            {question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            let buttonStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50/70 hover:border-indigo-300";

            if (isAnswered) {
              if (opt.isCorrect) {
                buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400/30";
              } else if (isSelected && !opt.isCorrect) {
                buttonStyle = "bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30";
              } else {
                buttonStyle = "bg-slate-50/60 border-slate-200 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => onAnswerSelected(opt)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default select-none",
                  buttonStyle
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border",
                  isSelected
                    ? "bg-indigo-700 text-white border-indigo-700"
                    : "bg-white text-slate-600 border-slate-300"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-xs sm:text-sm leading-relaxed font-medium pt-0.5">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        <AnimatePresence>
          {isAnswered && selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "p-4 sm:p-5 rounded-2xl border-2 flex items-start gap-4 shadow-sm",
                isCorrect
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                  : "bg-amber-50/80 border-amber-300 text-amber-900"
              )}
            >
              <BubulMascot
                size="md"
                expression={isCorrect ? "sparkle" : "thinking"}
                animate={true}
              />
              <div className="space-y-1 text-xs sm:text-sm">
                <h5 className="font-black">
                  {isCorrect ? "🔎 Investigasi Cerdas!" : "🧐 Periksa Lebih Teliti..."}
                </h5>
                <p className="leading-relaxed font-medium">
                  {selectedOption.feedback}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bottom Bar */}
        {isAnswered && (
          <div className="flex items-center justify-between gap-3 pt-2">
            {!isCorrect && attempts < 1 && onRetry && (
              <button
                onClick={onRetry}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw size={15} />
                <span>Coba 1x Lagi</span>
              </button>
            )}

            <button
              onClick={onNext}
              className="ml-auto px-6 py-3.5 bg-[#031466] hover:bg-indigo-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Lanjutkan Investigasi</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    );
  }

  // MULTI ACTION (CASE 03)
  const {
    title,
    subtitle,
    actionCards,
    selectedActionIds,
    onToggleAction,
    onSubmitActions,
    onNext,
    isEvaluated,
    isCorrect
  } = props;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-xl space-y-6 text-left relative overflow-hidden">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-3 py-1 bg-cyan-50 text-cyan-800 font-extrabold text-[11px] rounded-full uppercase tracking-wider border border-cyan-200">
            ⚡ Multi-Select Challenge
          </span>
          <span className="text-xs font-bold text-slate-500">
            Pilih 2 Tindakan Terbaik
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-[#031466] leading-snug">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {actionCards.map((act) => {
          const isSelected = selectedActionIds.includes(act.id);
          let borderStyle = isSelected
            ? "border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20"
            : "border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300";

          if (isEvaluated) {
            if (act.isCorrect) {
              borderStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400/30";
            } else if (isSelected && !act.isCorrect) {
              borderStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/30";
            } else {
              borderStyle = "border-slate-200 bg-slate-50/60 opacity-50";
            }
          }

          return (
            <motion.div
              key={act.id}
              whileHover={!isEvaluated ? { scale: 1.02, y: -2 } : undefined}
              whileTap={!isEvaluated ? { scale: 0.98 } : undefined}
              onClick={() => !isEvaluated && onToggleAction(act.id)}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-2 relative overflow-hidden",
                borderStyle
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{act.icon}</span>
                  <span className="font-mono font-black text-xs text-indigo-900 uppercase">
                    {act.label}
                  </span>
                </div>

                <div className={cn(
                  "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-indigo-700 border-indigo-700 text-white"
                    : "bg-white border-slate-300"
                )}>
                  {isSelected && <Check size={14} />}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {act.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Evaluate Feedback */}
      <AnimatePresence>
        {isEvaluated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              "p-4 sm:p-5 rounded-2xl border-2 flex items-start gap-4 shadow-sm",
              isCorrect
                ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                : "bg-amber-50/80 border-amber-300 text-amber-900"
            )}
          >
            <BubulMascot
              size="md"
              expression={isCorrect ? "sparkle" : "thinking"}
              animate={true}
            />
            <div className="space-y-1 text-xs sm:text-sm">
              <h5 className="font-black">
                {isCorrect ? "🎉 Pilihan Sempurna!" : "🧐 Evaluasi Pilihanmu..."}
              </h5>
              <p className="leading-relaxed font-medium">
                {isCorrect
                  ? "Tindakan B dan D secara aktif melatih algoritma untuk menyajikan keberagaman topik, sekaligus melatih nalar kritis sebelum mempercayai informasi."
                  : "Mencari dari berbagai sumber (B) dan membandingkan sudut pandang (D) adalah kombinasi paling efektif untuk memecah gelembung informasi."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Button */}
      <div className="pt-2 flex justify-end">
        {!isEvaluated ? (
          <button
            disabled={selectedActionIds.length === 0}
            onClick={onSubmitActions}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#031466] to-indigo-800 hover:from-indigo-950 hover:to-indigo-900 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Terapkan Keputusan ({selectedActionIds.length}/2)</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#031466] hover:bg-indigo-900 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Lihat Transformasi Feed</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>

    </div>
  );
};

export default InvestigationQuestionCard;
