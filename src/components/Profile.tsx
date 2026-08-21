import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Book, ChevronLeft, ChevronRight, Award, Star, Zap,
  History, X, Calendar, Trophy, MousePointer2,
  ClipboardCheck, Rocket, MessageSquare, PenTool,
  Gamepad2, Sparkles, ArrowRight, Dices, CheckCircle2,
  TrendingUp, BarChart3, ShieldCheck, Flame, Layers,
  Compass, Lock, Unlock, PlayCircle, ExternalLink
} from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

const AVATAR_SEEDS = [
  'Felix', 'Aria', 'Mason', 'Zoe', 'Leo', 'Maya', 'Brian', 'Caleb', 'Alexander', 'Sophia', 'Lucas', 'Oliver'
];

const EMOJIS = [
  "😀","😊","😍","😗","😚","🤗","🫡","😑","😶‍🌫️","😁","😃","😆","😋","😘","😙","☺️","🤩","🤨","😶","😄","😉","😎","🥰","🙂","😏","😮","😯","🥱","😜","😲","😤","😇","🥸","🤠","🙂‍↕️","🤫","🤭","🧐","🫣","🫢","🤓"
];

type StatusTab = 'level' | 'prestasi' | 'liverank' | 'ringkasan' | 'journal';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, reflections, updateProfile, topics, quizResults, rerollGuestUsername, resetAllData } = useStore();
  const [activeTab, setActiveTab] = useState<StatusTab>('level');
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isRerolling, setIsRerolling] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'progress'>('all');

  // --- LOGIKA GAME BUBUL LEADERBOARD SYNC (Hanya pengguna asli) ---
  const [userGameRank, setUserGameRank] = useState<{
    rank: number | null;
    highScore: number;
    mode: string;
    totalPlayers: number;
  }>({
    rank: null,
    highScore: 0,
    mode: '-',
    totalPlayers: 0,
  });

  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newNameInput, setNewNameInput] = useState('');

  useEffect(() => {
    if (!user) return;

    const getLocalLb = () => {
      try {
        const stored = localStorage.getItem("outbubble_game_lb");
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed)
          ? parsed.filter((item: any) => item && item.userId && !item.userId.startsWith('seed-'))
          : [];
      } catch {
        return [];
      }
    };

    const calculateUserRank = (firestoreList: any[]) => {
      const localList = getLocalLb();
      const map = new Map<string, any>();

      // 1. Add local real entries
      localList.forEach((item: any) => {
        if (!item || (item.userId && item.userId.startsWith('seed-'))) return;
        const key = `${item.userId || item.name}-${item.mode}`;
        const existing = map.get(key);
        if (!existing || item.score >= existing.score) {
          map.set(key, item);
        }
      });

      // 2. Add Firestore real entries
      firestoreList.forEach((item: any) => {
        if (!item || (item.userId && item.userId.startsWith('seed-'))) return;
        const key = `${item.userId || item.name}-${item.mode}`;
        const existing = map.get(key);
        if (!existing || item.score >= existing.score) {
          map.set(key, item);
        }
      });

      const sorted = Array.from(map.values()).sort((a, b) => (b.score || 0) - (a.score || 0));
      setTopPlayers(sorted.slice(0, 5));
      
      const userIndex = sorted.findIndex(
        (item) => (item.userId && item.userId === user.id) || item.name.toLowerCase() === (user.username || "").toLowerCase()
      );

      if (userIndex !== -1) {
        setUserGameRank({
          rank: userIndex + 1,
          highScore: sorted[userIndex].score || 0,
          mode: sorted[userIndex].mode || 'Arena Game',
          totalPlayers: sorted.length,
        });
      } else {
        setUserGameRank({
          rank: null,
          highScore: 0,
          mode: '-',
          totalPlayers: sorted.length,
        });
      }
    };

    let unsub = () => {};
    try {
      const lbRef = collection(db, "game_leaderboard");
      unsub = onSnapshot(lbRef, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => list.push(doc.data()));
        calculateUserRank(list);
      }, () => {
        calculateUserRank([]);
      });
    } catch (e) {
      calculateUserRank([]);
    }

    return () => unsub();
  }, [user?.username, user?.id]);

  if (!user) return null;

  // --- STATS REAL-TIME TERINTEGRASI ---
  const stats = useMemo(() => {
    const results = quizResults || [];
    return {
      preTests: results.filter(r => r.type === 'pre').length,
      postTests: results.filter(r => r.type === 'post').length,
      levelQuizzes: results.filter(r => r.type === 'quiz' && r.score >= 80).length,
      totalQuizzes: results.length,
      averageScore: results.length 
        ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) 
        : 0
    };
  }, [quizResults]);

  const userXP = user.xp || 0;
  const currentLevel = user.level || 1;
  const xpInCurrentLevel = userXP % 100;
  const xpNeededForNextLevel = 100 - xpInCurrentLevel;
  const levelProgressPercent = Math.min(100, Math.max(5, (xpInCurrentLevel / 100) * 100));

  const totalActivities = (topics?.length || 0) + (reflections?.length || 0) + stats.totalQuizzes;

  const filteredBadges = useMemo(() => {
    const badges = user.badges || [];
    if (badgeFilter === 'unlocked') return badges.filter(b => b.level > 1);
    if (badgeFilter === 'progress') return badges.filter(b => b.level === 1);
    return badges;
  }, [user.badges, badgeFilter]);

  const handleSelectEmoji = (emoji: string) => {
    updateProfile({ photoUrl: emoji });
    setIsEmojiModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 py-4 sm:py-6 md:py-8 px-3 sm:px-6 lg:px-8 font-sans">
      
      {/* --- PROFILE HEADER CARD WITH INTEGRATED QUICK STATUS TABS --- */}
      <section className="p-5 sm:p-8 md:p-10 rounded-[32px] sm:rounded-[44px] md:rounded-[56px] shadow-2xl border-4 border-white relative overflow-hidden bg-gradient-to-br from-[#031466] via-[#052199] to-orange-500">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 md:w-80 md:h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 md:gap-8 relative z-10">
          {/* User Bio & Avatar Area */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7 text-center sm:text-left w-full lg:w-auto">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEmojiModalOpen(true)}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] border-4 sm:border-6 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-5xl sm:text-6xl md:text-7xl shadow-2xl cursor-pointer hover:border-orange-400 transition-all overflow-hidden"
              >
                {user.photoUrl && (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('/')) ? (
                  <img src={user.photoUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.photoUrl || "😊"}</span>
                )}
              </motion.div>
              <div className="absolute -bottom-1 -right-1 p-2 bg-orange-500 text-white rounded-xl shadow-lg animate-bounce pointer-events-none">
                <MousePointer2 size={14} />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                {isEditingName ? (
                  <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
                    <input
                      type="text"
                      value={newNameInput}
                      onChange={(e) => setNewNameInput(e.target.value)}
                      placeholder="Ketik nama baru..."
                      maxLength={20}
                      className="px-3 py-1 rounded-xl bg-white text-slate-900 font-bold text-xs outline-none w-40"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (newNameInput.trim()) updateProfile({ username: newNameInput.trim() });
                        setIsEditingName(false);
                      }}
                      className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="px-2 py-1 bg-white/20 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                      {user.username || 'Tamu OutBubble'}
                    </h1>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setNewNameInput(user.username || '');
                          setIsEditingName(true);
                        }}
                        title="Ubah Username"
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        ✏️ <span className="hidden sm:inline">Ubah</span>
                      </button>
                      {user.isGuest && (
                        <button
                          onClick={() => {
                            setIsRerolling(true);
                            rerollGuestUsername();
                            setTimeout(() => setIsRerolling(false), 800);
                          }}
                          title="Acak Nama Otomatis"
                          className={cn(
                            "p-1.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-white rounded-xl border border-indigo-300/40 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm",
                            isRerolling && "animate-spin"
                          )}
                        >
                          <Dices size={13} />
                          <span className="hidden sm:inline">Acak 🎲</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsResetConfirmOpen(true)}
                        title="Reset Semua Penyimpanan & Mulai Dari Awal"
                        className="p-1.5 bg-red-500/30 hover:bg-red-500/50 text-white rounded-xl border border-red-300/40 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <History size={13} />
                        <span className="hidden sm:inline">Reset Awal 🔄</span>
                      </button>
                    </div>
                  </div>
                )}

                {user.isGuest ? (
                  <span className="px-3 py-0.5 bg-amber-400/20 text-amber-200 border border-amber-300/40 rounded-full text-[11px] font-black uppercase">
                    Mode Tamu
                  </span>
                ) : (
                  <span className="px-3 py-0.5 bg-emerald-400/20 text-emerald-200 border border-emerald-300/40 rounded-full text-[11px] font-black uppercase">
                    Anggota Resmi 🛡️
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-blue-100 font-bold italic line-clamp-2">
                "{user.bio || 'Penjelajah Literasi Kritis OutBubble'}"
              </p>

              <p className="text-xs text-white/70 font-semibold flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                <ShieldCheck size={14} className="text-emerald-400" /> Semua pencapaian disinkronkan langsung ke akun Anda
              </p>
            </div>
          </div>

          {/* Quick Clickable Status Navigation Pills */}
          <div className="w-full lg:w-auto flex flex-wrap lg:flex-col gap-2.5 justify-center lg:justify-end">
            <div className="text-[10px] font-black uppercase tracking-wider text-white/80 w-full text-center lg:text-right hidden lg:block">
              Klik Status untuk Buka Menu Rinci:
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 w-full lg:w-auto">
              <button
                onClick={() => setActiveTab('level')}
                className={cn(
                  "p-2.5 sm:p-3 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer shadow-md",
                  activeTab === 'level'
                    ? "bg-white text-[#031466] border-white scale-102 ring-2 ring-orange-300"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                )}
              >
                <div className={cn("p-2 rounded-xl text-white font-black", activeTab === 'level' ? "bg-orange-500" : "bg-white/20")}>
                  <Star size={16} fill="currentColor" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">Level Saya</span>
                  <span className="text-sm font-black">Level {currentLevel} • {userXP} XP</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('prestasi')}
                className={cn(
                  "p-2.5 sm:p-3 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer shadow-md",
                  activeTab === 'prestasi'
                    ? "bg-white text-[#031466] border-white scale-102 ring-2 ring-orange-300"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                )}
              >
                <div className={cn("p-2 rounded-xl text-white font-black", activeTab === 'prestasi' ? "bg-amber-500" : "bg-white/20")}>
                  <Award size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">Prestasi</span>
                  <span className="text-sm font-black">{stats.averageScore} Skor Rata-rata</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('liverank')}
                className={cn(
                  "p-2.5 sm:p-3 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer shadow-md",
                  activeTab === 'liverank'
                    ? "bg-white text-[#031466] border-white scale-102 ring-2 ring-orange-300"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                )}
              >
                <div className={cn("p-2 rounded-xl text-white font-black", activeTab === 'liverank' ? "bg-cyan-500" : "bg-white/20")}>
                  <Gamepad2 size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">Live Rank</span>
                  <span className="text-sm font-black">{userGameRank.rank ? `#${userGameRank.rank}` : "Arena Game"}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('ringkasan')}
                className={cn(
                  "p-2.5 sm:p-3 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer shadow-md",
                  activeTab === 'ringkasan'
                    ? "bg-white text-[#031466] border-white scale-102 ring-2 ring-orange-300"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                )}
              >
                <div className={cn("p-2 rounded-xl text-white font-black", activeTab === 'ringkasan' ? "bg-indigo-600" : "bg-white/20")}>
                  <History size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">Ringkasan</span>
                  <span className="text-sm font-black">{totalActivities} Total Aktivitas</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- UNIFIED INTERACTIVE STATUS CONSOLE (Satu Sistem Terpadu Yang Diklik Aja) --- */}
      <div className="bg-white rounded-[32px] sm:rounded-[44px] md:rounded-[56px] border-4 border-slate-100 shadow-xl overflow-hidden">
        
        {/* System Tab Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'level', label: 'Level & Progres XP', icon: Star, count: `Lvl ${currentLevel}`, color: 'text-amber-500' },
            { id: 'prestasi', label: 'Prestasi & Lencana', icon: Award, count: `${user.badges?.length || 6} Badges`, color: 'text-orange-500' },
            { id: 'liverank', label: 'Live Rank Game', icon: Gamepad2, count: userGameRank.rank ? `#${userGameRank.rank}` : 'Live', color: 'text-cyan-500' },
            { id: 'ringkasan', label: 'Ringkasan Aktivitas', icon: BarChart3, count: `${totalActivities} Log`, color: 'text-indigo-500' },
            { id: 'journal', label: 'Buku Jurnal Refleksi', icon: Book, count: `${reflections?.length || 0} Refleksi`, color: 'text-emerald-500' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StatusTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer select-none shrink-0",
                  isActive
                    ? "bg-[#031466] text-white shadow-lg shadow-blue-900/20 scale-102"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                )}
              >
                <Icon size={16} className={cn(isActive ? "text-amber-300" : tab.color)} />
                <span>{tab.label}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase",
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* System Tab Content Area */}
        <div className="p-4 sm:p-6 md:p-10">
          <AnimatePresence mode="wait">
            
            {/* 1. TAB: LEVEL & XP SYSTEM */}
            {activeTab === 'level' && (
              <motion.div
                key="level"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Level Progress Hero */}
                <div className="bg-gradient-to-br from-[#031466] to-[#0a2fcf] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-blue-900/40">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shrink-0">
                        <Star size={36} fill="currentColor" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <span className="text-xs font-black uppercase tracking-widest text-amber-300">Tingkat Kemahiran</span>
                          <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-black rounded-md uppercase">Aktif</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Level {currentLevel} Penjelajah</h2>
                        <p className="text-xs sm:text-sm text-blue-100 font-medium mt-0.5">
                          Total akumulasi pengalaman nalar: <strong className="text-amber-300 font-black">{userXP} XP</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-center sm:text-right bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">Menuju Level {currentLevel + 1}</span>
                      <span className="text-xl font-black text-amber-300">{xpNeededForNextLevel} XP Lagi</span>
                    </div>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2 relative z-10">
                    <div className="flex justify-between text-xs font-bold text-blue-200">
                      <span>Progres Level {currentLevel}</span>
                      <span>{xpInCurrentLevel} / 100 XP ({Math.round(levelProgressPercent)}%)</span>
                    </div>
                    <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-full shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Integrated XP Sources Breakdown Matrix */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-[#031466] uppercase tracking-tight flex items-center gap-2">
                        <Flame className="text-orange-500" size={20} /> Sumber & Alur Perolehan XP Anda
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">XP terintegrasi otomatis dari seluruh aktivitas di dalam platform</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm">🧪 Kuis & Simulasi</div>
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+50 XP / Kuis</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Selesaikan modul materi dan uji pemahaman kritis untuk mendapatkan bonus XP utama.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/test')}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Mulai Tes Sekarang</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-cyan-300 transition-all space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800 font-black text-sm">🫧 Game Bubul Arena</div>
                          <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">+Skor/2 XP</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Pecahkan gelembung bias dan uji kecepatan refleks nalar dalam mini-game interaktif.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/game')}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Main Game Arena</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-amber-100 text-amber-900 font-black text-sm">🔍 Algorithm Detective</div>
                          <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">+60 XP / Kasus</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Investigasi profil media sosial dan pecahkan teka-teki bias rekomendasi algoritma.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/game')}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Buka Detektif Kasus</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm">✍️ Jurnal Refleksi</div>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">+50 XP / Refleksi</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Tulis pemikiran mandiri dan simpan jejak ketenangan nalar di Buku Jurnal Digital.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/refleksi')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Tulis Refleksi Baru</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-blue-100 text-blue-800 font-black text-sm">💬 Forum Komunitas</div>
                          <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">+20-30 XP / Diskusi</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Bahas sudut pandang dialektika dan tanggapi argumen rekan komunitas secara kritis.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/forum')}
                        className="w-full py-2 bg-[#031466] hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Kunjungi Forum Diskusi</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-purple-100 text-purple-800 font-black text-sm">🤖 Asisten AI Bubul</div>
                          <span className="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">+40 XP / Sesi</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Selesaikan pertanyaan pemantik kognitif langsung dari asisten cerdas Bubul.
                        </p>
                      </div>
                      <div className="py-2 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-purple-200">
                        <span>Aktif di Seluruh Halaman 🫧</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. TAB: PRESTASI & LENCANA (BADGES) */}
            {activeTab === 'prestasi' && (
              <motion.div
                key="prestasi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Academic Score & Title Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-md flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-100 block">Skor Rata-Rata Akademik</span>
                      <h3 className="text-4xl sm:text-5xl font-black">{stats.averageScore}</h3>
                      <p className="text-xs text-orange-100 font-medium">Dari {stats.totalQuizzes} tes & kuis terselesaikan</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-white/20">
                      <span className="px-3 py-1 bg-white text-orange-600 font-black text-xs rounded-full uppercase tracking-wider shadow-sm">
                        {stats.averageScore >= 80 ? "Master Thinker 👑" : stats.averageScore >= 50 ? "Bubble Explorer 🧭" : "Novice Learner 🌱"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#031466] rounded-3xl p-6 text-white relative overflow-hidden shadow-md flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">Status Tes Diagnostik</span>
                      <h3 className="text-3xl font-black">
                        {user.testStatus.postTest === 'completed' ? 'Lulus Penuh 🎉' : user.testStatus.simulation === 'completed' ? 'Simulasi Beres' : user.testStatus.preTest === 'completed' ? 'Pre-Test Beres' : 'Belum Mulai'}
                      </h3>
                      <p className="text-xs text-blue-200 font-medium">Alur pembelajaran dari Pre-Test sampai Post-Test</p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-white/10 text-xs font-black text-amber-300">
                      <ClipboardCheck size={14} />
                      <span>{stats.preTests + stats.postTests} Ujian Diagnostik Selesai</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-md flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200 block">Koleksi Lencana</span>
                      <h3 className="text-3xl font-black">{user.badges?.filter(b => b.level > 1).length || 0} / {user.badges?.length || 6} Terbuka</h3>
                      <p className="text-xs text-cyan-100 font-medium">Tingkatkan level setiap lencana hingga Master Lvl 15</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-white/20 flex gap-2">
                      <button
                        onClick={() => setBadgeFilter('all')}
                        className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-all", badgeFilter === 'all' ? "bg-white text-cyan-900" : "bg-white/20 text-white")}
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => setBadgeFilter('unlocked')}
                        className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-all", badgeFilter === 'unlocked' ? "bg-white text-cyan-900" : "bg-white/20 text-white")}
                      >
                        Aktif
                      </button>
                    </div>
                  </div>
                </div>

                {/* Badges Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-black text-[#031466] uppercase tracking-tight flex items-center gap-2">
                      <Award className="text-orange-500" size={20} /> Daftar Lencana Literasi Anda
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBadges.map((badge) => {
                      const isUnlocked = badge.level > 1;
                      const nextLevelTarget = badge.level * 50;
                      return (
                        <div
                          key={badge.id}
                          className={cn(
                            "p-5 rounded-3xl border transition-all space-y-3",
                            isUnlocked
                              ? "bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-amber-200 shadow-sm"
                              : "bg-slate-50/70 border-slate-200 opacity-90"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl shrink-0">
                              {badge.icon}
                            </div>
                            <div className="text-right">
                              <span className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block",
                                isUnlocked ? "bg-amber-500 text-white shadow-xs" : "bg-slate-200 text-slate-600"
                              )}>
                                {isUnlocked ? `Tier ${badge.level}` : 'Tingkat Dasar'}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-black text-slate-900 text-base">{badge.name}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{badge.description}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                            <div className="flex justify-between text-[10px] font-extrabold text-slate-500">
                              <span>Progres Menuju Tier {badge.level + 1}</span>
                              <span className="text-[#031466]">{badge.level * 20} / {nextLevelTarget} Poin</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, Math.max(15, (badge.level / 15) * 100))}%` }}
                                className="h-full bg-orange-500 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">Ingin menaikkan tier lencana Anda?</h4>
                    <p className="text-xs text-slate-500 font-medium">Lakukan tes evaluasi simulasi nalar untuk mengumpulkan poin lencana.</p>
                  </div>
                  <button
                    onClick={() => navigate('/test')}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                  >
                    Buka Halaman Tes & Simulasi 🚀
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. TAB: LIVE RANK GAME */}
            {activeTab === 'liverank' && (
              <motion.div
                key="liverank"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Live Rank Main Card */}
                <div className="bg-gradient-to-br from-cyan-600 via-blue-700 to-[#031466] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden shadow-xl border-b-8 border-cyan-400">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4 text-center md:text-left">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-xl shrink-0">
                        🏆
                      </div>
                      <div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <span className="text-xs font-black uppercase tracking-widest text-cyan-200">Peringkat Game Bubul 🫧</span>
                          <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-200 text-[10px] font-black rounded-md uppercase flex items-center gap-1">
                            <Sparkles size={10} /> Real-Time Sync
                          </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">
                          {userGameRank.rank ? `#${userGameRank.rank} di Papan Skor` : "Belum Ada Skor Permainan"}
                        </h2>
                        <p className="text-xs sm:text-sm text-cyan-100 font-medium mt-0.5">
                          {userGameRank.rank 
                            ? `Posisi #${userGameRank.rank} dari ${userGameRank.totalPlayers} total pemain terdaftar`
                            : "Mainkan mode game untuk mencatatkan namamu di papan peringkat!"}
                        </p>
                      </div>
                    </div>

                    <div className="text-center md:text-right bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/20 shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200 block">Skor Tertinggi Saya</span>
                      <span className="text-2xl font-black text-amber-300">{userGameRank.highScore} PTS</span>
                      <span className="text-[10px] font-bold text-cyan-100 block mt-0.5">Mode: {userGameRank.mode}</span>
                    </div>
                  </div>
                </div>

                {/* Top 5 Leaderboard Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-[#031466] uppercase tracking-tight flex items-center gap-2">
                      <Trophy className="text-amber-500" size={18} /> Top Pemain Teratas Terdaftar
                    </h3>
                    <button
                      onClick={() => navigate('/game')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Papan Skor Lengkap</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>

                  {topPlayers.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 space-y-2">
                      <p className="text-xs text-slate-500 font-medium">Belum ada skor permainan dari pengguna lain. Jadilah pemain pertama!</p>
                      <button
                        onClick={() => navigate('/game')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black cursor-pointer"
                      >
                        Main Game Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {topPlayers.map((item, idx) => {
                        const isMe = (item.userId && item.userId === user.id) || item.name.toLowerCase() === (user.username || '').toLowerCase();
                        return (
                          <div
                            key={idx}
                            className={cn(
                              "p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all",
                              isMe ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500" :
                              idx === 0 ? "bg-amber-50/80 border-amber-300" : "bg-white border-slate-100"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs",
                                idx === 0 ? "bg-amber-400 text-white" :
                                idx === 1 ? "bg-slate-300 text-slate-800" :
                                idx === 2 ? "bg-orange-400 text-white" : "bg-slate-100 text-slate-600"
                              )}>
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900">{item.name}</span>
                                {isMe && <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-md">Kamu</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-slate-900 text-xs">{item.score} PTS</span>
                              <span className="text-[10px] text-slate-400 block font-bold">{item.mode}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Play CTA */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/game')}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={18} />
                    <span>Masuk ke Arena Game Bubul 🫧</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 4. TAB: RINGKASAN AKTIVITAS */}
            {activeTab === 'ringkasan' && (
              <motion.div
                key="ringkasan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Summary Matrix Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-[#031466] rounded-3xl p-5 text-white space-y-3 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-blue-500/20 rounded-2xl w-fit text-blue-300">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">Diskusi Forum</span>
                      <h4 className="text-3xl font-black">{topics?.length || 0}</h4>
                      <p className="text-xs text-blue-200 mt-1 font-medium">Topik & balasan nalar</p>
                    </div>
                    <button
                      onClick={() => navigate('/forum')}
                      className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Buka Forum</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  <div className="bg-orange-500 rounded-3xl p-5 text-white space-y-3 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-white/20 rounded-2xl w-fit text-white">
                      <Rocket size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-100 block">Kuis Terselesaikan</span>
                      <h4 className="text-3xl font-black">{stats.levelQuizzes}</h4>
                      <p className="text-xs text-orange-100 mt-1 font-medium">Kuis dengan skor kelulusan ≥80</p>
                    </div>
                    <button
                      onClick={() => navigate('/test')}
                      className="text-xs font-bold text-white hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Buka Kuis</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  <div className="bg-emerald-600 rounded-3xl p-5 text-white space-y-3 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-white/20 rounded-2xl w-fit text-white">
                      <ClipboardCheck size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100 block">Pre & Post Test</span>
                      <h4 className="text-3xl font-black">{stats.preTests + stats.postTests}</h4>
                      <p className="text-xs text-emerald-100 mt-1 font-medium">Ujian pemetaan awal & akhir</p>
                    </div>
                    <button
                      onClick={() => navigate('/test')}
                      className="text-xs font-bold text-white hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Ikuti Ujian</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  <div className="bg-cyan-700 rounded-3xl p-5 text-white space-y-3 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-white/20 rounded-2xl w-fit text-white">
                      <Book size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-100 block">Buku Refleksi</span>
                      <h4 className="text-3xl font-black">{reflections?.length || 0}</h4>
                      <p className="text-xs text-cyan-100 mt-1 font-medium">Catatan reflektif mandiri</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('journal')}
                      className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Baca Jurnal</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                </div>

                {/* Overall Platform Journey Progress */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Status Kelengkapan Pembelajaran OutBubble</h4>
                      <p className="text-xs text-slate-500 font-medium">Ringkasan kemajuan dari 5 pilar literasi digital</p>
                    </div>
                    <span className="px-3 py-1 bg-[#031466] text-white text-xs font-black rounded-full">
                      Terintegrasi Penuh
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                      <CheckCircle2 size={18} className={user.testStatus.preTest === 'completed' ? "text-emerald-500" : "text-slate-300"} />
                      <div>
                        <span className="text-xs font-black text-slate-800 block">1. Pre-Test Diagnostik</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {user.testStatus.preTest === 'completed' ? 'Selesai' : 'Belum'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                      <CheckCircle2 size={18} className={user.testStatus.assessment === 'completed' ? "text-emerald-500" : "text-slate-300"} />
                      <div>
                        <span className="text-xs font-black text-slate-800 block">2. Asesmen Evaluatif</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {user.testStatus.assessment === 'completed' ? 'Selesai' : 'Belum'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                      <CheckCircle2 size={18} className={user.testStatus.simulation === 'completed' ? "text-emerald-500" : "text-slate-300"} />
                      <div>
                        <span className="text-xs font-black text-slate-800 block">3. Simulasi Algoritma</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {user.testStatus.simulation === 'completed' ? 'Selesai' : 'Belum'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. TAB: THE PROGRESS JOURNAL (BUKU REFLEKSI) */}
            {activeTab === 'journal' && (
              <motion.div
                key="journal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="bg-[#fdfaf1] rounded-[32px] md:rounded-[44px] shadow-xl border-l-[12px] md:border-l-[18px] border-[#031466] p-6 md:p-8 flex flex-col overflow-hidden relative min-h-[420px]">
                  
                  {/* Journal Header */}
                  <div className="pb-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#031466] font-black uppercase text-xs md:text-sm tracking-wider">
                      <Book size={18} className="text-orange-500" /> Buku Jurnal Refleksi Digital
                    </div>
                    <span className="text-xs font-black text-[#031466]/60 uppercase bg-white px-3 py-1 rounded-lg border border-slate-200">
                      Hal {currentPage + 1} dari {reflections?.length || 1}
                    </span>
                  </div>

                  {/* Journal Body */}
                  <div className="py-6 flex-1 relative overflow-y-auto">
                    <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#031466 1px, transparent 1px)', backgroundSize: '100% 2rem' }} />
                    
                    {reflections && reflections.length > 0 ? (
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1.5 text-orange-700 font-black text-xs uppercase bg-orange-100/80 px-3 py-1.5 rounded-full border border-orange-200">
                              <Calendar size={12} /> {reflections[currentPage].date}
                            </span>
                            {reflections[currentPage].topic && (
                              <span className="text-xs font-black text-[#031466] bg-blue-100/90 px-3 py-1.5 rounded-full border border-blue-200">
                                🏷️ {reflections[currentPage].topic}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black px-3 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-300">
                            {reflections[currentPage].source === 'Bubul' ? "🫧 Asisten Bubul" : "✍️ Refleksi Mandiri"}
                          </span>
                        </div>

                        <div className="bg-white/70 p-4 md:p-5 rounded-2xl border border-indigo-100 backdrop-blur-xs space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pertanyaan Pemantik:</span>
                          <h4 className="text-base md:text-lg font-black text-[#031466]">
                            "{reflections[currentPage].question}"
                          </h4>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jawaban Pemikiran Siswa:</span>
                          <p className="text-sm md:text-base text-slate-800 leading-relaxed py-3 px-4 border-l-4 border-orange-400 bg-white/90 rounded-r-2xl shadow-xs">
                            {reflections[currentPage].answer}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 italic font-bold py-12">
                        <PenTool size={36} className="text-slate-300 mb-3" />
                        Belum ada catatan refleksi yang disimpan.<br />
                        Jawab pertanyaan reflektif dari asisten Bubul 🫧 atau tulis di halaman Refleksi!
                      </div>
                    )}
                  </div>

                  {/* Journal Footer Controls */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => navigate('/refleksi')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <PenTool size={14} />
                      <span>Tulis Baru</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="p-2.5 rounded-xl bg-[#031466] text-white disabled:opacity-20 shadow-md hover:bg-orange-500 transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min((reflections?.length || 1) - 1, p + 1))}
                        disabled={!reflections || currentPage === reflections.length - 1}
                        className="p-2.5 rounded-xl bg-[#031466] text-white disabled:opacity-20 shadow-md hover:bg-orange-500 transition-colors cursor-pointer"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* --- MODAL EMOJI & AVATAR SELECTOR --- */}
      <AnimatePresence>
        {isEmojiModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-[#031466]/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmojiModalOpen(false)} className="absolute inset-0" />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-[36px] sm:rounded-[48px] relative z-10 shadow-2xl border-[6px] border-orange-500 flex flex-col max-h-[85vh]"
            >
               <div className="flex justify-between items-center mb-6 shrink-0">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#031466] uppercase tracking-tighter">Pilih Foto Profil</h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Pilih karakter Avatar atau Emoji kesukaanmu</p>
                  </div>
                  <button onClick={() => setIsEmojiModalOpen(false)} className="p-2 bg-slate-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer">
                    <X size={18} />
                  </button>
               </div>
               
               <div className="overflow-y-auto space-y-6 p-2 md:p-3 custom-scrollbar rounded-3xl bg-slate-50 border border-slate-100 flex-1">
                  <div>
                    <p className="text-xs font-black text-[#031466] uppercase tracking-wider mb-2.5">Karakter Avatar</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                      {AVATAR_SEEDS.map((seed) => {
                        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                        return (
                          <button
                            key={seed}
                            onClick={() => {
                              updateProfile({ photoUrl: avatarUrl });
                              setIsEmojiModalOpen(false);
                            }}
                            className="aspect-square rounded-2xl bg-white border-2 border-slate-200 hover:border-orange-500 p-1 shadow-sm hover:scale-105 transition-all flex items-center justify-center cursor-pointer overflow-hidden"
                          >
                            <img src={avatarUrl} alt={seed} className="w-full h-full object-cover rounded-xl" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#031466] uppercase tracking-wider mb-2.5">Persona Emoji</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {EMOJIS.map((emoji, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleSelectEmoji(emoji)} 
                          className="text-2xl sm:text-3xl aspect-square flex items-center justify-center bg-white shadow-sm hover:bg-orange-100 border border-transparent hover:border-orange-300 rounded-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
               
               <p className="mt-4 text-center text-[#031466]/40 font-bold uppercase text-[10px] tracking-widest shrink-0 bg-slate-50 py-1.5 rounded-lg">
                 Gratis ganti kapan saja! ✨
               </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL CONFIRMATION RESET DATA & STORAGE --- */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 bg-[#031466]/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsResetConfirmOpen(false)} className="absolute inset-0" />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white w-full max-w-md p-6 sm:p-8 rounded-[36px] relative z-10 shadow-2xl border-4 border-red-500 flex flex-col space-y-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto shadow-sm">
                ⚠️
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#031466] uppercase tracking-tight">
                  Reset Semua Penyimpanan?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Tindakan ini akan membersihkan seluruh riwayat lokal dan mengembalikan akun Anda ke <strong>Level 1 (0 XP)</strong> dengan status awal yang bersih.
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 space-y-1 text-left text-xs text-red-700 font-semibold">
                <p>• Level & XP kembali ke Level 1 (0 XP)</p>
                <p>• Riwayat Kuis, Refleksi & Game Lokal dibersihkan</p>
                <p>• Seluruh lencana kembali ke Tingkat Dasar (Tier 1)</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    resetAllData();
                    setIsResetConfirmOpen(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer transition-all shadow-md active:scale-95"
                >
                  Ya, Bersihkan & Reset 🔄
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
