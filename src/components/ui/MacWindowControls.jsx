import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Minus, X } from 'lucide-react';
import { useSystemExperience } from '../../context/SystemExperienceContext';
import './MacWindowControls.css';

const controls = [
  { id: 'close', label: 'Close', color: '#ff5f57', Icon: X },
  { id: 'focus', label: 'Focus Mode', color: '#febc2e', Icon: Minus },
  { id: 'desktop', label: 'Desktop Mode', color: '#28c840', Icon: Monitor },
];

const buttonVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.72 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.08 + index * 0.08,
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
      type: 'spring',
      stiffness: 520,
      damping: 24,
    },
  }),
};

const tooltipVariants = {
  hidden: { opacity: 0, y: -4, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const MacWindowControls = ({ onClose, focusMode, onToggleFocus, desktopMode, onToggleDesktop }) => {
  const [hovered, setHovered] = useState(null);
  const { isShuttingDown, triggerShutdown } = useSystemExperience();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (isTyping) return;

      if (event.key === 'Escape') {
        if (desktopMode) onToggleDesktop?.();
        if (focusMode) onToggleFocus?.();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'q') {
        event.preventDefault();
        onClose?.();
        triggerShutdown();
      }

      if (event.key.toLowerCase() === 'd') {
        onToggleDesktop?.();
      }

      if (event.key.toLowerCase() === 'm') {
        onToggleFocus?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, desktopMode, onClose, onToggleFocus, onToggleDesktop, triggerShutdown]);

  const handleClick = (id) => {
    if (id === 'close') {
      if (isShuttingDown) return;
      onClose?.();
      triggerShutdown();
    }
    if (id === 'focus') onToggleFocus?.();
    if (id === 'desktop') onToggleDesktop?.();
  };

  const getPressed = (id) =>
    (id === 'focus' && focusMode) || (id === 'desktop' && desktopMode);

  const getActive = (id) =>
    hovered === id || getPressed(id) || (id === 'close' && isShuttingDown);

  return (
    <div className="window-controls mac-window-controls" role="group" aria-label="Window controls">
      {controls.map((control, index) => {
        const Icon = control.Icon;
        const isActive = getActive(control.id);

        return (
        <div className="mac-control-wrap" key={control.id}>
          <motion.button
            type="button"
            className={`mac-control mac-control-${control.id} ${isActive ? 'is-active' : ''}`}
            aria-label={control.id === 'close' ? 'Shutdown Experience' : control.label}
            aria-pressed={control.id === 'close' ? undefined : getPressed(control.id)}
            title={control.label}
            tabIndex={0}
            disabled={control.id === 'close' && isShuttingDown}
            custom={index}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.12 }}
            whileTap={control.id === 'close' ? { scale: 0.92, boxShadow: '0 0 22px rgba(255, 95, 87, 0.72)' } : { scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => handleClick(control.id)}
            onMouseEnter={() => setHovered(control.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(control.id)}
            onBlur={() => setHovered(null)}
            style={{ '--control-color': control.color }}
          >
            <span className="mac-control-shine" aria-hidden="true" />
            <Icon className="mac-control-icon" size={8} strokeWidth={3} aria-hidden="true" />
          </motion.button>

          <AnimatePresence>
            {hovered === control.id && (
              <motion.span
                className="mac-control-tooltip"
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {control.label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        );
      })}
    </div>
  );
};

export default MacWindowControls;
