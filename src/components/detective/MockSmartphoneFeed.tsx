import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert,
  HelpCircle,
  Eye,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';
import { FeedItem } from '../../types/detective';
import { cn } from '../../lib/utils';

interface MockSmartphoneFeedProps {
  userProfile: {
    name: string;
    age: number;
    role: string;
    interests: string[];
    avatarSeed: string;
    device?: string;
  };
  feedItems: FeedItem[];
  missingItems?: FeedItem[];
  showBubbleOverlay?: boolean;
  bubbleLabel?: string;
  bubbleColor?: 'cyan' | 'amber' | 'indigo';
  isTransformed?: boolean;
  onPostClick?: (item: FeedItem) => void;
}

export const MockSmartphoneFeed: React.FC<MockSmartphoneFeedProps> = ({
  userProfile,
  feedItems,
  missingItems,
  showBubbleOverlay = false,
  bubbleLabel = "FILTER BUBBLE TERBENTUK",
  bubbleColor = "cyan",
  isTransformed = false,
  onPostClick
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Smartphone Frame Container */}
      <div className="w-full max-w-[370px] bg-slate-900 rounded-[42px] p-3 sm:p-3.5 shadow-2xl border-4 border-slate-700/80 ring-8 ring-indigo-500/10 relative">
        
        {/* Smartphone Camera Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-900 rounded-full z-40 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
          <div className="w-1.5 h-1.5 bg-blue-900/60 rounded-full" />
        </div>

        {/* Screen Bezel */}
        <div className="w-full bg-slate-950 rounded-[34px] overflow-hidden border border-slate-800 text-slate-100 flex flex-col relative h-[560px] sm:h-[600px]">
          
          {/* Top Status Bar Mock */}
          <div className="pt-4 pb-2 px-5 flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md z-30 shrink-0">
            <span className="font-mono text-slate-200 font-bold">09:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-4 h-2 border border-slate-400 rounded-[2px] p-[1px] flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* User Account Bar Mini Header */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 p-[2px] shadow-sm">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.avatarSeed}`}
                  alt={userProfile.name}
                  className="w-full h-full rounded-full bg-slate-800 object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-white">{userProfile.name}</h4>
                  <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-cyan-300 rounded font-mono">
                    {userProfile.age} th
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {userProfile.role}
                </p>
              </div>
            </div>

            {/* Interest Tags Pill */}
            <div className="text-right hidden sm:block">
              <span className="text-[9px] text-slate-400 block font-semibold">Minat:</span>
              <span className="text-[10px] text-cyan-400 font-bold">
                {userProfile.interests.join(', ')}
              </span>
            </div>
          </div>

          {/* Feed Content Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 relative custom-scrollbar">
            
            {/* FILTER BUBBLE OVERLAY ANIMATION */}
            <AnimatePresence>
              {showBubbleOverlay && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, type: 'spring', damping: 15 }}
                  className="sticky top-2 z-30 mb-3 p-3 rounded-2xl bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 border-2 border-cyan-400 backdrop-blur-md shadow-xl text-center space-y-1"
                >
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    <span>🫧 {bubbleLabel}</span>
                  </div>
                  <p className="text-[11px] text-cyan-100 font-semibold leading-tight">
                    Feed terkunci pada 1 topik yang sama secara terus-menerus.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FEED ITEMS */}
            <div className="space-y-2.5 relative">
              {feedItems.map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  onClick={() => onPostClick?.(post)}
                  className={cn(
                    "bg-slate-900/90 border rounded-2xl p-3 space-y-2 shadow-sm transition-all hover:border-cyan-400/60 cursor-pointer group",
                    showBubbleOverlay ? "border-cyan-500/30 bg-slate-900/70" : "border-slate-800",
                    isTransformed && "border-emerald-500/40 bg-slate-900/95"
                  )}
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{post.icon}</span>
                      <span className="font-bold text-slate-300 group-hover:text-cyan-300 transition-colors">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/90 bg-slate-800/80 px-2 py-0.5 rounded-md">
                      {post.tag}
                    </span>
                  </div>

                  {/* Post Content Title */}
                  <p className="text-xs font-semibold text-slate-100 leading-snug">
                    {post.title}
                  </p>

                  {/* Post Engagement Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                        <Heart size={12} className={post.category === 'sports' ? "fill-rose-500 text-rose-500" : ""} />
                        {(post.likes / 1000).toFixed(1)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {post.comments}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[9px] text-slate-400">
                      <Clock size={10} />
                      Baru saja
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* MISSING ITEMS (FOR CASE 02 - WHAT'S MISSING?) */}
            {missingItems && missingItems.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <ShieldAlert size={12} />
                    Tidak Muncul di Feed Naya (Hilang)
                  </span>
                </div>

                <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                  {missingItems.map((mItem) => (
                    <div
                      key={mItem.id}
                      className="bg-slate-900/60 border border-dashed border-rose-500/40 rounded-xl p-2.5 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-rose-300">{mItem.icon} {mItem.author}</span>
                        <span className="text-[9px] text-rose-400/80 bg-rose-950/50 px-1.5 py-0.5 rounded">
                          Tersaring Keluar
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-tight">
                        {mItem.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Bottom App Navigation Mock */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-around text-slate-400 text-xs shrink-0 z-20">
            <span className="text-cyan-400 font-bold">Linimasa</span>
            <span>Eksplor</span>
            <span>Pesan</span>
            <span>Profil</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MockSmartphoneFeed;
