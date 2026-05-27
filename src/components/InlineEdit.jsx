import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil } from 'lucide-react';
import './InlineEdit.css';

/**
 * InlineEdit — wraps any element.
 * When admin is logged in, shows a floating pencil icon on hover.
 * Clicking calls onEdit().
 *
 * Usage:
 *   <InlineEdit onEdit={() => openModal(item)}>
 *     <div className="glass-card">…content…</div>
 *   </InlineEdit>
 */
const InlineEdit = ({ children, onEdit, label = 'Edit', style = {} }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="ie-wrapper"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      <AnimatePresence>
        {hovered && (
          <motion.button
            className="ie-btn"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            title={label}
          >
            <Pencil size={12} />
            <span>{label}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlineEdit;
