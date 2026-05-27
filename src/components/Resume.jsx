import React, { useRef, useState } from 'react';
import { Download, FileText, PencilLine, Upload } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';

const splitLines = (value) => (value || '').split('\n').map(item => item.trim()).filter(Boolean);

const Resume = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const resume = portfolioData?.resume || {};
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async (data) => {
    await updateSection('resume', data);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateSection('resume', {
        ...resume,
        resumeUrl: reader.result,
        fileName: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const skills = splitLines(resume.skills);
  const highlights = splitLines(resume.highlights);

  const content = (
    <div className="page-two-col">
      <div className="page-col-left">
        <div className="glass-card" style={{ padding: '32px', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99,102,241,0.14)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-dark)' }}>{resume.headline || 'My Resume'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Profile, strengths, and resume link</p>
            </div>
          </div>

          <p style={{ color: 'var(--text-dark)', lineHeight: 1.7, marginBottom: '24px', whiteSpace: 'pre-line' }}>
            {resume.summary || 'Add your resume summary from admin mode.'}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {resume.resumeUrl ? (
              <a href={resume.resumeUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                <Download size={18} /> View Resume
              </a>
            ) : (
              <div className="admin-placeholder">Resume link not added yet.</div>
            )}

            {isLoggedIn && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={handleResumeUpload}
                />
                <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={16} /> Upload Resume
                </button>
              </>
            )}
          </div>

          {resume.fileName && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px' }}>
              Current file: {resume.fileName}
            </p>
          )}
        </div>
      </div>

      <div className="page-col-right">
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--text-dark)' }}>Core Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {skills.length > 0 ? skills.map((skill) => (
              <span key={skill} className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary-accent)' }}>{skill}</span>
            )) : (
              <p style={{ color: 'var(--text-muted)' }}>Skills will appear here.</p>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--text-dark)' }}>Highlights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {highlights.length > 0 ? highlights.map((item) => (
              <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <PencilLine size={16} color="var(--primary-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: 'var(--text-dark)', lineHeight: 1.5 }}>{item}</p>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)' }}>Resume highlights will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container" id="resume">
      <div className="page-header">
        <h2 className="page-title">Resume</h2>
        <p className="page-subtitle">A quick overview of my profile and experience.</p>
      </div>

      {isLoggedIn ? (
        <InlineEdit onEdit={() => setIsEditing(true)} label="Edit Resume">
          {content}
        </InlineEdit>
      ) : (
        content
      )}

      <InlineFieldEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        title="Edit Resume Section"
        initialData={{
          headline: resume.headline || '',
          summary: resume.summary || '',
          resumeUrl: resume.resumeUrl || '',
          fileName: resume.fileName || '',
          skills: resume.skills || '',
          highlights: resume.highlights || ''
        }}
        fields={[
          { name: 'headline', label: 'Headline', type: 'text', placeholder: 'e.g., Full Stack Developer Resume' },
          { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Short resume summary...' },
          { name: 'resumeUrl', label: 'Upload Resume / Resume URL', type: 'file', accept: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', placeholder: 'https://drive.google.com/...' },
          { name: 'skills', label: 'Skills (One per line)', type: 'textarea', placeholder: 'React\nNode.js\nMongoDB' },
          { name: 'highlights', label: 'Highlights (One per line)', type: 'textarea', placeholder: 'Built full-stack portfolio platform\nCompleted internship...' }
        ]}
      />
    </div>
  );
};

export default Resume;
