import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import './WindowFrame.css';
import Navbar from './Navbar';
import { Settings } from 'lucide-react';
import GenieTransition from './GenieTransition';
import SmoothScroll from './SmoothScroll';
import AdminToolbar from './AdminToolbar';
import AdminLoginModal from './AdminLoginModal';
import AdminPanel from './AdminPanel';
import { useAdmin } from '../context/AdminContext';
import MacWindowControls from './ui/MacWindowControls';

const WindowFrame = ({ children, activeTab, setActiveTab }) => {
  const { isLoggedIn } = useAdmin();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const dragControls = useDragControls();

  React.useEffect(() => {
    document.body.classList.toggle('mac-focus-mode', isFocusMode);
    document.body.classList.toggle('desktop-mode', isDesktopMode);

    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      if (isDesktopMode) {
        meta.setAttribute('content', 'width=1280, initial-scale=0.3, shrink-to-fit=no');
      } else {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    }

    return () => {
      document.body.classList.remove('mac-focus-mode', 'desktop-mode');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [isFocusMode, isDesktopMode]);

  const handleCloseExperience = () => {
    if (isAdminPanelOpen) {
      setIsAdminPanelOpen(false);
      return;
    }

    if (isLoginOpen) {
      setIsLoginOpen(false);
      return;
    }

    const closeEvent = new CustomEvent('mac-window-close', {
      detail: {
        handled: false,
        handle() {
          this.handled = true;
        },
      },
    });
    window.dispatchEvent(closeEvent);
    if (closeEvent.detail.handled) return;
  };

  const toggleFocusMode = React.useCallback(() => {
    setIsFocusMode(mode => !mode);
  }, []);

  const toggleDesktopMode = React.useCallback(() => {
    setIsDesktopMode(mode => !mode);
  }, []);

  return (
    <motion.div 
      className={`glass app-container ${isFocusMode ? 'mac-window-focus' : ''} ${isDesktopMode ? 'mac-window-desktop' : ''}`}
      drag={true}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.1}
    >
      <AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />

      {/* Window Controls Header */}
      <div 
        className="window-header"
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
        style={{ cursor: 'grab', touchAction: 'none' }}
      >
        <MacWindowControls
          onClose={handleCloseExperience}
          focusMode={isFocusMode}
          onToggleFocus={toggleFocusMode}
          desktopMode={isDesktopMode}
          onToggleDesktop={toggleDesktopMode}
        />
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <AdminToolbar />
        {!isLoggedIn && (
          <div className="window-admin-icon" onClick={(e) => { e.stopPropagation(); setIsLoginOpen(true); }} title="Admin Login">
            <Settings size={16} />
          </div>
        )}
      </div>
      
      {/* Scrollable Content Area */}
      <div className="window-content" style={{ position: 'relative', overflow: 'hidden' }}>
        <GenieTransition activeKey={activeTab}>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </GenieTransition>
      </div>
    </motion.div>
  );
};

export default WindowFrame;
