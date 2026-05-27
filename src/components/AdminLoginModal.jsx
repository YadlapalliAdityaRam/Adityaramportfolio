import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { X, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import './AdminLoginModal.css';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const { login } = useAdmin();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid credentials. Try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="login-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="login-modal glass"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            {/* Close */}
            <button className="login-modal-close" onClick={onClose}>
              <X size={16} />
            </button>

            {/* Logo */}
            <div className="login-modal-icon">
              <Lock size={22} strokeWidth={1.5} />
            </div>

            <h2 className="login-modal-title">Admin Access</h2>
            <p className="login-modal-sub">Sign in to enable inline editing</p>

            <form onSubmit={handleLogin} className="login-modal-form">
              <div className="lm-field">
                <Mail size={14} className="lm-field-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>

              <div className="lm-field">
                <Lock size={14} className="lm-field-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lm-eye"
                  onClick={() => setShowPass(v => !v)}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {error && (
                <motion.p
                  className="lm-error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                className="lm-submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;
