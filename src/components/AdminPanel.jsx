import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { X } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import './AdminPanel.css';

const AdminPanel = ({ isOpen, onClose }) => {
  const { isLoggedIn, login, logout } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className={`admin-panel-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
      if (String(e.target.className).includes('admin-panel-overlay')) onClose();
    }}>
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{isLoggedIn ? 'Admin Dashboard' : 'Admin Login'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="admin-content">
          {!isLoggedIn ? (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="admin@example.com"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="admin-btn">Login</button>
            </form>
          ) : (
            <div className="dashboard">
              <AdminDashboard />

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
