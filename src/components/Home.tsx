import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';

const BubbleImage = '/cute-bubble.svg';

const Home: React.FC = () => {
  const [bgBubbles, setBgBubbles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['bg-blue-400/20', 'bg-purple-400/20', 'bg-pink-400/20', 'bg-orange-400/20', 'bg-cyan-400/20'];
    const bubbles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 40,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * -20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setBgBubbles(bubbles);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#f4f8fc] flex items-center justify-center">
      
      {/* 1. DYNAMIC COLORFUL BACKGROUND BUBBLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {bgBubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: "110vh", x: `${b.x}vw` }}
            animate={{ 
              y: "-20vh",
              x: [`${b.x}vw`, `${b.x + 5}vw`, `${b.x - 5}vw`, `${b.x}vw`],
            }}
            transition={{ 
              duration: b.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: b.delay 
            }}
            className={cn("absolute rounded-full blur-2xl border border-white/40 shadow-xl", b.color)}
            style={{ width: b.size, height: b.size }}
          />
        ))}
        {/* Glow besar di sudut */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* KOLOM KIRI: TEKS & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8 lg:col-span-7 text-center lg:text-left"
        >
          <motion.div 
            whileHover={{ scale: 1.04 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md text-indigo-700 font-extrabold uppercase tracking-widest text-[11px] md:text-xs border border-indigo-100 shadow-sm"
          >
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            Digital Literacy Platform
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[98px] leading-[1.08] tracking-tight">
            <span className="font-display font-black text-[#031466] tracking-tight inline-block">
              Letupkan
            </span>{" "}
            <br className="hidden sm:block" />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 pr-3 inline-block drop-shadow-sm">
              Wawasanmu
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-sm">
            Platform interaktif untuk memahami cara kerja algoritma rekomendasi, memecahkan <strong className="font-extrabold text-slate-900">filter bubble</strong>, dan membangun nalar kritis bermedia sosial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5 pt-2">
            <Link to="/materi" className="w-full sm:w-auto group relative bg-slate-900 hover:bg-indigo-600 text-white text-base md:text-lg px-8 py-4 md:px-10 md:py-5 rounded-2xl font-extrabold shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden cursor-pointer">
              <span className="relative z-10 tracking-wide uppercase">Mulai Belajar</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link to="/tes" className="w-full sm:w-auto group bg-white/90 backdrop-blur-md text-slate-800 hover:text-indigo-600 text-base md:text-lg px-8 py-4 md:px-10 md:py-5 rounded-2xl font-extrabold border-2 border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <Sparkles size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide uppercase">Simulasi AI</span>
            </Link>
          </div>
        </motion.div>

        {/* KOLOM KANAN: MASCOT DENGAN FITUR ORBIT */}
        <div className="relative lg:col-span-5 flex items-center justify-center mt-12 lg:mt-0">
          <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-full flex items-center justify-center">
            
            {/* 1. Garis Orbit Luar */}
            <div className="absolute w-[110%] h-[110%] border-2 border-blue-200/40 rounded-full animate-[spin_15s_linear_infinite]" />
            
            {/* 2. Garis Orbit Dalam */}
            <div className="absolute w-[130%] h-[130%] border-2 border-dashed border-indigo-200/30 rounded-full animate-[spin_25s_linear_infinite_reverse]" />

            {/* Maskot Sentral */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-20 w-full"
            >
              <motion.img 
                src={BubbleImage}
                alt="OutBubble Mascot"
                className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]"
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* 3. Orbiting Badge: CERDAS (Berputar di lintasan) */}
            <motion.div 
              className="absolute z-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ width: '130%', height: '130%' }}
            >
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-br from-pink-400 to-rose-400 p-3 md:p-5 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl border-2 md:border-4 border-white font-black text-[12px] md:text-base whitespace-nowrap"
                animate={{ rotate: -360 }} // Counter-rotate agar teks tetap tegak
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                Cerdas!
              </motion.div>
            </motion.div>

            {/* 4. Orbiting Badge: KRITIS (Berputar berlawanan arah) */}
            <motion.div 
              className="absolute z-30"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ width: '100%', height: '100%' }}
            >
              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-br from-blue-400 to-cyan-400 p-3 md:p-5 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl border-2 md:border-4 border-white font-black text-[12px] md:text-base whitespace-nowrap"
                animate={{ rotate: 360 }} // Counter-rotate agar teks tetap tegak
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                Kritis!
              </motion.div>
            </motion.div>

            {/* Aura Cahaya Sentral */}
            <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-[100px] -z-10 scale-125 animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Home;