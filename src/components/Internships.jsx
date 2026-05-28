import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import InlineEdit from './InlineEdit';
import InlineFieldEditor from './InlineFieldEditor';
import { Plus, Trash2 } from 'lucide-react';

const Internships = () => {
  const { portfolioData, updateSection, isLoggedIn } = useAdmin();
  const internships = portfolioData?.internships || [];

  const [editIndex, setEditIndex] = useState(null);

  const handleSave = async (data) => {
    let newInternships = [...internships];
    if (editIndex === -1) {
      newInternships.push(data);
    } else if (editIndex >= 0) {
      newInternships[editIndex] = data;
    }
    await updateSection('internships', newInternships);
  };

  const handleDelete = async (idx, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this internship?')) {
      const newInternships = internships.filter((_, i) => i !== idx);
      await updateSection('internships', newInternships);
    }
  };

  const currentEditData = editIndex >= 0 ? internships[editIndex] : {};

  return (
    <div className="page-container" id="internships">
      <div className="page-header">
        <h2 className="page-title">Internships</h2>
        <p className="page-subtitle">Professional experience and learnings.</p>
      </div>

      <div className="page-two-col">
        {/* Left Column: Timeline */}
        <div className="page-col-left">
          <div className="timeline">
            {internships.length === 0 && !isLoggedIn && (
              <p style={{ color: 'var(--text-muted)' }}>No internships available yet.</p>
            )}

            {internships.map((internship, idx) => {
              const descBullets = (internship.description || '').split('\n').map(s => s.trim()).filter(s => s);
              
              const content = (
                <div className="timeline-item glass-card" style={{ padding: '24px', marginBottom: '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ minWidth: '140px' }}>
                      <span className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary-accent)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {internship.dateFrom} - {internship.dateTo}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{internship.role}</h3>
                      <p style={{ color: 'var(--primary-accent)', fontWeight: 500, marginBottom: '12px' }}>{internship.company}</p>
                      
                      {descBullets.length > 0 && (
                        <ul style={{ color: 'var(--text-dark)', fontSize: '0.9rem', paddingLeft: '16px', marginBottom: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {descBullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  
                  {isLoggedIn && (
                    <button 
                      onClick={(e) => handleDelete(idx, e)}
                      style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', zIndex: 60 }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );

              return isLoggedIn ? (
                <InlineEdit key={idx} onEdit={() => setEditIndex(idx)} label="Edit Internship">
                  {content}
                </InlineEdit>
              ) : (
                <React.Fragment key={idx}>{content}</React.Fragment>
              );
            })}

            {isLoggedIn && (
              <button 
                onClick={() => setEditIndex(-1)}
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '8px', borderRadius: '16px' }}
              >
                <Plus size={18} /> Add Internship
              </button>
            )}
          </div>
        </div>

        {/* Right Column: What I Learned */}
        <div className="page-col-right">
          <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>What I Learned</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {internships.map((internship, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8b5cf6', flexShrink: 0 }}>
                     <span style={{ fontSize: '14px' }}>💡</span>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '2px' }}>{internship.company}</span>
                     <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dark)' }}>Key Experience Gained</p>
                   </div>
                </div>
              ))}
              
              {internships.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>Experience summaries will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <InlineFieldEditor
        isOpen={editIndex !== null}
        onClose={() => setEditIndex(null)}
        onSave={handleSave}
        title={editIndex === -1 ? "Add Internship" : "Edit Internship"}
        initialData={currentEditData}
        fields={[
          { name: 'role', label: 'Role / Title', type: 'text', placeholder: 'e.g., Software Engineering Intern' },
          { name: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g., Google' },
          { name: 'dateFrom', label: 'Start Date', type: 'text', placeholder: 'e.g., May 2023' },
          { name: 'dateTo', label: 'End Date', type: 'text', placeholder: 'e.g., Aug 2023' },
          { name: 'description', label: 'Description (One bullet per line)', type: 'textarea', placeholder: 'Developed microservices...\nImproved latency by 20%...' }
        ]}
      />
    </div>
  );
};

export default Internships;
