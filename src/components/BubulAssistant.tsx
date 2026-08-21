import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, MessageSquare, Send, BookOpen, 
  HelpCircle, RefreshCw, ChevronRight, Compass, 
  CheckCircle2, Move, ArrowRight, ShieldCheck, Heart,
  Brain, Lightbulb, Dices
} from 'lucide-react';
import { useStore, Reflection } from '../lib/store';
import { cn } from '../lib/utils';
import BubulMascot, { BubulExpression } from './BubulMascot';
import { 
  BUBUL_PAGE_CONTEXTS, 
  BUBUL_MODULE_CONTEXTS, 
  BUBUL_REFLECTION_RESPONSES,
  BubulPageContext 
} from '../lib/bubulContextData';

export const BubulAssistant: React.FC = () => {
  const location = useLocation();
  const { 
    user, 
    isFocusModeActive, 
    activeModuleTopic,
    bubulPosition,
    setBubulPosition,
    bubulChatOpen,
    setBubulChatOpen,
    bubulUnreadNotice,
    setBubulUnreadNotice,
    addReflection,
    addXP,
    updateBadge,
    chatHistory,
    setChatHistory
  } = useStore();

  // Active view tab inside Bubul chat panel: 'guide-reflect' | 'chat-ai'
  const [activeTab, setActiveTab] = useState<'guide-reflect' | 'chat-ai'>('guide-reflect');
  
  // Reflection Input State
  const [reflectionInput, setReflectionInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [justSubmittedReflection, setJustSubmittedReflection] = useState<string | null>(null);
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);
  const [reflectionMood, setReflectionMood] = useState(50);

  // Free Chat AI State
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Mascot expression state
  const [expression, setExpression] = useState<BubulExpression>('normal');
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  // Get current page contextual data
  const currentContext: BubulPageContext = useMemo(() => {
    const pathname = location.pathname;
    return BUBUL_PAGE_CONTEXTS[pathname] || BUBUL_PAGE_CONTEXTS['/'];
  }, [location.pathname]);

  // Check if user is currently viewing a specific module in Materi
  const activeModuleContext = useMemo(() => {
    if (location.pathname === '/materi' && activeModuleTopic && BUBUL_MODULE_CONTEXTS[activeModuleTopic]) {
      return BUBUL_MODULE_CONTEXTS[activeModuleTopic];
    }
    return null;
  }, [location.pathname, activeModuleTopic]);

  // Active reflection question based on context
  const currentQuestion = useMemo(() => {
    if (activeModuleContext && activeModuleContext.questions.length > 0) {
      const idx = questionIndex % activeModuleContext.questions.length;
      return {
        topic: activeModuleContext.topic,
        question: activeModuleContext.questions[idx].question,
        hint: activeModuleContext.questions[idx].hint,
        level: activeModuleContext.questions[idx].cognitiveLevel
      };
    }
    const questions = currentContext.reflectionQuestions;
    const idx = questionIndex % questions.length;
    return {
      topic: questions[idx].topic,
      question: questions[idx].question,
      hint: questions[idx].hint,
      level: questions[idx].cognitiveLevel
    };
  }, [activeModuleContext, currentContext, questionIndex]);

  // On page change: Trigger contextual greeting in speech bubble & update Bubul expression
  useEffect(() => {
    setQuestionIndex(0);
    setJustSubmittedReflection(null);
    setExpression('guide');
    setSpeechBubbleText(currentContext.bubbleGreeting);
    setShowSpeechBubble(true);
    setBubulUnreadNotice(true);

    const speechTimer = setTimeout(() => {
      setShowSpeechBubble(false);
      setExpression('normal');
    }, 6000);

    return () => clearTimeout(speechTimer);
  }, [location.pathname, currentContext, setBubulUnreadNotice]);

  // Auto scroll in AI chat tab
  useEffect(() => {
    if (activeTab === 'chat-ai' && chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isAiTyping, activeTab]);

  // Handle position toggle (bottom-right -> bottom-left -> mid-right -> mid-left)
  const handleCyclePosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    const positions: ('bottom-right' | 'bottom-left' | 'mid-right' | 'mid-left')[] = [
      'bottom-right', 'bottom-left', 'mid-right', 'mid-left'
    ];
    const currentIndex = positions.indexOf(bubulPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    setBubulPosition(positions[nextIndex]);
  };

  // Switch Reflection Question
  const handleCycleQuestion = () => {
    setQuestionIndex(prev => prev + 1);
    setJustSubmittedReflection(null);
    setExpression('thinking');
    setTimeout(() => setExpression('normal'), 1000);
  };

  // Submit Reflection to Store (Refleksi & Buku Profil)
  const handleSubmitReflection = () => {
    if (!reflectionInput.trim() || isSubmittingReflection) return;
    setIsSubmittingReflection(true);
    setExpression('sparkle');

    const newReflection: Reflection = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      question: currentQuestion.question,
      answer: reflectionInput.trim(),
      topic: currentQuestion.topic,
      source: 'Bubul',
      moodLevel: reflectionMood,
      userId: user?.id || 'guest',
      createdAt: Date.now()
    };

    // Save to Zustand store (persisted)
    addReflection(newReflection);
    addXP(40);
    updateBadge('critical-thinker', 15);

    // Pick appreciative response
    const randomResponse = BUBUL_REFLECTION_RESPONSES[Math.floor(Math.random() * BUBUL_REFLECTION_RESPONSES.length)];
    setJustSubmittedReflection(randomResponse);
    setReflectionInput('');
    setIsSubmittingReflection(false);
  };

  // Send query in Free AI Chat Mode
  const handleSendChat = async (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim() || isAiTyping) return;

    setChatInput('');
    setIsAiTyping(true);
    setExpression('thinking');

    const newHistory = [...chatHistory, { role: 'user' as const, text: textToSend.trim() }];
    setChatHistory(newHistory);

    let reply = "";
    let fetched = false;

    // Direct Gemini Client Call if configured
    const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (clientApiKey && clientApiKey !== "MY_GEMINI_API_KEY" && clientApiKey !== "") {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...newHistory.slice(-6).map(m => ({
                role: m.role === 'bubul' ? 'model' : 'user',
                parts: [{ text: m.text }]
              }))
            ],
            systemInstruction: {
              parts: [{
                text: "Nama kamu adalah Bubul, si pemandu gelembung pintar OutBubble. Gaya bicaramu ramah, santai, cerdas, tidak menggurui, dan khas teman belajar siswa SMA. Selalu bedah fenomena media sosial, algoritma, dan opini dari dua sudut pandang (kenapa ada yang merasa pas vs kenapa ada yang merasa bermasalah/gak pas). Akhiri dengan pertanyaan reflektif yang merangsang nalar kritis."
              }]
            },
            generationConfig: { temperature: 0.7 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            reply = data.candidates[0].content.parts[0].text;
            fetched = true;
          }
        }
      } catch (e) {
        console.warn("Direct Gemini failed, trying backend...", e);
      }
    }

    // Backend Proxy API
    if (!fetched) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: "Nama kamu adalah Bubul, asisten literasi kritis OutBubble. Bantu jawab dengan ramah, santai, dan eksplorasi dua sudut pandang." }]
              },
              ...newHistory.slice(-6).map(m => ({
                role: m.role === 'bubul' ? 'model' : 'user',
                parts: [{ text: m.text }]
              }))
            ]
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            reply = data.text;
            fetched = true;
          }
        }
      } catch (e) {
        console.warn("Backend chat failed, using local smart fallback...", e);
      }
    }

    // Smart Local Fallback
    if (!fetched) {
      reply = `Wah, pertanyaanmu menarik banget! 🫧 Dari sisi kepraktisan, algoritma emang ngebantu kita nemuin konten yang kita suka secara instan. Tapi di sisi lain, hal ini bikin kita gampang terjebak di filter bubble dan susah ngerti sudut pandang orang yang beda kubu.\n\nMenurutmu sendiri, seberapa seimbang linimasa media sosialmu saat ini? 🧐`;
    }

    setChatHistory([...newHistory, { role: 'bubul', text: reply }]);
    setIsAiTyping(false);
    setExpression('happy');
    setTimeout(() => setExpression('normal'), 2000);
  };

  // Position CSS mapping
  const positionClasses = {
    'bottom-right': 'bottom-5 right-5 sm:bottom-8 sm:right-8',
    'bottom-left': 'bottom-5 left-5 sm:bottom-8 sm:left-24',
    'mid-right': 'top-1/2 -translate-y-1/2 right-5 sm:right-8',
    'mid-left': 'top-1/2 -translate-y-1/2 left-5 sm:left-24'
  };

  // DO NOT RENDER if user is not logged in OR if test/quiz/simulation/video is currently active
  if (!user || isFocusModeActive) {
    return null;
  }

  return (
    <>
      {/* 1. FLOATING BUBUL MASCOT TRIGGER */}
      <div className={cn("fixed z-50 flex items-center gap-3 select-none transition-all duration-300", positionClasses[bubulPosition])}>
        
        {/* Floating Contextual Speech Bubble Preview */}
        <AnimatePresence>
          {showSpeechBubble && !bubulChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: bubulPosition.includes('right') ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={() => {
                setBubulChatOpen(true);
                setShowSpeechBubble(false);
              }}
              className={cn(
                "hidden sm:flex max-w-[260px] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-indigo-100 cursor-pointer hover:border-indigo-300 hover:shadow-2xl transition-all group",
                bubulPosition.includes('right') ? "order-first text-right" : "order-last text-left"
              )}
            >
              <div className="text-[11px] font-bold text-slate-800 leading-snug">
                <span className="text-indigo-600 font-black flex items-center gap-1 mb-0.5 justify-end">
                  <Sparkles size={12} className="text-amber-500" /> Bubul Pemandu
                </span>
                <p className="text-slate-600 font-medium line-clamp-2">
                  {speechBubbleText || currentContext.bubbleGreeting}
                </p>
                <span className="text-[10px] text-indigo-700 font-black mt-1 inline-block group-hover:underline">
                  Klik untuk panduan & refleksi 💭
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Button */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              setBubulChatOpen(!bubulChatOpen);
              setShowSpeechBubble(false);
              setBubulUnreadNotice(false);
            }}
            className={cn(
              "relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer shadow-[0_10px_35px_rgba(3,20,102,0.25)] border-2 transition-all",
              bubulChatOpen 
                ? "bg-slate-900 border-white text-white rotate-90 shadow-slate-900/40" 
                : "bg-gradient-to-br from-cyan-400 via-blue-600 to-[#031466] border-white/80"
            )}
            title="Buka Pemandu & Refleksi Bubul"
            aria-label="Asisten Bubul"
          >
            {bubulChatOpen ? (
              <X size={26} className="text-white" />
            ) : (
              <BubulMascot expression={expression} size="md" />
            )}

            {/* Notification Badge 💬 */}
            {!bubulChatOpen && bubulUnreadNotice && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md animate-bounce">
                💬
              </span>
            )}
          </motion.button>

          {/* Mini Dock Position Switcher */}
          <button
            onClick={handleCyclePosition}
            title="Pindahkan Posisi Bubul"
            className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/90 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-full border border-slate-200 shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Move size={11} />
          </button>
        </div>
      </div>

      {/* 2. FLOATING CHAT & REFLECTION PANEL */}
      <AnimatePresence>
        {bubulChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-2 sm:p-6 sm:pr-24 pointer-events-none">
            
            {/* Backdrop on mobile for focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBubulChatOpen(false)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs sm:hidden pointer-events-auto"
            />

            {/* Main Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="w-full max-w-[460px] h-[85vh] sm:h-[620px] bg-white/98 backdrop-blur-2xl rounded-[32px] shadow-[0_25px_80px_-15px_rgba(3,20,102,0.3)] border border-slate-200/90 flex flex-col overflow-hidden pointer-events-auto relative z-10"
            >
              {/* HEADER */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#031466] via-blue-900 to-indigo-900 text-white flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                    <BubulMascot expression={expression} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                        Bubul Pemandu <Sparkles size={13} className="text-amber-400 fill-amber-400" />
                      </h3>
                      <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-200 rounded-full text-[9px] font-black border border-cyan-300/30">
                        Live Guide
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-200 font-medium truncate max-w-[200px]">
                      📍 {activeModuleContext ? `Modul: ${activeModuleContext.title}` : currentContext.pageName}
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCyclePosition}
                    title="Pindahkan Posisi Dock Bubul"
                    className="p-2 hover:bg-white/15 text-blue-200 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <Move size={15} />
                  </button>
                  <button
                    onClick={() => setBubulChatOpen(false)}
                    title="Tutup Panel"
                    className="p-2 hover:bg-rose-500/30 text-blue-200 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex items-center bg-slate-100 p-1.5 border-b border-slate-200 shrink-0">
                <button
                  onClick={() => setActiveTab('guide-reflect')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                    activeTab === 'guide-reflect'
                      ? "bg-white text-[#031466] shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Compass size={14} className={activeTab === 'guide-reflect' ? "text-indigo-600" : ""} />
                  <span>Panduan & Refleksi 💭</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat-ai')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                    activeTab === 'chat-ai'
                      ? "bg-white text-[#031466] shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Brain size={14} className={activeTab === 'chat-ai' ? "text-indigo-600" : ""} />
                  <span>Diskusi Bebas 🫧</span>
                </button>
              </div>

              {/* TAB 1: PANDUAN & REFLEKSI KRITIS (MAIN INTERVENTION) */}
              {activeTab === 'guide-reflect' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-slate-50/50">
                  
                  {/* Panduan Singkat Halaman */}
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-950 space-y-1.5">
                    <div className="flex items-center justify-between font-black text-indigo-900">
                      <span className="flex items-center gap-1.5">
                        <Lightbulb size={14} className="text-amber-500 fill-amber-400" />
                        Panduan Halaman:
                      </span>
                      <span className="text-[10px] text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100 font-bold">
                        {currentContext.keyConcept}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {activeModuleContext ? activeModuleContext.guide : currentContext.guideDescription}
                    </p>
                  </div>

                  {/* KOTAK PERTANYAAN REFLEKSI HOTS (C4 Analisis & C5 Evaluasi) */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-indigo-200/80 shadow-sm space-y-3.5 relative overflow-hidden">
                    
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-[#031466] text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
                          Topik: {currentQuestion.topic}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[9px] font-extrabold border border-amber-200">
                          {currentQuestion.level}
                        </span>
                      </div>

                      <button
                        onClick={handleCycleQuestion}
                        title="Ganti Pertanyaan Refleksi"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
                      >
                        <Dices size={13} />
                        <span>Tukar Soal 🎲</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-black text-[#031466] leading-snug">
                        "{currentQuestion.question}"
                      </h4>
                      <p className="text-[11px] text-slate-500 italic">
                        💡 Petunjuk: {currentQuestion.hint}
                      </p>
                    </div>

                    {/* JIKA SUDAH DISUBMIT: TAMPILKAN APRESIASI BUBUL */}
                    {justSubmittedReflection ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-emerald-950 leading-relaxed">
                              {justSubmittedReflection}
                            </p>
                            <p className="text-[10px] text-emerald-700 mt-1">
                              +40 XP Kepekaan Digital • Tersimpan di Profil → The Progress Journal
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                          <button
                            onClick={handleCycleQuestion}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black transition-all cursor-pointer shadow-sm"
                          >
                            Jawab Refleksi Berikutnya 🚀
                          </button>
                          <span className="text-[10px] font-bold text-emerald-800">
                            📖 Masuk ke Buku
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      /* FORM INPUT JAWABAN REFLEKSI */
                      <div className="space-y-3 pt-1">
                        
                        {/* Suasana Hati / Tingkat Keyakinan Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Emosional / Ragu</span>
                            <span className="text-indigo-600 font-extrabold">Ketenangan Nalar ({reflectionMood}%)</span>
                            <span>Sangat Objektif</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={reflectionMood}
                            onChange={(e) => setReflectionMood(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#031466]"
                          />
                        </div>

                        <textarea
                          value={reflectionInput}
                          onChange={(e) => setReflectionInput(e.target.value)}
                          placeholder="Tuliskan alasan dan sudut pandang analisismu di sini..."
                          rows={4}
                          className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white outline-none text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none transition-all"
                        />

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400 font-medium">
                            Disimpan otomatis ke <strong className="text-slate-600">Buku Refleksi</strong>
                          </span>
                          <button
                            onClick={handleSubmitReflection}
                            disabled={!reflectionInput.trim() || isSubmittingReflection}
                            className="px-4 py-2 bg-[#031466] hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 shrink-0"
                          >
                            <Send size={13} />
                            <span>Kirim Refleksi</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QUICK PROMPTS CHIPS */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                      💭 Tanya Bubul Seputar Halaman Ini:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {currentContext.quickPrompts.map((qp, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveTab('chat-ai');
                            handleSendChat(qp.query);
                          }}
                          className="w-full text-left p-2.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-900 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                        >
                          <span>{qp.label}</span>
                          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: FREE AI CHAT MODE */}
              {activeTab === 'chat-ai' && (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                  
                  {/* Chat Messages List */}
                  <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                    {chatHistory.length === 0 && (
                      <div className="text-center py-8 px-4 space-y-2 text-slate-500">
                        <BubulMascot size="lg" className="mx-auto" />
                        <h4 className="text-sm font-bold text-slate-800">Hai! Ada fenomena medsos apa yang mau kita bedah?</h4>
                        <p className="text-xs text-slate-500">
                          Tanyakan seputar FYP, war komen, echo chamber, atau trik memahami kubu sebelah! 🫧
                        </p>
                      </div>
                    )}

                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={cn("flex items-end gap-2", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
                      >
                        {msg.role === 'bubul' ? (
                          <BubulMascot size="sm" className="shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {user?.username?.slice(0, 2).toUpperCase() || 'U'}
                          </div>
                        )}

                        <div className={cn(
                          "max-w-[82%] px-3.5 py-2.5 text-xs sm:text-sm shadow-2xs leading-relaxed",
                          msg.role === 'bubul'
                            ? "bg-white text-slate-800 rounded-2xl rounded-bl-sm border border-slate-200 font-normal whitespace-pre-line"
                            : "bg-indigo-600 text-white rounded-2xl rounded-br-sm font-medium"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isAiTyping && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <BubulMascot size="sm" className="animate-bounce" />
                        <div className="px-3 py-1.5 bg-white rounded-full border border-indigo-100 flex items-center gap-1.5 shadow-xs">
                          <RefreshCw size={11} className="animate-spin text-indigo-600" />
                          <span className="text-[10px] font-bold text-slate-500 animate-pulse">Bubul sedang berpikir...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <div className="p-3 bg-white border-t border-slate-200">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChat();
                      }}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-300 focus-within:border-indigo-600 focus-within:bg-white rounded-full p-1 pl-3 transition-all"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Tanya Bubul seputar media sosial..."
                        disabled={isAiTyping}
                        className="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isAiTyping}
                        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-all"
                      >
                        <Send size={13} />
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* FOOTER */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0 flex items-center justify-between px-4">
                <span className="text-[10px] font-bold text-slate-500">
                  🫧 Asisten OutBubble • Nalar Kritis Digital
                </span>
                <span className="text-[10px] font-black text-indigo-700">
                  {user.username || 'Siswa Kritis'}
                </span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BubulAssistant;
