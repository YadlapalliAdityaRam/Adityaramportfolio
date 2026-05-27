import React, { useState } from 'react';
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
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  React.useEffect(() => {
    document.body.classList.toggle('mac-focus-mode', isFocusMode);
    document.body.classList.toggle('mac-fullscreen-mode', isFullscreenMode);

    return () => {
      document.body.classList.remove('mac-focus-mode', 'mac-fullscreen-mode');
    };
  }, [isFocusMode, isFullscreenMode]);

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

  const toggleFullscreenMode = React.useCallback(async () => {
    setIsFullscreenMode(mode => !mode);

    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Browser fullscreen can be blocked; the cinematic in-app mode still applies.
    }
  }, []);

  return (
    <div className={`glass app-container ${isFocusMode ? 'mac-window-focus' : ''} ${isFullscreenMode ? 'mac-window-fullscreen' : ''}`}>
      <AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />

      {/* Window Controls Header */}
      <div className="window-header">
        <MacWindowControls
          onClose={handleCloseExperience}
          focusMode={isFocusMode}
          onToggleFocus={toggleFocusMode}
          fullscreenMode={isFullscreenMode}
          onToggleFullscreen={toggleFullscreenMode}
        />
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <AdminToolbar />
        {!isLoggedIn && (
          <div className="window-admin-icon" onClick={() => setIsLoginOpen(true)} title="Admin Login">
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
    </div>
  );
};

export default WindowFrame;
