import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  CornerDownRight, 
  Send, 
  Sparkles, 
  Search, 
  Filter, 
  PlusCircle, 
  X, 
  AlertCircle, 
  Clock, 
  ThumbsUp, 
  Flag, 
  Trash2, 
  ChevronLeft, 
  HelpCircle,
  Compass,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Eye,
  MessageCircleQuestion,
  Lightbulb,
  Dices
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { db, collection, doc, setDoc, onSnapshot, deleteDoc, updateDoc, increment } from '../lib/firebase';

// --- INTERFACES ---
export interface ForumDiscussion {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isGuest?: boolean;
  createdAt: number;
  updatedAt?: number;
  replyCount: number;
  likesCount?: number;
  isPinned?: boolean;
}

export interface ForumComment {
  id: string;
  discussionId: string;
  parentCommentId: string | null;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isGuest?: boolean;
  content: string;
  createdAt: number;
  likesCount?: number;
  isReported?: boolean;
}

// Ide pemantik materi OutBubble (hanya sebagai saran cepat di modal formulir)
const PROMPT_SUGGESTIONS = [
  {
    category: "Algoritma Media Sosial",
    title: "Apakah algoritma media sosial membantu kita mendapatkan informasi yang kita butuhkan, atau justru membatasi informasi yang kita lihat?",
    content: "Algoritma rekomendasi di berbagai platform seperti TikTok, Instagram, dan YouTube terus menyajikan konten sesuai minat kita. Di satu sisi memudahkan, tapi di sisi lain apakah kita perlahan terkunci dalam satu cara pandang?"
  },
  {
    category: "Filter Bubble",
    title: "Pernahkah kamu menemukan informasi yang berbeda dari apa yang biasanya muncul di media sosialmu? Bagaimana kamu menyikapinya?",
    content: "Saat melihat beranda orang lain atau mencari topik tanpa login, seringkali narasinya berbeda dari feed harian kita. Bagaimana kita melatih diri agar tidak mudah curiga atau menolak informasi berbeda?"
  },
  {
    category: "Echo Chamber",
    title: "Apakah kita lebih mudah menerima pendapat dari orang yang memiliki pandangan yang sama dengan kita? Mengapa?",
    content: "Konfirmasi bias membuat kita nyaman di lingkaran yang sepemikiran. Apa dampak jangka panjangnya jika kita tidak pernah membiasakan diri mendengar argumen pihak lain?"
  },
  {
    category: "Keterbukaan Perspektif",
    title: "Menurutmu, apakah melihat pendapat yang berbeda dapat membantu kita memahami suatu masalah dengan lebih baik?",
    content: "Banyak persoalan sosial tidak hitam-putih. Apakah dengan mempelajari alasan di balik pendapat orang lain, nalar kritis dan empati kita bisa berkembang?"
  },
  {
    category: "Verifikasi & Nalar Kritis",
    title: "Bagaimana cara kita mengetahui apakah informasi yang kita lihat di media sosial dapat dipercaya?",
    content: "Banyak narasi viral dan emosional yang belum terverifikasi. Apa langkah awalmu saat menemui berita mengejutkan sebelum memutuskan percaya atau membagikannya?"
  }
];

// Helper to format relative time in Indonesian
function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const CATEGORIES = [
  "Semua Kategori",
  "Algoritma Media Sosial",
  "Filter Bubble",
  "Echo Chamber",
  "Keterbukaan Perspektif",
  "Verifikasi & Nalar Kritis",
  "Umum"
];

const ForumDiskusi: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addXP, rerollGuestUsername } = useStore();
  const [isRerollingName, setIsRerollingName] = useState(false);

  const handleRerollName = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsRerollingName(true);
    const newName = rerollGuestUsername();
    showToast(`Username tamu berhasil diacak: ${newName} 🎲`);
    setTimeout(() => setIsRerollingName(false), 800);
  };

  // Selected discussion view (null = list view, ID = detail view)
  const activeTopicId = searchParams.get('topic');
  const initialCatParam = searchParams.get('category') || searchParams.get('cat');

  // Discussions State - Murni kosong sampai ada yang mengunggah
  const [discussions, setDiscussions] = useState<ForumDiscussion[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCatParam || 'Semua Kategori');
  const [sortBy, setSortBy] = useState<'newest' | 'replies' | 'likes'>('newest');

  // New Discussion Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState(initialCatParam || 'Algoritma Media Sosial');
  const [formError, setFormError] = useState('');

  // Comment & Reply State for Detail View
  const [mainCommentText, setMainCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // UI Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync category param from URL if changed
  useEffect(() => {
    if (initialCatParam && CATEGORIES.includes(initialCatParam)) {
      setSelectedCategory(initialCatParam);
      setNewCategory(initialCatParam);
    }
  }, [initialCatParam]);

  // --- 1. FIRESTORE REAL-TIME SYNC FOR DISCUSSIONS ---
  useEffect(() => {
    // Read local cache first (filter out legacy seed dummies if any)
    try {
      const localDiscs = localStorage.getItem('outbubble_forum_discussions');
      if (localDiscs) {
        const parsed = JSON.parse(localDiscs);
        if (Array.isArray(parsed)) {
          // Keep only user-created items (not seed-*)
          const validUserDiscs = parsed.filter((d: any) => d.id && !d.id.startsWith('disc-1') && !d.id.startsWith('disc-2') && !d.id.startsWith('disc-3') && !d.id.startsWith('disc-4') && !d.id.startsWith('disc-5') && d.authorId !== 'seed-author-1');
          setDiscussions(validUserDiscs);
          localStorage.setItem('outbubble_forum_discussions', JSON.stringify(validUserDiscs));
        }
      }
    } catch (e) {}

    // Firestore listener
    let unsub = () => {};
    try {
      const discCol = collection(db, "forum_discussions");
      unsub = onSnapshot(discCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: ForumDiscussion[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as ForumDiscussion;
            // Only real user items
            if (data.id && !data.id.startsWith('seed-')) {
              list.push(data);
            }
          });
          setDiscussions(list);
          try {
            localStorage.setItem('outbubble_forum_discussions', JSON.stringify(list));
          } catch (e) {}
        } else {
          setDiscussions([]);
          try {
            localStorage.setItem('outbubble_forum_discussions', JSON.stringify([]));
          } catch (e) {}
        }
      }, (err) => {
        console.warn("Firestore discussions sync:", err);
      });
    } catch (err) {
      console.warn("Firestore error:", err);
    }

    return () => unsub();
  }, []);

  // --- 2. FIRESTORE REAL-TIME SYNC FOR COMMENTS ---
  useEffect(() => {
    // Read local cache first
    try {
      const localComms = localStorage.getItem('outbubble_forum_comments');
      if (localComms) {
        const parsed = JSON.parse(localComms);
        if (Array.isArray(parsed)) {
          const validUserComms = parsed.filter((c: any) => c.id && !c.id.startsWith('comm-1-') && !c.id.startsWith('comm-2-') && !c.id.startsWith('comm-4-'));
          setComments(validUserComms);
          localStorage.setItem('outbubble_forum_comments', JSON.stringify(validUserComms));
        }
      }
    } catch (e) {}

    let unsubComms = () => {};
    try {
      const commCol = collection(db, "forum_comments");
      unsubComms = onSnapshot(commCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: ForumComment[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as ForumComment;
            if (data.id && !data.id.startsWith('comm-1-') && !data.id.startsWith('comm-2-') && !data.id.startsWith('comm-4-')) {
              list.push(data);
            }
          });
          setComments(list);
          try {
            localStorage.setItem('outbubble_forum_comments', JSON.stringify(list));
          } catch (e) {}
        } else {
          setComments([]);
          try {
            localStorage.setItem('outbubble_forum_comments', JSON.stringify([]));
          } catch (e) {}
        }
      }, (err) => {
        console.warn("Firestore comments sync:", err);
      });
    } catch (err) {
      console.warn("Firestore error:", err);
    }

    return () => unsubComms();
  }, []);

  // Active Discussion
  const currentDiscussion = useMemo(() => {
    if (!activeTopicId) return null;
    return discussions.find(d => d.id === activeTopicId) || null;
  }, [activeTopicId, discussions]);

  // Filtered Discussions
  const filteredDiscussions = useMemo(() => {
    return discussions
      .filter((d) => {
        const matchQuery = 
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.authorName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = selectedCategory === 'Semua Kategori' || d.category === selectedCategory;
        return matchQuery && matchCat;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'replies') return (b.replyCount || 0) - (a.replyCount || 0);
        if (sortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
        return 0;
      });
  }, [discussions, searchQuery, selectedCategory, sortBy]);

  // Current Discussion Comments Tree
  const discussionComments = useMemo(() => {
    if (!activeTopicId) return [];
    return comments.filter(c => c.discussionId === activeTopicId);
  }, [activeTopicId, comments]);

  // Helper to construct nested tree of comments
  interface NestedComment extends ForumComment {
    replies: NestedComment[];
  }

  const commentTree = useMemo(() => {
    const map = new Map<string, NestedComment>();
    const roots: NestedComment[] = [];

    discussionComments.forEach(c => {
      map.set(c.id, { ...c, replies: [] });
    });

    discussionComments.forEach(c => {
      const node = map.get(c.id);
      if (node) {
        if (c.parentCommentId && map.has(c.parentCommentId)) {
          map.get(c.parentCommentId)!.replies.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    // Sort roots & replies by createdAt (chronological for natural discussion flow)
    const sortTree = (list: NestedComment[]) => {
      list.sort((a, b) => a.createdAt - b.createdAt);
      list.forEach(item => {
        if (item.replies.length > 0) sortTree(item.replies);
      });
    };

    sortTree(roots);
    return roots;
  }, [discussionComments]);

  // --- ACTIONS ---

  // 1. Create New Topic
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Judul diskusi tidak boleh kosong.');
      return;
    }
    if (newTitle.trim().length < 8) {
      setFormError('Judul diskusi minimal 8 karakter agar jelas.');
      return;
    }
    if (!newContent.trim()) {
      setFormError('Isi / pandangan diskusi tidak boleh kosong.');
      return;
    }

    const currentAuthorName = user?.username || `Penjelajah_#${Math.floor(1000 + Math.random() * 9000)}`;
    const currentAuthorAvatar = user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`;
    const currentAuthorId = user?.id || `user-guest-${Date.now()}`;

    const newDisc: ForumDiscussion = {
      id: `disc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      authorId: currentAuthorId,
      authorName: currentAuthorName,
      authorAvatar: currentAuthorAvatar,
      isGuest: !!user?.isGuest,
      createdAt: Date.now(),
      replyCount: 0,
      likesCount: 1,
      isPinned: false
    };

    // 1. Local update
    const updatedDiscussions = [newDisc, ...discussions];
    setDiscussions(updatedDiscussions);
    try {
      localStorage.setItem('outbubble_forum_discussions', JSON.stringify(updatedDiscussions));
    } catch (e) {}

    // 2. Firestore update
    try {
      await setDoc(doc(db, "forum_discussions", newDisc.id), newDisc);
    } catch (e) {
      console.warn("Firestore save topic error:", e);
    }

    // Reward XP
    if (addXP) addXP(30);

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setFormError('');
    setIsCreateModalOpen(false);
    showToast("Diskusi berhasil dibuat!");

    // Navigate to the newly created discussion
    setSearchParams({ topic: newDisc.id });
  };

  // 2. Add Top-Level Comment
  const handleSendMainComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainCommentText.trim() || !activeTopicId) return;

    const currentAuthorName = user?.username || `Penjelajah_#${Math.floor(1000 + Math.random() * 9000)}`;
    const currentAuthorAvatar = user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`;
    const currentAuthorId = user?.id || `user-guest-${Date.now()}`;

    const newComm: ForumComment = {
      id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      discussionId: activeTopicId,
      parentCommentId: null,
      authorId: currentAuthorId,
      authorName: currentAuthorName,
      authorAvatar: currentAuthorAvatar,
      isGuest: !!user?.isGuest,
      content: mainCommentText.trim(),
      createdAt: Date.now(),
      likesCount: 0
    };

    // Update comments
    const updatedComments = [...comments, newComm];
    setComments(updatedComments);
    try {
      localStorage.setItem('outbubble_forum_comments', JSON.stringify(updatedComments));
    } catch (e) {}

    // Increment reply count on discussion
    const updatedDiscs = discussions.map(d => 
      d.id === activeTopicId ? { ...d, replyCount: (d.replyCount || 0) + 1 } : d
    );
    setDiscussions(updatedDiscs);
    try {
      localStorage.setItem('outbubble_forum_discussions', JSON.stringify(updatedDiscs));
    } catch (e) {}

    // Firestore update
    try {
      await setDoc(doc(db, "forum_comments", newComm.id), newComm);
      await updateDoc(doc(db, "forum_discussions", activeTopicId), {
        replyCount: increment(1)
      });
    } catch (e) {
      console.warn("Firestore comment save error:", e);
    }

    if (addXP) addXP(20);
    setMainCommentText('');
    showToast("Tanggapan berhasil dikirim.");
  };

  // 3. Add Nested Reply
  const handleSendReply = async (parentCommentId: string) => {
    if (!replyText.trim() || !activeTopicId) return;

    const currentAuthorName = user?.username || `Penjelajah_#${Math.floor(1000 + Math.random() * 9000)}`;
    const currentAuthorAvatar = user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`;
    const currentAuthorId = user?.id || `user-guest-${Date.now()}`;

    const newReply: ForumComment = {
      id: `reply-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      discussionId: activeTopicId,
      parentCommentId: parentCommentId,
      authorId: currentAuthorId,
      authorName: currentAuthorName,
      authorAvatar: currentAuthorAvatar,
      isGuest: !!user?.isGuest,
      content: replyText.trim(),
      createdAt: Date.now(),
      likesCount: 0
    };

    const updatedComments = [...comments, newReply];
    setComments(updatedComments);
    try {
      localStorage.setItem('outbubble_forum_comments', JSON.stringify(updatedComments));
    } catch (e) {}

    const updatedDiscs = discussions.map(d => 
      d.id === activeTopicId ? { ...d, replyCount: (d.replyCount || 0) + 1 } : d
    );
    setDiscussions(updatedDiscs);
    try {
      localStorage.setItem('outbubble_forum_discussions', JSON.stringify(updatedDiscs));
    } catch (e) {}

    try {
      await setDoc(doc(db, "forum_comments", newReply.id), newReply);
      await updateDoc(doc(db, "forum_discussions", activeTopicId), {
        replyCount: increment(1)
      });
    } catch (e) {
      console.warn("Firestore reply save error:", e);
    }

    if (addXP) addXP(25);
    setReplyingToCommentId(null);
    setReplyText('');
    showToast("Tanggapan balasan berhasil dikirim.");
  };

  // 4. Delete own comment
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus tanggapan ini?")) return;

    const updatedComments = comments.filter(c => c.id !== commentId && c.parentCommentId !== commentId);
    setComments(updatedComments);
    try {
      localStorage.setItem('outbubble_forum_comments', JSON.stringify(updatedComments));
    } catch (e) {}

    try {
      await deleteDoc(doc(db, "forum_comments", commentId));
    } catch (e) {
      console.warn("Firestore delete comment error:", e);
    }
    showToast("Tanggapan berhasil dihapus.");
  };

  // 5. Report comment
  const handleReportComment = (commentId: string) => {
    showToast("Terima kasih. Laporan telah dicatat untuk peninjauan moderator.");
  };

  // 6. Like Discussion
  const handleLikeDiscussion = async (discId: string) => {
    const updated = discussions.map(d => {
      if (d.id === discId) {
        return { ...d, likesCount: (d.likesCount || 0) + 1 };
      }
      return d;
    });
    setDiscussions(updated);
    try {
      localStorage.setItem('outbubble_forum_discussions', JSON.stringify(updated));
      await updateDoc(doc(db, "forum_discussions", discId), {
        likesCount: increment(1)
      });
    } catch (e) {}
    showToast("Apresiasi sudut pandang tercatat 👍");
  };

  return (
    <div id="forum-diskusi-container" className="space-y-6 sm:space-y-8 pb-16 font-sans max-w-6xl mx-auto">
      
      {/* TOAST FEEDBACK NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[120] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-500/40 flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-extrabold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: BUAT DISKUSI BARU */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border-4 border-white w-full max-w-xl overflow-hidden my-8 p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <PlusCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-display">Mulai Topik Diskusi Baru</h3>
                    <p className="text-xs text-slate-500 font-medium">Buka ruang dialektika & pertukaran sudut pandang</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateTopic} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1.5">
                    Kategori Topik
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-bold text-xs sm:text-sm transition-all text-slate-800"
                  >
                    <option value="Algoritma Media Sosial">Algoritma Media Sosial</option>
                    <option value="Filter Bubble">Filter Bubble</option>
                    <option value="Echo Chamber">Echo Chamber</option>
                    <option value="Keterbukaan Perspektif">Keterbukaan Perspektif</option>
                    <option value="Verifikasi & Nalar Kritis">Verifikasi & Nalar Kritis</option>
                    <option value="Umum">Isu Digital Umum</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-black uppercase text-slate-500">
                      Judul Diskusi / Pertanyaan Utama *
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold">{newTitle.length}/150</span>
                  </div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    maxLength={150}
                    placeholder="Contoh: Mengapa kita cenderung mencari berita yang sesuai keinginan kita?"
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-medium text-xs sm:text-sm transition-all text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-black uppercase text-slate-500">
                      Uraian Pandangan / Konteks *
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold">{newContent.length}/1000</span>
                  </div>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    maxLength={1000}
                    placeholder="Jelaskan alasan pemikiranmu atau pertanyaan pemantik agar teman-teman dapat menanggapi secara konstruktif..."
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#031466] focus:bg-white outline-none font-normal text-xs sm:text-sm leading-relaxed transition-all text-slate-800"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 font-medium flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-600 shrink-0" />
                    <span>
                      Identitasmu: <strong className="text-indigo-900">{user?.username || 'Penjelajah'}</strong>
                    </span>
                  </div>
                  {user?.isGuest && (
                    <button
                      type="button"
                      onClick={handleRerollName}
                      className={cn(
                        "px-2.5 py-1 bg-amber-200/70 hover:bg-amber-300/80 text-amber-900 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer",
                        isRerollingName && "animate-spin"
                      )}
                    >
                      <Dices size={12} />
                      <span>Acak Nama Tamu 🎲</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#031466] hover:bg-blue-900 text-white font-black rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={16} />
                    Publikasikan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 1. JIKA TIDAK ADA ACTIVE TOPIC: TAMPILKAN DAFTAR FORUM UTAMA */}
      {/* ============================================================ */}
      {!activeTopicId && (
        <>
          {/* HEADER FORUM DISKUSI */}
          <div className="bg-gradient-to-br from-[#031466] via-indigo-950 to-[#031466] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-white/10">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-black uppercase tracking-wider">
                  <MessageSquare size={14} className="text-cyan-300" />
                  Ruang Pertukaran Perspektif
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight leading-tight">
                  Forum Diskusi
                </h1>
                <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
                  Tempat untuk berbagi pandangan, melihat perspektif lain, dan berdiskusi secara kritis mengenai informasi di ruang digital.
                </p>
              </div>

              <button
                id="btn-create-discussion"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm flex items-center gap-2.5 shrink-0 border border-emerald-400/40 cursor-pointer"
              >
                <PlusCircle size={18} />
                + Buat Diskusi
              </button>
            </div>

            {/* PANDUAN NALAR KRITIS EDUKATIF */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-cyan-300 shrink-0 font-bold text-xs">01</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Analisis Argumen</h4>
                  <p className="text-[11px] text-slate-300">Pahami alasan & landasan di balik pendapat orang lain.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 shrink-0 font-bold text-xs">02</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Evaluasi Nalar</h4>
                  <p className="text-[11px] text-slate-300">Uji apakah fakta atau logika yang diajukan masuk akal.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0 font-bold text-xs">03</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Keterbukaan Perspektif</h4>
                  <p className="text-[11px] text-slate-300">Hormati perbedaan dan perkaya wawasan bersama.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH, CATEGORY PILLS & SORT CONTROLS */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* SEARCH INPUT */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari topik diskusi, pertanyaan, atau kata kunci..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-medium text-xs sm:text-sm text-slate-800 focus:border-[#031466] focus:ring-2 focus:ring-indigo-100 outline-none shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* SORT CONTROLLER */}
              <div className="flex items-center gap-2 shrink-0 bg-white p-1 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 pl-3 hidden sm:inline">Urutkan:</span>
                <button
                  onClick={() => setSortBy('newest')}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    sortBy === 'newest' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Terbaru
                </button>
                <button
                  onClick={() => setSortBy('replies')}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    sortBy === 'replies' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Paling Aktif
                </button>
                <button
                  onClick={() => setSortBy('likes')}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    sortBy === 'likes' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Terpopuler
                </button>
              </div>
            </div>

            {/* CATEGORY FILTER PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border",
                    selectedCategory === cat
                      ? "bg-[#031466] text-white border-[#031466] shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* DAFTAR TOPIK DISKUSI (CARD GRID/LIST) */}
          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              /* KONDISI KOSONG */
              <div className="bg-white rounded-[32px] p-10 sm:p-14 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <MessageSquare size={32} />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-lg font-black text-slate-900 font-display">Belum ada diskusi</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Jadilah orang pertama yang membagikan pandanganmu mengenai literasi digital dan ruang gema informasi!
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3.5 bg-[#031466] hover:bg-blue-900 text-white font-black rounded-2xl shadow-md text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <PlusCircle size={16} />
                  + Mulai Diskusi
                </button>
              </div>
            ) : (
              /* DAFTAR KARTU TOPIK */
              filteredDiscussions.map((topic) => (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all text-left group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {topic.category || "Topik Diskusi"}
                      </span>
                      {topic.isPinned && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                          📌 Pilihan Redaksi
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold shrink-0">
                      <Clock size={14} />
                      <span>{formatRelativeTime(topic.createdAt)}</span>
                    </div>
                  </div>

                  {/* TITLE & CONTENT PREVIEW */}
                  <h3 
                    onClick={() => setSearchParams({ topic: topic.id })}
                    className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-snug font-display mb-2"
                  >
                    {topic.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-5 font-normal">
                    {topic.content}
                  </p>

                  {/* FOOTER INFO & ACTION */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs overflow-hidden shrink-0">
                        {topic.authorAvatar && topic.authorAvatar.startsWith('http') ? (
                          <img src={topic.authorAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-slate-700">{topic.authorName.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900">{topic.authorName}</span>
                        <span className="text-slate-400 text-[10px] block">
                          {topic.isGuest ? 'Persona Siswa' : 'Kontributor'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-xl border border-slate-100">
                          <MessageSquare size={14} className="text-indigo-600" />
                          {topic.replyCount || 0} Tanggapan
                        </span>
                      </div>

                      <button
                        onClick={() => setSearchParams({ topic: topic.id })}
                        className="px-4 py-2 bg-[#031466] hover:bg-indigo-900 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        Lihat Diskusi
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* 2. JIKA ADA ACTIVE TOPIC: TAMPILKAN DETAIL DISKUSI + BALASAN */}
      {/* ============================================================ */}
      {activeTopicId && currentDiscussion && (
        <div className="space-y-6 text-left">
          {/* TOMBOL KEMBALI */}
          <button
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft size={16} />
            &larr; Kembali ke Semua Topik Forum
          </button>

          {/* MAIN TOPIC CARD HEADER */}
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs overflow-hidden shrink-0">
                  {currentDiscussion.authorAvatar && currentDiscussion.authorAvatar.startsWith('http') ? (
                    <img src={currentDiscussion.authorAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-indigo-900">{currentDiscussion.authorName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{currentDiscussion.authorName}</h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-100 text-slate-600">
                      {currentDiscussion.isGuest ? 'Siswa / Tamu' : 'Member'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs font-medium">
                    Dipublikasikan {formatRelativeTime(currentDiscussion.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {currentDiscussion.category}
                </span>
              </div>
            </div>

            {/* TOPIC CONTENT */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-display leading-tight">
                {currentDiscussion.title}
              </h1>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100">
                {currentDiscussion.content}
              </p>
            </div>

            {/* TOPIC ACTIONS */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={16} className="text-indigo-600" />
                  {discussionComments.length} Tanggapan Diskusi
                </span>
              </div>

              <button
                onClick={() => handleLikeDiscussion(currentDiscussion.id)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <ThumbsUp size={14} className="text-indigo-600" />
                Apresiasi Topik ({currentDiscussion.likesCount || 0})
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION DISKUSI & TANGGAPAN */}
          {/* ============================================================ */}
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-200 shadow-md space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  Diskusi ({discussionComments.length})
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Semua tanggapan bersifat terbuka dan dapat dibaca oleh seluruh warga OutBubble.
                </p>
              </div>

              {/* MINDSET REMINDER BOX */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl max-w-md text-left flex items-start gap-2.5">
                <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 font-medium leading-tight">
                  “Sampaikan pendapat dengan sopan dan hormati perspektif yang berbeda. Sudahkah kamu memahami sudut pandang orang lain sebelum memberikan tanggapan?”
                </p>
              </div>
            </div>

            {/* FORM INPUT TANGGAPAN UTAMA */}
            <form onSubmit={handleSendMainComment} className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#031466] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {user?.photoUrl && user.photoUrl.startsWith('http') ? (
                      <img src={user.photoUrl} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user?.username || 'P').slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    Tulis tanggapan sebagai: <span className="text-indigo-600 font-black">{user?.username || 'Penjelajah'}</span>
                  </span>
                </div>

                {user?.isGuest && (
                  <button
                    type="button"
                    onClick={handleRerollName}
                    title="Ganti nama tamu sebelum berkomentar"
                    className={cn(
                      "px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-indigo-200/60",
                      isRerollingName && "animate-spin"
                    )}
                  >
                    <Dices size={12} />
                    <span>Acak USN 🎲</span>
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                value={mainCommentText}
                onChange={(e) => setMainCommentText(e.target.value)}
                placeholder="Bagikan analisis, sudut pandang alternatif, atau pengalamanmu mengenai isu ini..."
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-normal text-slate-800 outline-none focus:border-[#031466] focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 font-medium">
                  Gunakan argumen yang rasional & berbobot
                </span>
                <button
                  type="submit"
                  disabled={!mainCommentText.trim()}
                  className="px-5 py-2.5 bg-[#031466] hover:bg-blue-900 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Send size={14} />
                  Kirim Tanggapan
                </button>
              </div>
            </form>

            {/* DAFTAR KOMENTAR & NESTED REPLIES */}
            <div className="space-y-6 pt-2">
              {commentTree.length === 0 ? (
                /* EMPTY COMMENTS */
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <MessageCircleQuestion size={36} className="mx-auto text-slate-300" />
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    Belum ada tanggapan. Bagikan pandanganmu untuk memulai diskusi!
                  </p>
                </div>
              ) : (
                /* RECURSIVE COMMENT TREE RENDER */
                commentTree.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={user?.id}
                    replyingToCommentId={replyingToCommentId}
                    setReplyingToCommentId={setReplyingToCommentId}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onSendReply={handleSendReply}
                    onDeleteComment={handleDeleteComment}
                    onReportComment={handleReportComment}
                    level={0}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- RECURSIVE NESTED COMMENT COMPONENT ---
interface CommentItemProps {
  comment: ForumComment & { replies: any[] };
  currentUserId?: string;
  replyingToCommentId: string | null;
  setReplyingToCommentId: (id: string | null) => void;
  replyText: string;
  setReplyText: (txt: string) => void;
  onSendReply: (parentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onReportComment: (commentId: string) => void;
  level: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  replyingToCommentId,
  setReplyingToCommentId,
  replyText,
  setReplyText,
  onSendReply,
  onDeleteComment,
  onReportComment,
  level
}) => {
  const isReplying = replyingToCommentId === comment.id;
  const isMyComment = currentUserId && comment.authorId === currentUserId;

  // Maximum visual nesting indentation to prevent over-constraining mobile screens
  const indentClass = level === 0 ? "" : level === 1 ? "ml-4 sm:ml-8 border-l-2 border-indigo-200 pl-4 sm:pl-5 mt-4" : "ml-4 sm:ml-8 border-l-2 border-slate-200 pl-3 sm:pl-4 mt-3";

  return (
    <div className={cn("space-y-3", indentClass)}>
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-left">
        {/* COMMENT HEADER */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-800 overflow-hidden shrink-0">
              {comment.authorAvatar && comment.authorAvatar.startsWith('http') ? (
                <img src={comment.authorAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{comment.authorName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">{comment.authorName}</span>
                {comment.isGuest && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    Tamu
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {isMyComment && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                title="Hapus Tanggapan Saya"
                className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={() => onReportComment(comment.id)}
              title="Laporkan konten tidak pantas"
              className="p-1.5 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            >
              <Flag size={14} />
            </button>
          </div>
        </div>

        {/* COMMENT BODY */}
        <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-line mb-3">
          {comment.content}
        </p>

        {/* REPLY BUTTON */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100/80">
          <button
            onClick={() => {
              if (isReplying) {
                setReplyingToCommentId(null);
                setReplyText('');
              } else {
                setReplyingToCommentId(comment.id);
                setReplyText('');
              }
            }}
            className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-indigo-50 transition-all cursor-pointer"
          >
            <CornerDownRight size={13} />
            {isReplying ? 'Batal Balas' : 'Reply'}
          </button>
        </div>
      </div>

      {/* INLINE REPLY INPUT FORM */}
      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-4 sm:ml-8 p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2 text-left"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span className="flex items-center gap-1.5">
                <CornerDownRight size={14} />
                Membalas tanggapan <strong>{comment.authorName}</strong>
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">
                Pikirkan sudut pandang lawan bicara
              </span>
            </div>

            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis tanggapanmu..."
              className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-xs sm:text-sm font-normal text-slate-800 outline-none focus:border-[#031466] focus:ring-2 focus:ring-indigo-200 transition-all"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setReplyingToCommentId(null);
                  setReplyText('');
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => onSendReply(comment.id)}
                disabled={!replyText.trim()}
                className="px-4 py-1.5 bg-[#031466] hover:bg-blue-900 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send size={12} />
                Kirim Reply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER CHILD REPLIES RECURSIVELY */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((child: any) => (
            <CommentItem
              key={child.id}
              comment={child}
              currentUserId={currentUserId}
              replyingToCommentId={replyingToCommentId}
              setReplyingToCommentId={setReplyingToCommentId}
              replyText={replyText}
              setReplyText={setReplyText}
              onSendReply={onSendReply}
              onDeleteComment={onDeleteComment}
              onReportComment={onReportComment}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumDiskusi;
