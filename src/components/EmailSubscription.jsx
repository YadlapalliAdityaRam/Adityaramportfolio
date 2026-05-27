import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { apiUrl } from '../context/AdminContext';
import './EmailSubscription.css';

const EmailSubscription = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const response = await fetch(apiUrl('/api/notify/notify-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || data.errors?.[0]?.msg || 'Failed to subscribe.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="email-subscription-card glass-card">
      <div className="subscription-content">
        <h3>Stay Updated</h3>
        <p>Get notified about my latest projects and articles.</p>
        
        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              required
              disabled={status === 'loading' || status === 'success'}
            />
            <button 
              type="submit" 
              disabled={status === 'loading' || status === 'success'}
              className="subscribe-btn"
            >
              {status === 'loading' ? <Loader2 size={18} className="spin" /> : <ArrowRight size={18} />}
            </button>
          </div>
        </form>
        
        {status === 'success' && <p className="status-msg success">{message}</p>}
        {status === 'error' && <p className="status-msg error">{message}</p>}
      </div>
    </div>
  );
};

export default EmailSubscription;
