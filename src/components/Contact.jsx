import React, { useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { useAdmin, apiUrl } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';
import EmailSubscription from './EmailSubscription';
import './Contact.css';

const Contact = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const contact = portfolioData?.contact || {};

  const [isEditing, setIsEditing] = useState(false);
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (data) => {
    await updateSection('contact', data);
  };

  const handleMessageChange = (field, value) => {
    setMessageForm(prev => ({ ...prev, [field]: value }));
    setFormStatus('');
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setFormStatus('Sending message...');

    try {
      const response = await fetch(apiUrl('/api/notify/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageForm)
      });

      const data = await response.json();
      
      if (response.ok) {
        setFormStatus('Message sent successfully!');
        setMessageForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus(data.message || data.errors?.[0]?.msg || 'Failed to send message.');
      }
    } catch (err) {
      setFormStatus('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="glass-card" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary-accent)', background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '12px' }}>
          <Mail size={24} />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{contact.email || '[Email not set]'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary-accent)', background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '12px' }}>
          <Phone size={24} />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Phone</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{contact.phone || '[Phone not set]'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary-accent)', background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LinkedinIcon size={24} />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>LinkedIn</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {contact.linkedin ? <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>View Profile</a> : '[Not set]'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary-accent)', background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <GithubIcon size={24} />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>GitHub</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {contact.github ? <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>View Profile</a> : '[Not set]'}
          </p>
        </div>
      </div>

    </div>
  );

  return (
    <div className="page-container" id="contact">
      <div className="page-header">
        <h2 className="page-title">Let's Connect</h2>
        <p className="page-subtitle">I'm open to opportunities and collaborations.</p>
      </div>

      <div className="page-two-col">
        {/* Left Column: Contact Info */}
        <div className="page-col-left" style={{ flex: 1 }}>
          {isLoggedIn ? (
            <InlineEdit onEdit={() => setIsEditing(true)} label="Edit Contact Details">
              {content}
            </InlineEdit>
          ) : (
            content
          )}
          <EmailSubscription />
        </div>

        {/* Right Column: Contact Form */}
        <div className="page-col-right" style={{ flex: 1.5 }}>
          <div className="glass-card contact-message-card">
            <h3 className="contact-message-title">Send Me a Message</h3>
            
            <form onSubmit={handleMessageSubmit} className="contact-message-form">
              <label className="contact-message-field" htmlFor="contact-name">
                <span>Your Name</span>
                <input id="contact-name" type="text" placeholder="Enter your name" value={messageForm.name} onChange={(e) => handleMessageChange('name', e.target.value)} required />
              </label>

              <label className="contact-message-field" htmlFor="contact-email">
                <span>Your Email</span>
                <input id="contact-email" type="email" placeholder="you@example.com" value={messageForm.email} onChange={(e) => handleMessageChange('email', e.target.value)} required />
              </label>

              <label className="contact-message-field" htmlFor="contact-subject">
                <span>Subject</span>
                <input id="contact-subject" type="text" placeholder="What should we talk about?" value={messageForm.subject} onChange={(e) => handleMessageChange('subject', e.target.value)} required />
              </label>

              <label className="contact-message-field" htmlFor="contact-message">
                <span>Your Message</span>
                <textarea id="contact-message" placeholder="Write your message..." value={messageForm.message} onChange={(e) => handleMessageChange('message', e.target.value)} required />
              </label>
              
              {formStatus && (
                <p className={contact.email ? 'contact-message-status success' : 'contact-message-status error'}>{formStatus}</p>
              )}

              <button className="btn-primary contact-message-submit" type="submit" disabled={isSubmitting}>
                <Send size={18} /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <InlineFieldEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        title="Edit Contact Information"
        initialData={contact}
        fields={[
          { name: 'email', label: 'Email Address', type: 'text', placeholder: 'me@example.com' },
          { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 234 567 890' },
          { name: 'linkedin', label: 'LinkedIn Profile URL', type: 'text', placeholder: 'https://linkedin.com/in/...' },
          { name: 'github', label: 'GitHub Profile URL', type: 'text', placeholder: 'https://github.com/...' }
        ]}
      />
    </div>
  );
};

export default Contact;
