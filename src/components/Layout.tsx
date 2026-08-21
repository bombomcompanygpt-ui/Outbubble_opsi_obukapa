import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu,
  MessageSquare,
  Globe,
  X,
  Star
} from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

import Sidebar from './Sidebar';
import BubulAssistant from './BubulAssistant';
import AuthModal from './AuthModal';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, hasChosenInitialAuth, openAuthModal } = useStore();

  // Auto show welcome gateway on initial page load if not chosen yet
  React.useEffect(() => {
    if (!hasChosenInitialAuth) {
      openAuthModal('welcome');
    }
  }, [hasChosenInitialAuth, openAuthModal]);

  // Detect screen size for responsiveness in Layout
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col md:flex-row font-sans">
      <AuthModal />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <motion.main 
        layout
        animate={{ 
          marginLeft: isMobile ? 0 : (sidebarOpen ? 280 : 88),
          paddingLeft: 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 min-h-screen relative overflow-x-hidden flex flex-col"
      >
        {/* Mobile Sticky Top Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#b8c9ff]/40 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-2xl bg-blue-50 text-[#031466] hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm active:scale-95"
              aria-label="Buka Menu"
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#031466] rounded-xl flex items-center justify-center text-white shadow-md">
                <Globe size={18} />
              </div>
              <span className="text-lg font-black text-[#031466] uppercase tracking-wider">OutBubble</span>
            </Link>
          </div>

          <Link to="/profile" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#031466] text-white rounded-full text-xs font-black shadow-md border border-white/20 hover:scale-105 transition-transform">
            <Star size={12} className="text-amber-300 fill-amber-300" />
            <span>Lvl {user?.level || 1}</span>
          </Link>
        </header>

        {/* Global Floating Virtual Assistant Bubul */}
        <BubulAssistant />

        <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;
