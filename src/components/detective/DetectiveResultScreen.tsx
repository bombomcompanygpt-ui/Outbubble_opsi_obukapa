import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  Cpu, 
  Search, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Award,
  Smile,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { BubulMascot } from '../BubulMascot';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

interface DetectiveResultScreenProps {
  score: number;
  algorithmAwareness: number;
  bubbleDetection: number;
  infoEvaluation: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const DetectiveResultScreen: React.FC<DetectiveResultScreenProps> = ({
  score,
  algorithmAwareness,
  bubbleDetection,
  infoEvaluation,
  onPlayAgain,
  onBackToMenu
}) => {
  const { user, addXP, addReflection, updateBadge } = useStore();
  const [reflectionText, setReflectionText] = useState('');
  const [moodRating, setMoodRating] = useState(4);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Detective title evaluation based on score
  const getDetectiveProfile = () => {
    if (score >= 80) {
      return {
        title: "Detective Profile: Master Bubble Breaker",
        badgeIcon: "🫧",
        color: "from-cyan-500 to-indigo-700",
        summary: "Luar biasa! Kamu sangat tajam dalam mengidentifikasi bagaimana algoritma bekerja, mendeteksi ruang gema (echo chamber), serta mengevaluasi informasi secara berimbang dan kritis."
      };
    }
    return {
      title: "Detective Profile: Curious Investigator",
      badgeIcon: "🔎",
      color: "from-blue-500 to-indigo-600",
      summary: "Kerja bagus! Kamu sudah memahami dasar bagaimana perilaku pengguna membentuk rekomendasi linimasa. Terus latih kebiasaan membandingkan berbagai perspektif sebelum menarik kesimpulan."
    };
  };

  const profile = getDetectiveProfile();

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    // 1. Add Reflection to Zustand Store
    addReflection({
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      question: "Setelah bermain Algorithm Detective, apa satu hal konkret yang akan kamu lakukan secara berbeda saat menggunakan media sosial?",
      answer: reflectionText.trim(),
      moodLevel: moodRating,
      topic: 'Algorithm Detective',
      source: 'Game Investigasi',
      userId: user?.id || 'guest',
      createdAt: Date.now()
    });

    // 2. Award XP & Badges
    addXP(60);
    updateBadge('bubble-breaker', 1);

    setIsSaved(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 bg-emerald-900 text-white rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-emerald-300" />
            <span className="text-xs sm:text-sm font-bold">
              Reflection saved to your Reflection Book ✓ (+60 XP)
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HERO RESULT CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[36px] p-6 sm:p-10 border-2 border-indigo-100 shadow-2xl space-y-8 relative overflow-hidden text-center"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-indigo-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
            <Trophy size={16} className="text-amber-500 fill-amber-400" />
            <span>Misi Selesai</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#031466] tracking-tight">
            🏆 INVESTIGATION COMPLETE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
            Kamu telah menuntaskan penyelidikan 3 kasus kurasi algoritma media sosial.
          </p>
        </div>

        {/* Big Score Gauge + Badge Profile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 pt-2">
          
          {/* Circular Total Score */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200/80">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#031466"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-black text-[#031466] leading-none">
                  {score}
                </span>
                <span className="text-[10px] font-black uppercase text-slate-400">
                  / 100 Skor
                </span>
              </div>
            </div>
            <span className="mt-3 text-xs font-black text-slate-700">
              Critical Thinking Score
            </span>
          </div>

          {/* Profile Badge & Feedback */}
          <div className="md:col-span-7 space-y-4 text-left p-6 bg-gradient-to-br from-indigo-50/70 to-cyan-50/50 rounded-3xl border border-indigo-200/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#031466] to-indigo-700 flex items-center justify-center text-2xl shadow-md">
                {profile.badgeIcon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider block">
                  Peringkat Analis Digital
                </span>
                <h4 className="text-base sm:text-lg font-black text-[#031466]">
                  {profile.title}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {profile.summary}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
              <Sparkles size={16} className="text-amber-500 fill-amber-400 shrink-0" />
              <span>Hadiah Bonus: +150 XP Ditambahkan ke Akun Siswa!</span>
            </div>
          </div>

        </div>

        {/* 3 DIMENSION COMPETENCY BREAKDOWN */}
        <div className="space-y-3 pt-4 text-left relative z-10">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Aspek Evaluasi Nalar Kritis
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Aspect 1: Algorithm Awareness */}
            <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <Cpu size={16} className="text-indigo-600" />
                  Algorithm Awareness
                </span>
                <span className="text-indigo-700">{algorithmAwareness}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${algorithmAwareness}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Kemampuan memetakan pengaruh klik, like, dan watch time terhadap kurasi.
              </p>
            </div>

            {/* Aspect 2: Bubble Detection */}
            <div className="p-4 bg-white rounded-2xl border border-cyan-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="text-base leading-none">🫧</span>
                  Bubble Detection
                </span>
                <span className="text-cyan-700">{bubbleDetection}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bubbleDetection}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-full bg-cyan-600 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Kepekaan menyadari penyempitan sudut pandang dan informasi yang hilang.
              </p>
            </div>

            {/* Aspect 3: Info Evaluation */}
            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <Search size={16} className="text-emerald-600" />
                  Info Evaluation
                </span>
                <span className="text-emerald-700">{infoEvaluation}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${infoEvaluation}%` }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-full bg-emerald-600 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Keterampilan verifikasi silang sebelum mempercayai & membagikan konten.
              </p>
            </div>

          </div>
        </div>

      </motion.div>

      {/* REFLECTION SECTION DENGAN BUBUL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-[36px] p-6 sm:p-10 border-2 border-cyan-100 shadow-xl space-y-6 text-left"
      >
        <div className="flex items-start gap-4">
          <BubulMascot size="lg" expression="happy" animate={true} />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                Jurnal Refleksi Mandiri
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#031466]">
              Refleksi Bersama Bubul 🫧
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              “Setelah menyelesaikan kasus Algorithm Detective, apa satu hal konkret yang akan kamu lakukan secara berbeda saat berselancar di media sosial?”
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveReflection} className="space-y-4">
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            disabled={isSaved}
            rows={4}
            placeholder="Contoh: Saya akan lebih sadar saat melakukan like/follow, aktif mencari berita dari sumber kredibel dengan sudut pandang berbeda, dan tidak mudah menyebarkan informasi tanpa cek silang..."
            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs sm:text-sm text-slate-800 placeholder-slate-400 resize-none transition-all outline-hidden disabled:bg-slate-50 disabled:text-slate-500"
          />

          {/* Mood Level Rating */}
          <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Smile size={16} className="text-indigo-600" />
              <span>Tingkat Ketenangan Nalar:</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={isSaved}
                  onClick={() => setMoodRating(lvl)}
                  className={cn(
                    "w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer",
                    moodRating === lvl
                      ? "bg-indigo-700 text-white shadow-md scale-105"
                      : "bg-white text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 font-medium">
              Jawaban otomatis disimpan ke <strong>Buku Refleksi & Status Saya</strong>.
            </div>

            <button
              type="submit"
              disabled={!reflectionText.trim() || isSaved}
              className={cn(
                "px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95",
                isSaved
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-[#031466] hover:bg-indigo-900 text-white disabled:opacity-50"
              )}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Tersimpan di Buku Refleksi ✓</span>
                </>
              ) : (
                <>
                  <BookOpen size={16} />
                  <span>SAVE TO MY REFLECTION (+60 XP)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <RotateCcw size={16} />
          <span>Mainkan Ulang Investigasi</span>
        </button>

        <button
          onClick={onBackToMenu}
          className="px-8 py-3.5 bg-[#031466] hover:bg-indigo-900 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <span>Kembali ke OutBubble</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
};

export default DetectiveResultScreen;
