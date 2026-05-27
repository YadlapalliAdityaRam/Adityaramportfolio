import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { LogOut } from 'lucide-react';
import './AdminToolbar.css';

const AdminToolbar = () => {
  const { isLoggedIn, logout } = useAdmin();

  return (
    <AnimatePresence>
      {isLoggedIn && (
        <motion.div
          className="admin-toolbar glass"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <button className="at-logout" onClick={logout} title="Sign Out">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminToolbar;
