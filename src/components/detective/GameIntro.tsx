import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Target, 
  Flame, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { BubulMascot } from '../BubulMascot';

interface GameIntroProps {
  onStart: () => void;
}

export const GameIntro: React.FC<GameIntroProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="bg-gradient-to-b from-white via-indigo-50/40 to-cyan-50/30 rounded-[36px] border-2 border-indigo-100/90 shadow-2xl p-6 sm:p-12 relative overflow-hidden">
        
        {/* Background Decorative Blur Orbs */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* LEFT: Game Title, Bubul Mascot Guidance, and Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-indigo-200 text-[#031466] font-black text-xs uppercase tracking-wider shadow-2xs">
              <Sparkles size={14} className="text-cyan-600 animate-spin" />
              <span>Mini-Game Investigasi Digital SMA</span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-[#031466] tracking-tight leading-[1.1]">
                ALGORITHM DETECTIVE 🔎
              </h1>
              <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent italic">
                “Can you find out who is shaping the feed?”
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium pt-1">
                Selamat datang di laboratorium penyelidikan linimasa media sosial! Telusuri bagaimana aktivitas digital pengguna membentuk kurasi algoritma, kenali pola <em>filter bubble</em>, dan temukan cara memecahkan ruang gema dengan nalar kritis.
              </p>
            </div>

            {/* Bubul Mascot Speech Card */}
            <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-cyan-200 shadow-sm flex items-start gap-4">
              <BubulMascot size="lg" expression="sparkle" animate={true} />
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#031466]">Bubul</span>
                  <span className="text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded-full font-bold">Pemandu Detektif</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  "Halo Detektif! Kita akan menyelidiki 3 kasus linimasa nyata. Amati feed, periksa petunjuk tersembunyi, lalu tentukan keputusan terbaik untuk membongkar gelembung algoritma!"
                </p>
              </div>
            </div>

            {/* Action CTA & Info Pills */}
            <div className="pt-2 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#031466] via-indigo-700 to-blue-700 hover:from-indigo-900 hover:to-cyan-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-95"
              >
                <span>START INVESTIGATION</span>
                <ArrowRight size={22} className="animate-pulse" />
              </motion.button>

              <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                  <Layers size={14} className="text-indigo-600" />
                  3 Kasus Investigasi
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                  <Clock size={14} className="text-cyan-600" />
                  5–7 Menit Sesi
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                  <Target size={14} className="text-emerald-600" />
                  C4–C5 Critical Thinking
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT: Visual Smartphone Mockup Illustration with Algorithm Node and Magnifying Glass */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-[9/17] bg-slate-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-700/80 ring-8 ring-indigo-500/10">
              
              {/* Smartphone Camera Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
                <div className="w-2 h-2 bg-blue-900/60 rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-[34px] p-4 flex flex-col justify-between overflow-hidden relative border border-slate-800 text-white text-xs">
                
                {/* Header Mock */}
                <div className="pt-5 pb-3 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[10px]">
                      🔍
                    </div>
                    <span className="font-bold tracking-wide text-[11px] text-cyan-300">Feed Investigasi</span>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[9px] font-mono">
                    AI_NODE #402
                  </span>
                </div>

                {/* Floating Algorithm Graph Visualization */}
                <div className="my-auto space-y-3 relative">
                  
                  {/* Floating Magnifying Glass Icon */}
                  <motion.div
                    animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-3 -right-2 z-20 w-12 h-12 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/60"
                  >
                    <Search size={22} className="text-white" />
                  </motion.div>

                  {/* Recommendation Card 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/80 border border-cyan-500/40 rounded-xl p-2.5 shadow-sm space-y-1 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold">
                      <span>🏀 Basketball Spotlight</span>
                      <span className="text-slate-400 text-[9px]">98% Cocok</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium line-clamp-1">
                      Top 10 Trik Dribble Cepat & Akurat
                    </p>
                  </motion.div>

                  {/* Algorithm Neural Node Bridge */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="h-px w-10 bg-cyan-500/40" />
                    <div className="px-2.5 py-1 rounded-lg bg-indigo-600/30 border border-indigo-400/50 flex items-center gap-1.5 text-[9px] font-mono text-indigo-200">
                      <Cpu size={12} className="text-cyan-400 animate-pulse" />
                      <span>FILTER_ENGINE</span>
                    </div>
                    <div className="h-px w-10 bg-cyan-500/40" />
                  </div>

                  {/* Recommendation Card 2 with Translucent Bubble Indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-800/80 border border-indigo-500/40 rounded-xl p-2.5 shadow-sm space-y-1 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-cyan-400/5 border border-cyan-400/30 rounded-xl pointer-events-none animate-pulse" />
                    <div className="flex items-center gap-2 text-[10px] text-indigo-300 font-bold">
                      <span>📰 Ruang Gema Opini</span>
                      <span className="text-amber-400 text-[9px]">Filter Bubble</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium line-clamp-1">
                      Hanya Menampilkan Perspektif Sejenis
                    </p>
                  </motion.div>

                  {/* Bubble Visual Accent */}
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-300/40 text-center text-[10px] font-bold text-cyan-200"
                  >
                    🫧 Gelembung Algoritma Terdeteksi
                  </motion.div>

                </div>

                {/* Footer Micro Bar */}
                <div className="py-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
                  <span>OutBubble Engine</span>
                  <span className="text-emerald-400 font-bold">Sistem Siap</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GameIntro;
