import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Clock, 
  Users, 
  Cpu, 
  Sparkles, 
  ArrowDown, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { BubulMascot } from '../BubulMascot';

interface NodeAlgorithmDiagramProps {
  onContinue: () => void;
}

export const NodeAlgorithmDiagram: React.FC<NodeAlgorithmDiagramProps> = ({ onContinue }) => {
  return (
    <div className="w-full bg-gradient-to-b from-white to-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-xl space-y-6">
      
      {/* Title Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
          💡 Rangkuman Visual Pembelajaran
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#031466]">
          Bagaimana Feed Raka Terbentuk?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Hubungan kausal antara perilaku pengguna dengan kurasi algoritma rekomendasi.
        </p>
      </div>

      {/* Visual Workflow Flowchart */}
      <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl text-white space-y-6 relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* STEP 1: USER ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 text-center"
        >
          <div className="inline-block px-3 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 text-[10px] font-bold uppercase tracking-wider font-mono">
            INPUT: AKTIVITAS PENGGUNA (USER SIGNALS)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-rose-500/40 flex items-center justify-center gap-2 text-xs">
              <Heart size={16} className="text-rose-400 fill-rose-500" />
              <span className="font-semibold text-rose-200">Sering Like Basket</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/40 flex items-center justify-center gap-2 text-xs">
              <Clock size={16} className="text-amber-400" />
              <span className="font-semibold text-amber-200">Watch Time 100%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-indigo-500/40 flex items-center justify-center gap-2 text-xs">
              <Users size={16} className="text-indigo-400" />
              <span className="font-semibold text-indigo-200">Follow 48 Akun Basket</span>
            </div>
          </div>
        </motion.div>

        {/* CONNECTING PULSING ARROWS */}
        <div className="flex justify-center items-center gap-2 text-cyan-400">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-400 to-cyan-400" />
            <ArrowDown size={18} />
          </motion.div>
        </div>

        {/* STEP 2: RECOMMENDATION ALGORITHM ENGINE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/80 via-blue-900/80 to-cyan-900/80 border-2 border-cyan-400/60 shadow-lg text-center space-y-1.5"
        >
          <div className="flex items-center justify-center gap-2">
            <Cpu size={20} className="text-cyan-300 animate-spin" />
            <h4 className="font-black text-sm sm:text-base text-cyan-200 tracking-wide">
              🤖 ALGORITMA REKOMENDASI PEMBELAJARAN MESIN
            </h4>
          </div>
          <p className="text-[11px] text-slate-300 max-w-lg mx-auto leading-relaxed">
            Algoritma mendeteksi pola bahwa konten basket menghasilkan <strong>retensi & engagement tertinggi</strong> bagi Raka, sehingga memprioritaskan topik serupa.
          </p>
        </motion.div>

        {/* CONNECTING PULSING ARROWS */}
        <div className="flex justify-center items-center gap-2 text-cyan-400">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-emerald-400" />
            <ArrowDown size={18} />
          </motion.div>
        </div>

        {/* STEP 3: HIGHLY PERSONALIZED OUTPUT FEED */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-2 text-center"
        >
          <div className="inline-block px-3 py-0.5 rounded-md bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-[10px] font-bold uppercase tracking-wider font-mono">
            OUTPUT: FEED LINIMASA YANG TERKUSTOMISASI
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 py-2 flex-wrap">
            {["🏀 Basket 1", "🏀 Basket 2", "🏀 Basket 3", "🏀 Basket 4", "🏀 Basket 5"].map((item, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 shadow-xs">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bubul Synthesis Quote */}
      <div className="p-4 sm:p-5 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-start gap-4 shadow-sm">
        <BubulMascot size="md" expression="guide" animate={false} />
        <div className="space-y-1 text-xs sm:text-sm">
          <h5 className="font-black text-[#031466]">Catatan Detektif Bubul:</h5>
          <p className="text-slate-700 leading-relaxed font-medium">
            “Algoritma bukanlah peramal sakti. Ia belajar dari rekam jejak digital dan pola aktivitasmu untuk mempersonalisasi rekomendasi linimasa.”
          </p>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="pt-2 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#031466] hover:bg-indigo-900 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <span>Lanjutkan ke Case 02</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>

    </div>
  );
};

export default NodeAlgorithmDiagram;
