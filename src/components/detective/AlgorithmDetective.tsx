import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DetectivePhase, 
  EvidenceItem, 
  QuestionOption, 
  FeedItem 
} from '../../types/detective';
import { 
  CASE_1_PROFILE, 
  CASE_1_FEED, 
  CASE_1_EVIDENCE, 
  CASE_1_QUESTION,
  CASE_2_PROFILE,
  CASE_2_FEED,
  CASE_2_MISSING_FEED,
  CASE_2_QUESTION_1,
  CASE_2_QUESTION_2,
  CASE_3_PROFILE,
  CASE_3_INITIAL_FEED,
  CASE_3_ACTION_CARDS,
  CASE_3_TRANSFORMED_FEED,
  CASE_3_FINAL_CHALLENGE
} from '../../data/detectiveData';
import { DetectiveHeader } from './DetectiveHeader';
import { GameIntro } from './GameIntro';
import { MockSmartphoneFeed } from './MockSmartphoneFeed';
import { EvidenceCard } from './EvidenceCard';
import { NodeAlgorithmDiagram } from './NodeAlgorithmDiagram';
import { InvestigationQuestionCard } from './InvestigationQuestionCard';
import { DetectiveResultScreen } from './DetectiveResultScreen';
import { BubulMascot } from '../BubulMascot';
import { useStore } from '../../lib/store';
import { ArrowRight, Search, Sparkles, CheckCircle2 } from 'lucide-react';

// Web Audio API Sound Trigger
const playDetectiveSound = (type: 'inspect' | 'correct' | 'wrong' | 'transform' | 'complete') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'inspect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'transform') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'complete') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {}
};

interface AlgorithmDetectiveProps {
  onBackToMenu?: () => void;
}

export const AlgorithmDetective: React.FC<AlgorithmDetectiveProps> = ({ onBackToMenu }) => {
  const { setFocusModeActive } = useStore();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Focus mode activation so global floating assistant doesn't overlap with game
  useEffect(() => {
    setFocusModeActive(true);
    return () => setFocusModeActive(false);
  }, [setFocusModeActive]);

  // Sound wrapper
  const triggerSound = (type: 'inspect' | 'correct' | 'wrong' | 'transform' | 'complete') => {
    if (soundEnabled) playDetectiveSound(type);
  };

  // Main Phase State
  const [phase, setPhase] = useState<DetectivePhase>('intro');
  const [score, setScore] = useState(0);

  // CASE 01 STATES
  const [c1EvidenceDiscovered, setC1EvidenceDiscovered] = useState<string[]>([]);
  const [c1Step, setC1Step] = useState<'evidence' | 'question' | 'explanation'>('evidence');
  const [c1SelectedOpt, setC1SelectedOpt] = useState<string | null>(null);
  const [c1Answered, setC1Answered] = useState(false);
  const [c1Correct, setC1Correct] = useState(false);
  const [c1Attempts, setC1Attempts] = useState(0);

  // CASE 02 STATES
  const [c2Step, setC2Step] = useState<'question1' | 'bubble_shown' | 'question2'>('question1');
  const [c2Q1SelectedOpt, setC2Q1SelectedOpt] = useState<string | null>(null);
  const [c2Q1Answered, setC2Q1Answered] = useState(false);
  const [c2Q1Correct, setC2Q1Correct] = useState(false);
  const [c2Q1Attempts, setC2Q1Attempts] = useState(0);

  const [c2Q2SelectedOpt, setC2Q2SelectedOpt] = useState<string | null>(null);
  const [c2Q2Answered, setC2Q2Answered] = useState(false);
  const [c2Q2Correct, setC2Q2Correct] = useState(false);
  const [c2Q2Attempts, setC2Q2Attempts] = useState(0);

  // CASE 03 STATES
  const [c3Step, setC3Step] = useState<'actions' | 'transformed_view' | 'final_eval'>('actions');
  const [c3SelectedActions, setC3SelectedActions] = useState<string[]>([]);
  const [c3ActionsEvaluated, setC3ActionsEvaluated] = useState(false);
  const [c3ActionsCorrect, setC3ActionsCorrect] = useState(false);

  const [c3FinalSelectedOpt, setC3FinalSelectedOpt] = useState<string | null>(null);
  const [c3FinalAnswered, setC3FinalAnswered] = useState(false);
  const [c3FinalCorrect, setC3FinalCorrect] = useState(false);
  const [c3FinalAttempts, setC3FinalAttempts] = useState(0);

  // Sub-scores tracking
  const [scoreAlgoAwareness, setScoreAlgoAwareness] = useState(0);
  const [scoreBubbleDetect, setScoreBubbleDetect] = useState(0);
  const [scoreInfoEval, setScoreInfoEval] = useState(0);

  // Current case index for header
  const getCaseNumber = () => {
    if (phase === 'case1') return 1;
    if (phase === 'case2') return 2;
    if (phase === 'case3' || phase === 'final_eval') return 3;
    return 1;
  };

  // --- HANDLERS: INTRO ---
  const handleStartGame = () => {
    triggerSound('inspect');
    setPhase('case1');
  };

  // --- HANDLERS: CASE 01 ---
  const handleInspectEvidence = (evidence: EvidenceItem) => {
    triggerSound('inspect');
    if (!c1EvidenceDiscovered.includes(evidence.id)) {
      setC1EvidenceDiscovered((prev) => [...prev, evidence.id]);
      setScore((prev) => prev + 5);
      setScoreAlgoAwareness((prev) => prev + 5);
    }
  };

  const handleC1AnswerSelected = (option: QuestionOption) => {
    setC1SelectedOpt(option.id);
    setC1Answered(true);
    if (option.isCorrect) {
      triggerSound('correct');
      setC1Correct(true);
      setScore((prev) => prev + 20);
      setScoreAlgoAwareness((prev) => prev + 20);
    } else {
      triggerSound('wrong');
      setC1Correct(false);
      setC1Attempts((prev) => prev + 1);
    }
  };

  const handleC1Retry = () => {
    setC1SelectedOpt(null);
    setC1Answered(false);
  };

  // --- HANDLERS: CASE 02 ---
  const handleC2Q1AnswerSelected = (option: QuestionOption) => {
    setC2Q1SelectedOpt(option.id);
    setC2Q1Answered(true);
    if (option.isCorrect) {
      triggerSound('correct');
      setC2Q1Correct(true);
      setScore((prev) => prev + 20);
      setScoreBubbleDetect((prev) => prev + 25);
    } else {
      triggerSound('wrong');
      setC2Q1Correct(false);
      setC2Q1Attempts((prev) => prev + 1);
    }
  };

  const handleC2Q1Retry = () => {
    setC2Q1SelectedOpt(null);
    setC2Q1Answered(false);
  };

  const handleC2Q2AnswerSelected = (option: QuestionOption) => {
    setC2Q2SelectedOpt(option.id);
    setC2Q2Answered(true);
    if (option.isCorrect) {
      triggerSound('correct');
      setC2Q2Correct(true);
      setScore((prev) => prev + 20);
      setScoreBubbleDetect((prev) => prev + 25);
    } else {
      triggerSound('wrong');
      setC2Q2Correct(false);
      setC2Q2Attempts((prev) => prev + 1);
    }
  };

  const handleC2Q2Retry = () => {
    setC2Q2SelectedOpt(null);
    setC2Q2Answered(false);
  };

  // --- HANDLERS: CASE 03 ---
  const handleToggleC3Action = (id: string) => {
    triggerSound('inspect');
    if (c3SelectedActions.includes(id)) {
      setC3SelectedActions((prev) => prev.filter((item) => item !== id));
    } else {
      if (c3SelectedActions.length < 2) {
        setC3SelectedActions((prev) => [...prev, id]);
      } else {
        // replace first
        setC3SelectedActions([c3SelectedActions[1], id]);
      }
    }
  };

  const handleSubmitC3Actions = () => {
    setC3ActionsEvaluated(true);
    // Correct actions are B and D
    const isExact = c3SelectedActions.includes('act-b') && c3SelectedActions.includes('act-d') && c3SelectedActions.length === 2;
    if (isExact) {
      triggerSound('correct');
      setC3ActionsCorrect(true);
      setScore((prev) => prev + 20);
      setScoreInfoEval((prev) => prev + 25);
    } else {
      triggerSound('wrong');
      setC3ActionsCorrect(false);
      // Give partial score if picked at least one right
      if (c3SelectedActions.includes('act-b') || c3SelectedActions.includes('act-d')) {
        setScore((prev) => prev + 10);
        setScoreInfoEval((prev) => prev + 10);
      }
    }
  };

  const handleShowTransformedFeed = () => {
    triggerSound('transform');
    setC3Step('transformed_view');
  };

  const handleC3FinalAnswerSelected = (option: QuestionOption) => {
    setC3FinalSelectedOpt(option.id);
    setC3FinalAnswered(true);
    if (option.isCorrect) {
      triggerSound('correct');
      setC3FinalCorrect(true);
      setScore((prev) => prev + 20);
      setScoreInfoEval((prev) => prev + 25);
    } else {
      triggerSound('wrong');
      setC3FinalCorrect(false);
      setC3FinalAttempts((prev) => prev + 1);
    }
  };

  const handleC3FinalRetry = () => {
    setC3FinalSelectedOpt(null);
    setC3FinalAnswered(false);
  };

  const handleFinishInvestigation = () => {
    triggerSound('complete');
    setPhase('result');
  };

  const handlePlayAgain = () => {
    // Reset all states
    setScore(0);
    setScoreAlgoAwareness(0);
    setScoreBubbleDetect(0);
    setScoreInfoEval(0);

    setC1EvidenceDiscovered([]);
    setC1Step('evidence');
    setC1SelectedOpt(null);
    setC1Answered(false);
    setC1Correct(false);
    setC1Attempts(0);

    setC2Step('question1');
    setC2Q1SelectedOpt(null);
    setC2Q1Answered(false);
    setC2Q1Correct(false);
    setC2Q1Attempts(0);
    setC2Q2SelectedOpt(null);
    setC2Q2Answered(false);
    setC2Q2Correct(false);
    setC2Q2Attempts(0);

    setC3Step('actions');
    setC3SelectedActions([]);
    setC3ActionsEvaluated(false);
    setC3ActionsCorrect(false);
    setC3FinalSelectedOpt(null);
    setC3FinalAnswered(false);
    setC3FinalCorrect(false);
    setC3FinalAttempts(0);

    setPhase('intro');
  };

  // Calculate percentage aspects for Result Screen
  const finalAwarenessPct = Math.min(100, Math.max(60, scoreAlgoAwareness + 50));
  const finalBubblePct = Math.min(100, Math.max(60, scoreBubbleDetect + 45));
  const finalInfoPct = Math.min(100, Math.max(60, scoreInfoEval + 45));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-indigo-50/30 to-slate-100 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Fixed Header */}
      <DetectiveHeader
        phase={phase}
        caseNumber={getCaseNumber()}
        totalCases={3}
        score={score}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onExit={onBackToMenu || (() => { window.history.back(); })}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <AnimatePresence mode="wait">
          
          {/* ========================================================= */}
          {/* PHASE 0: GAME INTRO                                      */}
          {/* ========================================================= */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <GameIntro onStart={handleStartGame} />
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* CASE 01: RAKA (WHO CREATED THIS FEED?)                    */}
          {/* ========================================================= */}
          {phase === 'case1' && (
            <motion.div
              key="case1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Case Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 sm:p-5 border border-indigo-100 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-[#031466] font-black text-xs rounded-md font-mono">
                      CASE 01
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-[#031466]">
                      “Who Created This Feed?”
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium pt-0.5">
                    Target Investigasi: Profil <strong>Raka (16 th)</strong> • Minat: Basket, Musik, Gaming
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Sparkles size={14} className="text-amber-500 fill-amber-400" />
                  <span>Petunjuk Terperiksa: <strong>{c1EvidenceDiscovered.length}/4</strong></span>
                </div>
              </div>

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Mock Smartphone Feed */}
                <div className="lg:col-span-5 flex justify-center">
                  <MockSmartphoneFeed
                    userProfile={CASE_1_PROFILE}
                    feedItems={CASE_1_FEED}
                  />
                </div>

                {/* Right Column: Investigation Workspace */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* STEP A: EVIDENCE INSPECTION */}
                  {c1Step === 'evidence' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-xl space-y-6 text-left">
                      
                      {/* Bubul Prompt */}
                      <div className="p-4 sm:p-5 bg-cyan-50/80 border border-cyan-200 rounded-2xl flex items-start gap-4 shadow-2xs">
                        <BubulMascot size="lg" expression="thinking" animate={true} />
                        <div className="space-y-1 text-xs sm:text-sm">
                          <h4 className="font-black text-[#031466]">Pesan Detektif Bubul:</h4>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            “Detektif, coba amati feed media sosial Raka di samping. Hampir seluruhnya didominasi oleh konten basket! Klik setiap kartu petunjuk telemetri di bawah untuk mencari penyebabnya.”
                          </p>
                        </div>
                      </div>

                      {/* Evidence Cards Grid */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>Daftar Bukti Digital:</span>
                          <span className="text-indigo-600 font-extrabold">Klik untuk Membuka Detail (+5 Skor)</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {CASE_1_EVIDENCE.map((evidence, idx) => (
                            <EvidenceCard
                              key={evidence.id}
                              evidence={evidence}
                              index={idx}
                              isDiscovered={c1EvidenceDiscovered.includes(evidence.id)}
                              onInspect={handleInspectEvidence}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Action Next */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            triggerSound('inspect');
                            setC1Step('question');
                          }}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#031466] hover:bg-indigo-900 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                          <Search size={18} />
                          <span>Mulai Pertanyaan Analisis</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>

                    </div>
                  )}

                  {/* STEP B: QUESTION ANALYSIS */}
                  {c1Step === 'question' && (
                    <InvestigationQuestionCard
                      type="single"
                      cognitiveLevel="C4 Analisis Hubungan Kausal"
                      question={CASE_1_QUESTION.question}
                      options={CASE_1_QUESTION.options}
                      selectedOptionId={c1SelectedOpt}
                      isAnswered={c1Answered}
                      isCorrect={c1Correct}
                      attempts={c1Attempts}
                      onAnswerSelected={handleC1AnswerSelected}
                      onRetry={handleC1Retry}
                      onNext={() => {
                        triggerSound('inspect');
                        setC1Step('explanation');
                      }}
                    />
                  )}

                  {/* STEP C: VISUAL EXPLANATION */}
                  {c1Step === 'explanation' && (
                    <NodeAlgorithmDiagram
                      onContinue={() => {
                        triggerSound('inspect');
                        setPhase('case2');
                      }}
                    />
                  )}

                </div>

              </div>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* CASE 02: NAYA (FIND THE BUBBLE)                           */}
          {/* ========================================================= */}
          {phase === 'case2' && (
            <motion.div
              key="case2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Case Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 sm:p-5 border border-cyan-100 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-cyan-100 text-cyan-900 font-black text-xs rounded-md font-mono">
                      CASE 02
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-[#031466]">
                      “Find the Bubble”
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium pt-0.5">
                    Target Investigasi: Profil <strong>Naya (17 th)</strong> • Isu: Polarisasi Opini & Filter Bubble
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200">
                  <span>🫧 Gelembung Algoritma Terdeteksi</span>
                </div>
              </div>

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Mock Smartphone Feed with Missing items and Filter Bubble overlay */}
                <div className="lg:col-span-5 flex justify-center">
                  <MockSmartphoneFeed
                    userProfile={CASE_2_PROFILE}
                    feedItems={CASE_2_FEED}
                    missingItems={CASE_2_MISSING_FEED}
                    showBubbleOverlay={c2Step === 'bubble_shown' || c2Step === 'question2'}
                    bubbleLabel="FILTER BUBBLE AKTIF"
                  />
                </div>

                {/* Right Column: Investigation Workspace */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* QUESTION 1: WHAT'S MISSING & FILTER BUBBLE RISK */}
                  {c2Step === 'question1' && (
                    <InvestigationQuestionCard
                      type="single"
                      cognitiveLevel="C4 Analisis Dampak Filter Bubble"
                      question={CASE_2_QUESTION_1.question}
                      options={CASE_2_QUESTION_1.options}
                      selectedOptionId={c2Q1SelectedOpt}
                      isAnswered={c2Q1Answered}
                      isCorrect={c2Q1Correct}
                      attempts={c2Q1Attempts}
                      onAnswerSelected={handleC2Q1AnswerSelected}
                      onRetry={handleC2Q1Retry}
                      onNext={() => {
                        triggerSound('transform');
                        setC2Step('bubble_shown');
                      }}
                    />
                  )}

                  {/* BUBBLE SHOWN INTERLUDE CARD */}
                  {c2Step === 'bubble_shown' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cyan-200 shadow-xl space-y-6 text-left">
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-300 rounded-2xl flex items-start gap-4 shadow-sm">
                        <BubulMascot size="lg" expression="sparkle" animate={true} />
                        <div className="space-y-1 text-xs sm:text-sm">
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-200/60 px-2 py-0.5 rounded">
                            Definisi Konseptual
                          </span>
                          <h4 className="font-black text-[#031466]">
                            Apa itu Filter Bubble?
                          </h4>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            “<strong>Filter Bubble</strong> terjadi ketika sistem personalisasi berulang kali hanya menyajikan informasi yang cocok dengan perilaku dan opini pengguna di masa lalu, sehingga menyembunyikan sudut pandang alternatif.”
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                        <h5 className="font-bold text-[#031466]">Perhatikan bagian smartphone di sebelah kiri:</h5>
                        <p>
                          Feed Naya sekarang dikelilingi oleh batas transparan <em>Filter Bubble</em>. Perhatikan juga kotak merah putus-putus berisi <strong>konten yang hilang (tidak pernah muncul)</strong> seperti opini Kubu B, analisis netral, dan data statistik.
                        </p>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            triggerSound('inspect');
                            setC2Step('question2');
                          }}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#031466] hover:bg-indigo-900 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                          <span>Lanjut ke Solusi Pemecahan Bubble</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* QUESTION 2: ACTION TO BREAK THE BUBBLE */}
                  {c2Step === 'question2' && (
                    <InvestigationQuestionCard
                      type="single"
                      cognitiveLevel="C5 Evaluasi Keputusan & Solusi"
                      question={CASE_2_QUESTION_2.question}
                      options={CASE_2_QUESTION_2.options}
                      selectedOptionId={c2Q2SelectedOpt}
                      isAnswered={c2Q2Answered}
                      isCorrect={c2Q2Correct}
                      attempts={c2Q2Attempts}
                      onAnswerSelected={handleC2Q2AnswerSelected}
                      onRetry={handleC2Q2Retry}
                      onNext={() => {
                        triggerSound('inspect');
                        setPhase('case3');
                      }}
                    />
                  )}

                </div>

              </div>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* CASE 03: DIMAS (CHANGE THE FEED)                          */}
          {/* ========================================================= */}
          {phase === 'case3' && (
            <motion.div
              key="case3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Case Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 sm:p-5 border border-indigo-100 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-900 font-black text-xs rounded-md font-mono">
                      CASE 03 • FINAL CHALLENGE
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-[#031466]">
                      “Change the Feed”
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium pt-0.5">
                    Target Investigasi: Profil <strong>Dimas (16 th)</strong> • Misi: Memperluas Keberagaman Sudut Pandang
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                  <span>⚡ Tantangan Evaluasi C5</span>
                </div>
              </div>

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Mock Smartphone Feed */}
                <div className="lg:col-span-5 flex justify-center">
                  <MockSmartphoneFeed
                    userProfile={CASE_3_PROFILE}
                    feedItems={c3Step === 'transformed_view' || c3Step === 'final_eval' ? CASE_3_TRANSFORMED_FEED : CASE_3_INITIAL_FEED}
                    isTransformed={c3Step === 'transformed_view' || c3Step === 'final_eval'}
                  />
                </div>

                {/* Right Column: Investigation Workspace */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* STEP A: MULTI-SELECT ACTIONS */}
                  {c3Step === 'actions' && (
                    <InvestigationQuestionCard
                      type="multi"
                      title="Dimas ingin mendapatkan informasi yang lebih beragam di linimasanya. Tindakan apa yang harus ia ambil?"
                      subtitle="Pilihlah 2 opsi tindakan yang paling bijak dan efektif untuk mendiversifikasi rekomendasi algoritma."
                      actionCards={CASE_3_ACTION_CARDS}
                      selectedActionIds={c3SelectedActions}
                      onToggleAction={handleToggleC3Action}
                      onSubmitActions={handleSubmitC3Actions}
                      onNext={handleShowTransformedFeed}
                      isEvaluated={c3ActionsEvaluated}
                      isCorrect={c3ActionsCorrect}
                    />
                  )}

                  {/* STEP B: TRANSFORMED FEED VIEW & EXPLANATION */}
                  {c3Step === 'transformed_view' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6 text-left">
                      
                      {/* Success Box */}
                      <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-4 shadow-sm">
                        <BubulMascot size="lg" expression="happy" animate={true} />
                        <div className="space-y-1 text-xs sm:text-sm">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                            Transformasi Berhasil
                          </span>
                          <h4 className="font-black text-emerald-950">
                            Feed Dimas Kini Beragam!
                          </h4>
                          <p className="text-emerald-900 leading-relaxed font-medium">
                            “Pilihan tindakanmu berhasil mendiversifikasi sinyal yang dibaca algoritma! Kini feed Dimas tidak lagi hanya berisi basket, melainkan memuat berita lingkungan, game logika, sains AI, dan forum diskusi terbuka.”
                          </p>
                        </div>
                      </div>

                      {/* Before / After Comparison */}
                      <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                          <span className="text-slate-400">SEBELUM KEPUTUSAN:</span>
                          <span className="text-amber-400">🏀 🏀 🏀 🏀 🏀 (Homogen)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold pt-1">
                          <span className="text-emerald-400">SESUDAH KEPUTUSAN:</span>
                          <span className="text-emerald-300">🏀 📰 🎮 🏫 💬 (Beragam)</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            triggerSound('inspect');
                            setC3Step('final_eval');
                          }}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#031466] hover:bg-indigo-900 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                          <span>Lanjut ke Kasus Evaluasi Akhir</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>

                    </div>
                  )}

                  {/* STEP C: FINAL CHALLENGE C5 QUESTION */}
                  {c3Step === 'final_eval' && (
                    <InvestigationQuestionCard
                      type="single"
                      cognitiveLevel="C5 Evaluasi Tingkat Mahir"
                      question={CASE_3_FINAL_CHALLENGE.situation}
                      options={CASE_3_FINAL_CHALLENGE.options}
                      selectedOptionId={c3FinalSelectedOpt}
                      isAnswered={c3FinalAnswered}
                      isCorrect={c3FinalCorrect}
                      attempts={c3FinalAttempts}
                      onAnswerSelected={handleC3FinalAnswerSelected}
                      onRetry={handleC3FinalRetry}
                      onNext={handleFinishInvestigation}
                    />
                  )}

                </div>

              </div>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* PHASE: RESULT & REFLECTION SCREEN                         */}
          {/* ========================================================= */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <DetectiveResultScreen
                score={score}
                algorithmAwareness={finalAwarenessPct}
                bubbleDetection={finalBubblePct}
                infoEvaluation={finalInfoPct}
                onPlayAgain={handlePlayAgain}
                onBackToMenu={onBackToMenu || (() => { window.history.back(); })}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

    </div>
  );
};

export default AlgorithmDetective;
