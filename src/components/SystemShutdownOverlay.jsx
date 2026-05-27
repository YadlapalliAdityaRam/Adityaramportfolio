import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSystemExperience } from '../context/SystemExperienceContext';
import BrandLogo from './BrandLogo';
import './SystemShutdownOverlay.css';

const logoVariants = {
  hidden: {
    opacity: 0,
    scale: 0.08,
    y: 58,
    z: -420,
    filter: 'blur(20px) brightness(0.55)',
    transformPerspective: 1200,
    rotateX: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    z: 0,
    filter: 'blur(0px) brightness(1)',
    transformPerspective: 1200,
    rotateX: 0,
  },
};

const SystemShutdownOverlay = () => {
  const { isShuttingDown, restoreExperience } = useSystemExperience();

  return (
    <AnimatePresence>
      {isShuttingDown && (
        <motion.div
          className="system-shutdown-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.82 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          role="presentation"
        >
          <motion.button
            type="button"
            className="system-unblur-button"
            aria-label="Unblur portfolio"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.28, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={restoreExperience}
          >
            Unblur
          </motion.button>

          <motion.div
            className="system-shutdown-logo"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1.85, delay: 0.08, ease: [0.12, 0.82, 0.18, 1] }}
          >
            <motion.div
              className="system-shutdown-logo-idle"
              animate={{
                scale: [1, 1.025, 1],
                filter: [
                  'drop-shadow(0 0 26px rgba(255,255,255,0.34))',
                  'drop-shadow(0 0 38px rgba(255,255,255,0.52))',
                  'drop-shadow(0 0 26px rgba(255,255,255,0.34))',
                ],
              }}
              transition={{ duration: 2.8, delay: 2.05, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrandLogo size={260} title="Aditya portfolio logo" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemShutdownOverlay;
