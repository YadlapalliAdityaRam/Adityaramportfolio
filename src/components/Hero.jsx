import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';
import './Hero.css';

const Hero = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const heroData = portfolioData?.hero || {};

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (data) => {
    await updateSection('hero', data);
  };

  const content = (
    <div style={{ display: 'flex', width: '100%', gap: '2rem', flexWrap: 'wrap' }}>
      <div className="hero-content">
        <h2 className="greeting">Hello, I'm</h2>
        <h1 className="name text-gradient">{heroData.name || 'Aditya.'}</h1>
        <h3 className="role">{heroData.title || 'Full Stack Developer'}</h3>
        <p className="description" style={{ whiteSpace: 'pre-line' }}>
          {heroData.description || 'I build modern, scalable and user-friendly\nweb applications that solve real-world problems.'}
        </p>
        <button className="btn-primary mt-4">
          View My Projects <ChevronRight size={18} />
        </button>
      </div>
      
      <div className="hero-image-container glass-card">
        {heroData.photoUrl ? (
          <img className="hero-profile-photo" src={heroData.photoUrl} alt={`${heroData.name || 'Profile'} profile`} />
        ) : (
          <div className="avatar-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="avatar-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Your Photo</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className="hero-section" id="hero">
      {isLoggedIn ? (
        <InlineEdit onEdit={() => setIsEditing(true)} label="Edit Hero">
          {content}
        </InlineEdit>
      ) : (
        content
      )}

      <InlineFieldEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        title="Edit Hero Section"
        initialData={{
          name: heroData.name || '',
          title: heroData.title || '',
          description: heroData.description || '',
          photoUrl: heroData.photoUrl || ''
        }}
        fields={[
          { name: 'name', label: 'Name', type: 'text', placeholder: 'e.g., John Doe' },
          { name: 'title', label: 'Role/Title', type: 'text', placeholder: 'e.g., Full Stack Developer' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'A short bio...' },
          { name: 'photoUrl', label: 'Profile Photo', type: 'image' }
        ]}
      />
    </section>
  );
};

export default Hero;
